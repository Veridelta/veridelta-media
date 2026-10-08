// Speaks every line of every narrated cut into public/voice/, and writes its manifest: each
// line's file, length, and checksum, and the engine and voice that spoke it. A line is spoken
// again only when its text, engine, or voice changes, so a key is needed only for new lines.
//
// Usage:
//   npm run voice                 Google Cloud Text-to-Speech, with the key in GOOGLE_TTS_API_KEY
//   npm run voice -- --draft      espeak-ng, a robotic voice to time a draft with
//   npm run voice -- --samples    the first two lines in each voice of SAMPLES, into samples/
//
// The key travels only in a request header, on curl's standard input, never in a URL, an
// argument, a file, or a log. Every clip is trimmed of silence at both ends and set to -16
// LUFS, so the lines play at one loudness.
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { cuts } from "../src/storyboard";
import { voices, type Engine, type VoiceLine } from "../src/voice";

/** The voice of the final cut. */
const VOICE = "en-US-Chirp3-HD-Charon";
/** Voices to compare before choosing one. */
const SAMPLES = ["en-US-Chirp3-HD-Charon", "en-US-Chirp3-HD-Orus", "en-US-Chirp3-HD-Aoede", "en-US-Chirp3-HD-Kore"];
const ENDPOINT = "https://texttospeech.googleapis.com/v1/text:synthesize";
const FOLDER = join("public", "voice");

const sha256 = (data: Buffer | string) => createHash("sha256").update(data).digest("hex");

/** Speak a line with Google's API into a WAV file. */
const google = (text: string, voice: string, wav: string) => {
  const key = process.env.GOOGLE_TTS_API_KEY;
  if (!key) {
    throw new Error("Set GOOGLE_TTS_API_KEY to a Google Cloud API key that may call Text-to-Speech, or pass --draft.");
  }
  const body = JSON.stringify({
    input: { text },
    voice: { languageCode: voice.slice(0, 5), name: voice },
    audioConfig: { audioEncoding: "LINEAR16", sampleRateHertz: 48000 },
  });
  // curl reads the key's header from standard input, so no process listing shows it.
  const out = execFileSync(
    "curl",
    ["--silent", "--show-error", "--fail-with-body", "--header", "@-", "--header", "Content-Type: application/json", "--data-binary", body, ENDPOINT],
    { input: `X-Goog-Api-Key: ${key}\n`, maxBuffer: 64 * 1024 * 1024 },
  );
  writeFileSync(wav, Buffer.from(JSON.parse(out.toString()).audioContent, "base64"));
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

const seconds = (file: string) =>
  Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString());

const speak = (text: string, engine: Engine, voice: string, mp3: string, work: string) => {
  const wav = join(work, "line.wav");
  (engine === "google" ? google : espeak)(text, voice, wav);
  finish(wav, mp3);
};

/** Every line the narrated cuts say, in order, once each. */
const lines = [
  ...new Set(
    cuts.filter((cut) => cut.narrated).flatMap((cut) => cut.scenes.flatMap((scene) => (scene.voice ?? []).map(({ text }) => text))),
  ),
];

const args = process.argv.slice(2);
const work = mkdtempSync(join(tmpdir(), "voice-"));
try {
  if (args.includes("--samples")) {
    mkdirSync("samples", { recursive: true });
    for (const voice of SAMPLES) {
      const parts = lines.slice(0, 2).map((text, index) => {
        const part = join(work, `${voice}-${index}.mp3`);
        speak(text, "google", voice, part, work);
        return part;
      });
      const list = join(work, "list.txt");
      writeFileSync(list, parts.map((part) => `file '${part}'`).join("\n"));
      execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", list, "-c", "copy", join("samples", `${voice}.mp3`)]);
      console.log(`samples/${voice}.mp3`);
    }
  } else {
    const engine: Engine = args.includes("--draft") ? "espeak" : "google";
    const voice = engine === "google" ? VOICE : "en-us";
    mkdirSync(FOLDER, { recursive: true });
    const kept: VoiceLine[] = lines.map((text) => {
      const old = voices.lines.find((line) => line.text === text && line.engine === engine && line.voice === voice);
      if (old && sha256(readFileSync(join(FOLDER, old.file))) === old.sha256) {
        return old;
      }
      const file = `${sha256(`${engine}\n${voice}\n${text}`).slice(0, 16)}.mp3`;
      speak(text, engine, voice, join(FOLDER, file), work);
      console.log(`${file}: ${text}`);
      return { text, file, seconds: seconds(join(FOLDER, file)), engine, voice, sha256: sha256(readFileSync(join(FOLDER, file))) };
    });
    // A clip no line uses any more goes.
    for (const name of readdirSync(FOLDER)) {
      if (name.endsWith(".mp3") && !kept.some((line) => line.file === name)) {
        rmSync(join(FOLDER, name));
      }
    }
    writeFileSync(join(FOLDER, "manifest.json"), `${JSON.stringify({ lines: kept }, null, 2)}\n`);
    console.log(`public/voice/manifest.json: ${kept.length} lines, spoken by ${engine} as ${voice}.`);
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
