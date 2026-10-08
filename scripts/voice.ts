// Speaks every line of every narrated cut into public/voice/, and writes its manifest: each
// line's file, length, and checksum, and the engine and voice that spoke it. A scene is spoken
// again only when a line's text, the engine, or the voice changes, so the key is needed only
// for new lines.
//
// Usage:
//   npm run voice                 Gemini's speech model, with the key in GEMINI_API_KEY
//   npm run voice -- --draft      espeak-ng, a robotic voice to time a draft with
//   npm run voice -- --samples    the first scene in each voice of SAMPLES, into samples/
//   npm run voice -- --samples Orus,Sulafat    the first scene in the voices named
//
// Gemini reads a scene's lines in one request, which sounds more even and spends fewer of the
// free tier's few requests a day, with a long pause between lines; scripts/split-lines.ts then
// cuts the clip into its lines. The speech model reads its text word for word, so how to read
// goes apart from the text, in STYLE. A
// scene it cannot cut safely is spoken again a line at a time. The key travels only in a request
// header, on curl's standard input, never in a URL, an argument, a file, or a log. Every clip is
// trimmed of silence at both ends and set to -16 LUFS, so the lines play at one loudness.
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { cuts as cutsOf, cut, duration } from "./split-lines";
import { cuts } from "../src/storyboard";
import { voices, type Engine, type VoiceLine } from "../src/voice";

/** The voice of the final cut, one of Gemini's prebuilt voices. */
const VOICE = "Sulafat";
/** Voices to compare before choosing one: two lower, two higher. */
const SAMPLES = ["Charon", "Iapetus", "Sulafat", "Kore"];
/** How the voice reads every line, sent apart from the text so it is never read aloud. */
const STYLE = `AUDIO PROFILE: The narrator of a short demo video for a command-line data tool.
THE SCENE: A two-minute walkthrough, watched by engineers and hiring managers.
DIRECTOR'S NOTES:
- Style: Energetic and authoritative. Confident, clear, and warm, with a vocal smile, never salesy.
- Pace: Brisk but unhurried, with crisp consonants.
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

/** Speak text with Gemini into a WAV file, in the STYLE given apart, waiting out a per-minute limit. */
const gemini = (text: string, voice: string, wav: string) => {
  const body = JSON.stringify({
    model: model(),
    input: [{ type: "text", text, annotations: [{ type: "speech_metadata", style: STYLE }] }],
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
    const perDay = JSON.stringify(details).includes("PerDay");
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

/** Trim silence from both ends, and set the clip to -16 LUFS in two passes, as an MP3. */
const finish = (wav: string, mp3: string) => {
  const trim =
    "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse";
  const target = "I=-16:TP=-1.5:LRA=11";
  // The first pass measures; ffmpeg prints the measurement as JSON on standard error.
  const log = spawnSync("ffmpeg", [
    "-hide_banner", "-nostats", "-i", wav, "-af", `${trim},loudnorm=${target}:print_format=json`, "-f", "null", "-",
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
    "-hide_banner", "-loglevel", "error", "-y", "-i", wav,
    "-af", `${trim},loudnorm=${target}:${second}`,
    "-ar", "48000", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "160k", mp3,
  ]);
};

/**
 * The text for a scene's lines: the lines and a long pause between each two, and nothing else,
 * since the speech model reads aloud whatever text it is given. The pause tag is the model's own
 * and is not spoken.
 */
const prompt = (lines: string[]) => lines.join("\n\n<long pause>\n\n");

/** Seconds per character of each line Gemini has spoken in this run, to check the next by. */
const paces: number[] = [];

/** Why a line spoken alone cannot be trusted, such as a read-out style, or undefined. */
const offPace = (wav: string, line: string) => {
  if (paces.length === 0) {
    return undefined;
  }
  const median = [...paces].sort((a, b) => a - b)[Math.floor(paces.length / 2)];
  const pace = duration(wav) / line.length;
  return pace < 0.6 * median || pace > 1.6 * median ? `"${line}" took ${duration(wav).toFixed(1)} seconds, off the voice's pace` : undefined;
};

/** Speak a scene's lines into one WAV per line, in order. */
const speakScene = (lines: string[], engine: Engine, voice: string, work: string): string[] => {
  const each = lines.map((_, index) => join(work, `line-${index}.wav`));
  if (engine === "espeak") {
    lines.forEach((line, index) => espeak(line, voice, each[index]));
    return each;
  }
  const whole = join(work, "scene.wav");
  gemini(prompt(lines), voice, whole);
  const points = lines.length === 1 ? (offPace(whole, lines[0]) ?? []) : cutsOf(whole, lines);
  if (typeof points === "string") {
    console.log(`Cannot cut "${lines[0].slice(0, 40)}..." safely (${points}); speaking it a line at a time.`);
    lines.forEach((line, index) => {
      gemini(prompt([line]), voice, each[index]);
      const problem = offPace(each[index], line);
      if (problem) {
        throw new Error(`${problem}; listen to it, then set GEMINI_TTS_MODEL to another speech model.`);
      }
    });
    return each;
  }
  const bounds = [0, ...points, duration(whole)];
  lines.forEach((line, index) => {
    cut(whole, bounds[index], bounds[index + 1], each[index]);
    paces.push(duration(each[index]) / line.length);
  });
  return each;
};

/** Every narrated scene's lines, in order. */
const scenes = cuts
  .filter((entry) => entry.narrated)
  .flatMap((entry) => entry.scenes)
  .map((scene) => (scene.voice ?? []).map(({ text }) => text))
  .filter((lines) => lines.length > 0);

const args = process.argv.slice(2);
const work = mkdtempSync(join(tmpdir(), "voice-"));
try {
  if (args.includes("--samples")) {
    mkdirSync("samples", { recursive: true });
    const named = args[args.indexOf("--samples") + 1];
    for (const voice of named && !named.startsWith("--") ? named.split(",") : SAMPLES) {
      const wav = join(work, `${voice}.wav`);
      gemini(prompt(scenes[0]), voice, wav);
      finish(wav, join("samples", `${voice}.mp3`));
      console.log(`samples/${voice}.mp3`);
    }
  } else {
    const engine: Engine = args.includes("--draft") ? "espeak" : "gemini";
    const voice = engine === "gemini" ? VOICE : "en-us";
    mkdirSync(FOLDER, { recursive: true });
    const kept = new Map<string, VoiceLine>();
    const save = () =>
      writeFileSync(
        join(FOLDER, "manifest.json"),
        `${JSON.stringify({ lines: scenes.flat().flatMap((text) => kept.get(text) ?? voices.lines.filter((line) => line.text === text)) }, null, 2)}\n`,
      );
    for (const lines of scenes) {
      const old = lines.map((text) => voices.lines.find((line) => line.text === text && line.engine === engine && line.voice === voice));
      if (old.every((line) => line && sha256(readFileSync(join(FOLDER, line.file))) === line.sha256)) {
        old.forEach((line) => kept.set(line!.text, line!));
        continue;
      }
      const wavs = speakScene(lines, engine, voice, work);
      lines.forEach((text, index) => {
        const file = `${sha256(`${engine}\n${voice}\n${text}`).slice(0, 16)}.mp3`;
        finish(wavs[index], join(FOLDER, file));
        kept.set(text, { text, file, seconds: duration(join(FOLDER, file)), engine, voice, sha256: sha256(readFileSync(join(FOLDER, file))) });
        console.log(`${file}: ${text}`);
      });
      // Saved after each scene, so a limit reached partway keeps what was spoken.
      save();
    }
    save();
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
