// Speaks every line of every narrated cut into public/voice/, and writes its manifest: each
// line's file, length, and checksum, the engine and voice that spoke it, and the take it came
// from. A cut is spoken again only when a line's text, the engine, or the voice changes, so the
// key is needed only then.
//
// Usage:
//   npm run voice                 Gemini's speech model, with the key in GEMINI_API_KEY
//   npm run voice -- --draft      espeak-ng, a robotic voice to time a draft with
//   npm run voice -- --again      speak every take again, as after a change to STYLE
//   npm run voice -- --samples    the first scene in each voice of SAMPLES, into samples/
//   npm run voice -- --samples Orus,Sulafat    the first scene in the voices named
//   npm run voice -- --brag       the demo in brag/: brag/narration.json, in its own voice and
//                                 style, into brag/composition/assets/voice/
//
// Gemini reads a whole cut in one request, a take, with a long pause between lines, so every
// line has the same tone. scripts/align.py hears where each line's words are, with Whisper on
// the CPU, through uv, and scripts/split-lines.ts cuts the take between them. A take it cannot
// cut safely, such as one that skips or garbles a line, is spoken again whole, never a line at
// a time. The speech model reads its text word for word, so how to read goes apart from the
// text, in STYLE. The key travels only in a request header, on curl's standard input, never in
// a URL, an argument, a file, or a log. The take is set to -16 LUFS once, before it is cut, so
// the lines keep its levels, and each clip is trimmed of silence at both ends.
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { cuts as cutsOf, cut, duration, type Span } from "./split-lines";
import { cuts } from "../src/storyboard";
import { voices, type Engine, type VoiceLine } from "../src/voice";

/** The voice of the final cut, one of Gemini's prebuilt voices. */
const VOICE = "Orus";
/** Voices to compare before choosing one: two lower, two higher. */
const SAMPLES = ["Charon", "Iapetus", "Sulafat", "Kore"];
/** How the voice reads every line, sent apart from the text so it is never read aloud. */
const STYLE = `AUDIO PROFILE: The narrator of a short demo video for a command-line data tool.
THE SCENE: A three-minute story, watched by engineers and hiring managers.
DIRECTOR'S NOTES:
- Style: Warm and confident, telling one engineer's story. Clear, with a vocal smile, never salesy.
- Pace: Calm and steady, a storyteller's pace, with crisp consonants. Keep pauses inside a sentence short.
- Accent: Neutral American English.`;
const API = "https://generativelanguage.googleapis.com/v1beta";
const FOLDER = join("public", "voice");

const sha256 = (data: Buffer | string) => createHash("sha256").update(data).digest("hex");
const sleep = (seconds: number) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, seconds * 1000);

const key = () => {
  const value = process.env.GEMINI_API_KEY;
  if (!value) {
    throw new Error("Set GEMINI_API_KEY to a key from Google AI Studio, or pass --draft.");
  }
  return value;
};

/** Call the Gemini API with the key in a header that curl reads from standard input. */
const call = (path: string, body?: string): { status: number; json: any } => {
  const args = ["--silent", "--show-error", "--header", "@-", "--write-out", "\n%{http_code}"];
  if (body) {
    args.push("--header", "Content-Type: application/json", "--data-binary", body);
  }
  const out = execFileSync("curl", [...args, `${API}/${path}`], {
    input: `x-goog-api-key: ${key()}\n`,
    maxBuffer: 256 * 1024 * 1024,
  }).toString();
  const split = out.lastIndexOf("\n");
  return { status: Number(out.slice(split + 1)), json: JSON.parse(out.slice(0, split) || "{}") };
};

/** The speech model to use: GEMINI_TTS_MODEL, or the newest flash model that speaks. */
const model = (() => {
  let chosen: string | undefined;
  return () => {
    if (chosen) {
      return chosen;
    }
    chosen = process.env.GEMINI_TTS_MODEL;
    if (!chosen) {
      const { status, json } = call("models?pageSize=1000");
      if (status !== 200) {
        throw new Error(`Gemini answered ${status} when listing models: ${json.error?.message ?? "no message"}`);
      }
      const speaking = ((json.models ?? []) as { name: string; supportedGenerationMethods?: string[] }[])
        .filter((entry) => entry.name.includes("tts") && entry.supportedGenerationMethods?.includes("generateContent"))
        .map((entry) => entry.name.replace(/^models\//, ""))
        .sort((a, b) => Number(b.includes("flash")) - Number(a.includes("flash")) || b.localeCompare(a));
      chosen = speaking[0];
      if (!chosen) {
        throw new Error("The key's project lists no speech model. Set GEMINI_TTS_MODEL to one.");
      }
    }
    console.log(`Speaking with ${chosen}.`);
    return chosen;
  };
})();

/** The first audio in a response, wherever the API put it: base64 data and its type. */
const audioIn = (value: any): { data: string; type: string } | undefined => {
  if (!value || typeof value !== "object") {
    return undefined;
  }
  const type = value.mime_type ?? value.mimeType;
  if (typeof value.data === "string" && typeof type === "string" && type.startsWith("audio/")) {
    return { data: value.data, type };
  }
  for (const inner of Object.values(value)) {
    const found = audioIn(inner);
    if (found) {
      return found;
    }
  }
  return undefined;
};

/** Speak text with Gemini into a WAV file, in a style given apart, waiting out a per-minute limit. */
const gemini = (text: string, voice: string, wav: string, style = STYLE) => {
  const body = JSON.stringify({
    model: model(),
    input: [{ type: "text", text, annotations: [{ type: "speech_metadata", style }] }],
    response_format: { type: "audio" },
    generation_config: { speech_config: [{ voice }] },
  });
  for (let attempt = 1; ; attempt++) {
    const { status, json } = call("interactions", body);
    if (status === 200) {
      const audio = audioIn(json);
      if (!audio) {
        throw new Error(`Gemini returned no audio: ${JSON.stringify(json).slice(0, 300)}`);
      }
      const bytes = Buffer.from(audio.data, "base64");
      if (bytes.subarray(0, 4).toString() === "RIFF") {
        writeFileSync(wav, bytes);
      } else {
        // Raw 16-bit PCM, mono, at the rate the type names.
        const rate = /rate=(\d+)/.exec(audio.type)?.[1] ?? "24000";
        writeFileSync(`${wav}.pcm`, bytes);
        execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-f", "s16le", "-ar", rate, "-ac", "1", "-i", `${wav}.pcm`, wav]);
      }
      return;
    }
    const details: any[] = json.error?.details ?? [];
    const perDay = JSON.stringify(details).includes("PerDay") || /per day/i.test(json.error?.message ?? "");
    const wait = Number(/([\d.]+)s/.exec(details.find((entry) => entry.retryDelay)?.retryDelay ?? "")?.[1] ?? 30);
    if (status !== 429 || perDay || attempt > 5) {
      throw new Error(
        perDay
          ? "The free tier's requests for today are spent. Every line spoken so far is saved; run this again tomorrow."
          : `Gemini answered ${status}: ${json.error?.message ?? "no message"}`,
      );
    }
    console.log(`Rate limited; waiting ${wait} seconds.`);
    sleep(wait + 1);
  }
};

/** Speak a line with espeak-ng into a WAV file, for a draft. */
const espeak = (text: string, voice: string, wav: string) => {
  execFileSync("espeak-ng", ["-v", voice, "-s", "160", "-w", wav, text]);
};

/** Set a WAV to -16 LUFS in two passes, as one gain for all of it. */
const level = (wav: string, out: string) => {
  const target = "I=-16:TP=-1.5:LRA=11";
  // The first pass measures; ffmpeg prints the measurement as JSON on standard error.
  const log = spawnSync("ffmpeg", [
    "-hide_banner", "-nostats", "-i", wav, "-af", `loudnorm=${target}:print_format=json`, "-f", "null", "-",
  ]).stderr.toString();
  const measured = JSON.parse(log.slice(log.lastIndexOf("{"), log.lastIndexOf("}") + 1));
  const second = [
    `measured_I=${measured.input_i}`,
    `measured_TP=${measured.input_tp}`,
    `measured_LRA=${measured.input_lra}`,
    `measured_thresh=${measured.input_thresh}`,
    `offset=${measured.target_offset}`,
    "linear=true",
  ].join(":");
  execFileSync("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-y", "-i", wav, "-af", `loudnorm=${target}:${second}`, "-ar", "48000", "-ac", "1", out,
  ]);
};

/** Trim silence from both ends of a clip, as an MP3, at the level it has. */
const finish = (wav: string, mp3: string) => {
  const trim =
    "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse";
  execFileSync("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-y", "-i", wav, "-af", trim, "-ar", "48000", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "160k", mp3,
  ]);
};

/**
 * The text for a take's lines: the lines and two long pauses between each two, and nothing else,
 * since the speech model reads aloud whatever text it is given. The pause tag is the model's own
 * and is not spoken. Two make the gap between lines several times any pause inside one, so the
 * take cuts cleanly.
 */
const prompt = (lines: string[]) => lines.join("\n\n<long pause> <long pause>\n\n");

/** Takes to try before giving up on a cut that will not split. */
const TRIES = 3;
/** The faster-whisper release scripts/align.py runs with, through uvx. */
const WHISPER = "1.2.1";

/** Speak a cut's lines in one take, at one level, and cut it into one WAV per line, in order. */
const speakTake = (
  lines: string[],
  engine: Engine,
  voice: string,
  work: string,
  style = STYLE,
): { wavs: string[]; take: string } => {
  const each = lines.map((_, index) => join(work, `line-${index}.wav`));
  if (engine === "espeak") {
    lines.forEach((line, index) => espeak(line, voice, each[index]));
    return { wavs: each, take: "espeak" };
  }
  for (let attempt = 1; attempt <= TRIES; attempt++) {
    const raw = join(work, "take-raw.wav");
    const whole = join(work, "take.wav");
    gemini(prompt(lines), voice, raw, style);
    level(raw, whole);
    writeFileSync(join(work, "lines.json"), JSON.stringify(lines));
    const heard = execFileSync("uvx", ["--quiet", "--from", `faster-whisper==${WHISPER}`, "python", join("scripts", "align.py"), whole, join(work, "lines.json")], {
      maxBuffer: 64 * 1024 * 1024,
    }).toString();
    const points = cutsOf(whole, lines, JSON.parse(heard) as Span[]);
    if (typeof points === "string") {
      console.log(`Take ${attempt} of ${TRIES} (${duration(whole).toFixed(1)} seconds) cannot be cut safely: ${points}.`);
      continue;
    }
    const bounds = [0, ...points, duration(whole)];
    lines.forEach((_, index) => cut(whole, bounds[index], bounds[index + 1], each[index]));
    const take = sha256(readFileSync(whole)).slice(0, 12);
    console.log(`Take ${take}: ${duration(whole).toFixed(1)} seconds, ${lines.length} lines.`);
    return { wavs: each, take };
  }
  throw new Error(`No take of ${TRIES} could be cut into its ${lines.length} lines; the lines spoken before are kept.`);
};

/** Every narrated cut's lines, in order, one take to a cut. */
const takes = cuts
  .filter((entry) => entry.narrated)
  .map((entry) => entry.scenes.flatMap((scene) => (scene.voice ?? []).map(({ text }) => text)))
  .filter((lines) => lines.length > 0);

/** The demo in brag/: its narration, and where its clips and their manifest go. */
const BRAG = join("brag", "narration.json");
const BRAG_FOLDER = join("brag", "composition", "assets", "voice");

type BragLine = { id: string; scene: string; text: string };
type BragNarration = { voice: string; style: string; pause: number; tempo: number; lines: BragLine[] };

/**
 * Tighten a line for a fast cut: every pause inside it longer than `pause` seconds is shortened
 * to that, and the line plays `tempo` times as fast, at the same pitch. No word changes.
 */
const tighten = (wav: string, out: string, pause: number, tempo: number) => {
  const filters = [`silenceremove=stop_periods=-1:stop_duration=${pause}:stop_silence=${pause}:stop_threshold=-38dB`];
  if (tempo !== 1) {
    filters.push(`atempo=${tempo}`);
  }
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", wav, "-af", filters.join(","), out]);
};
/** A word of a line, and when it starts and ends in its clip, or null where Whisper missed it. */
type BragWord = { word: string; start: number | null; end: number | null };
type BragVoice = VoiceLine & { id: string; words?: BragWord[] };

/**
 * Time every word of each clip with scripts/align.py, so the demo's animation lands on the
 * word it shows rather than on a guess.
 */
const timeWords = (lines: BragVoice[]): BragVoice[] => {
  const clips = join(work, "clips.json");
  writeFileSync(clips, JSON.stringify(lines.map((line) => ({ audio: join(BRAG_FOLDER, line.file), text: line.text }))));
  const timed = JSON.parse(
    execFileSync("uvx", ["--quiet", "--from", `faster-whisper==${WHISPER}`, "python", join("scripts", "align.py"), "--words", clips], {
      maxBuffer: 64 * 1024 * 1024,
    }).toString(),
  ) as BragWord[][];
  return lines.map((line, index) => ({ ...line, words: timed[index] }));
};

/**
 * Speak the demo's narration in one take, as a narrated cut is, into its own folder. Its lines
 * are spoken again only when a line's text, the voice, the style, the pause, or the engine
 * changes. When only the tempo changes, the clips already spoken play again at the new speed, so
 * the take stays the one heard, and no request is made. Every clip's words are then timed.
 */
const speakBrag = (engine: Engine, again: boolean) => {
  const narration = JSON.parse(readFileSync(BRAG, "utf8")) as BragNarration;
  const voice = engine === "gemini" ? narration.voice : "en-us";
  const style = engine === "gemini" ? narration.style : "";
  const lines = narration.lines.map(({ text }) => text);
  mkdirSync(BRAG_FOLDER, { recursive: true });
  const manifestPath = join(BRAG_FOLDER, "manifest.json");
  const old: { style?: string; pause?: number; tempo?: number; lines: BragVoice[] } = (() => {
    try {
      return JSON.parse(readFileSync(manifestPath, "utf8"));
    } catch {
      return { lines: [] };
    }
  })();
  const sameTake =
    !again &&
    old.style === style &&
    old.pause === narration.pause &&
    old.lines.length === lines.length &&
    old.lines.every(
      (line, index) =>
        line.text === lines[index] &&
        line.voice === voice &&
        line.engine === engine &&
        line.take === old.lines[0].take &&
        existsSync(join(BRAG_FOLDER, line.file)) &&
        sha256(readFileSync(join(BRAG_FOLDER, line.file))) === line.sha256,
    );
  const write = (kept: BragVoice[]) =>
    writeFileSync(
      manifestPath,
      `${JSON.stringify({ style, pause: narration.pause, tempo: narration.tempo, lines: kept }, null, 2)}\n`,
    );
  if (sameTake && old.tempo === narration.tempo) {
    if (old.lines.every((line) => line.words)) {
      console.log(`${manifestPath}: all ${lines.length} lines are spoken already, in take ${old.lines[0].take}.`);
    } else {
      write(timeWords(old.lines));
      console.log(`${manifestPath}: timed the words of take ${old.lines[0].take}.`);
    }
    return;
  }
  const name = (id: string, text: string, take: string) =>
    `${id}-${sha256(`${engine}\n${voice}\n${take}\n${narration.tempo}\n${text}`).slice(0, 12)}.mp3`;
  const keep = (id: string, text: string, take: string, file: string): BragVoice => {
    const seconds = duration(join(BRAG_FOLDER, file));
    console.log(`${file} ${seconds.toFixed(2)}s: ${text}`);
    return { id, text, file, seconds, engine, voice, take, sha256: sha256(readFileSync(join(BRAG_FOLDER, file))) };
  };
  let kept: BragVoice[];
  const heard = old.lines[0]?.take;
  if (sameTake && old.tempo && heard) {
    const take = heard;
    const ratio = narration.tempo / old.tempo;
    kept = old.lines.map(({ id, text, file: was }, index) => {
      const file = name(id, text, take);
      const replayed = join(work, `replayed-${index}.wav`);
      execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", join(BRAG_FOLDER, was), "-af", `atempo=${ratio}`, replayed]);
      finish(replayed, join(BRAG_FOLDER, file));
      return keep(id, text, take, file);
    });
    console.log(`Played take ${take} again at tempo ${narration.tempo}, ${ratio.toFixed(4)} times its last speed.`);
  } else {
    const { wavs, take } = speakTake(lines, engine, voice, work, style);
    kept = narration.lines.map(({ id, text }, index) => {
      const file = name(id, text, take);
      const tight = join(work, `tight-${index}.wav`);
      tighten(wavs[index], tight, narration.pause, narration.tempo);
      finish(tight, join(BRAG_FOLDER, file));
      return keep(id, text, take, file);
    });
  }
  kept = timeWords(kept);
  write(kept);
  for (const name of readdirSync(BRAG_FOLDER)) {
    if (name.endsWith(".mp3") && !kept.some((line) => line.file === name)) {
      rmSync(join(BRAG_FOLDER, name));
    }
  }
  console.log(`${manifestPath}: ${kept.length} lines, spoken by ${engine} as ${voice}, ${kept.reduce((sum, line) => sum + line.seconds, 0).toFixed(1)} seconds of voice.`);
};

const args = process.argv.slice(2);
const work = mkdtempSync(join(tmpdir(), "voice-"));
try {
  if (args.includes("--brag")) {
    speakBrag(args.includes("--draft") ? "espeak" : "gemini", args.includes("--again"));
  } else if (args.includes("--samples")) {
    mkdirSync("samples", { recursive: true });
    const named = args[args.indexOf("--samples") + 1];
    const first = takes[0].slice(0, 3);
    for (const voice of named && !named.startsWith("--") ? named.split(",") : SAMPLES) {
      const wav = join(work, `${voice}.wav`);
      gemini(prompt(first), voice, wav);
      level(wav, join(work, `${voice}-level.wav`));
      finish(join(work, `${voice}-level.wav`), join("samples", `${voice}.mp3`));
      console.log(`samples/${voice}.mp3`);
    }
  } else {
    const engine: Engine = args.includes("--draft") ? "espeak" : "gemini";
    const voice = engine === "gemini" ? VOICE : "en-us";
    mkdirSync(FOLDER, { recursive: true });
    const kept = new Map<string, VoiceLine>();
    for (const lines of takes) {
      const old = lines.map((text) => voices.lines.find((line) => line.text === text && line.engine === engine && line.voice === voice));
      const one = new Set(old.map((line) => line?.take));
      const reuse = !args.includes("--again") && one.size === 1;
      if (reuse && old.every((line) => line && sha256(readFileSync(join(FOLDER, line.file))) === line.sha256)) {
        old.forEach((line) => kept.set(line!.text, line!));
        continue;
      }
      const { wavs, take } = speakTake(lines, engine, voice, work);
      lines.forEach((text, index) => {
        const file = `${sha256(`${engine}\n${voice}\n${take}\n${text}`).slice(0, 16)}.mp3`;
        finish(wavs[index], join(FOLDER, file));
        const seconds = duration(join(FOLDER, file));
        kept.set(text, { text, file, seconds, engine, voice, take, sha256: sha256(readFileSync(join(FOLDER, file))) });
        console.log(`${file} ${seconds.toFixed(2)}s: ${text}`);
      });
    }
    writeFileSync(
      join(FOLDER, "manifest.json"),
      `${JSON.stringify({ lines: takes.flat().flatMap((text) => kept.get(text) ?? []) }, null, 2)}\n`,
    );
    // A clip no line uses any more goes.
    for (const name of readdirSync(FOLDER)) {
      if (name.endsWith(".mp3") && ![...kept.values()].some((line) => line.file === name)) {
        rmSync(join(FOLDER, name));
      }
    }
    console.log(`public/voice/manifest.json: ${kept.size} lines, spoken by ${engine} as ${voice}.`);
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
