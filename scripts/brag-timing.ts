// Times the demo in brag/ by its voice and by what each scene shows. A scene of
// brag/narration.json enters, holds its picture for its `lead`, plays its lines a `gap` apart,
// then holds for its `tail`, long enough to read what landed last, before the next scene enters.
// Each scene enters on a beat of the music, the nearest one that keeps most of the tail before it.
//
// It writes three things from brag/composition/assets/voice/manifest.json, which
// `npm run voice -- --brag` writes with every word's time:
// - brag/composition/assets/timing.js, each scene's, line's, and word's times, which the timeline
//   reads;
// - the generated block of brag/composition/index.html: the music, each line's audio and caption,
//   the sound effects, and the root's length;
// - brag/demo.srt, the captions, word for word.
//
// The music is placed so that its drop lands as the scene narration.json names enters, after a
// hush in the tail before it. A sound effect plays as a scene enters, as a line starts, or on a
// word of a line, at the time Whisper heard it; the timeline's `word` in index.html looks it up
// the same way.
//
// Usage: npm run brag-timing
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** The share of a scene's tail that snapping its successor to a beat may never cut. */
const KEEP = 0.85;
/** The music's level under the voice, in the hush before its drop, on the drop, and alone on the end card. */
const BED = 0.12;
const HUSH = 0.02;
const LIFT = 0.4;
const ALONE = 0.5;

const BRAG = "brag";
const COMPOSITION = join(BRAG, "composition");
const ASSETS = join(COMPOSITION, "assets");
const START = "<!-- narration: written by scripts/brag-timing.ts; edit brag/narration.json instead -->";
const END_MARK = "<!-- /narration -->";

type Line = { id: string; scene: string; text: string };
type Word = { word: string; start: number | null; end: number | null };
type Spoken = { id: string; text: string; file: string; seconds: number; words?: Word[] };
type Effect = { scene?: string; line?: string; word?: string; file: string; volume: number };
type Narration = {
  lines: Line[];
  gap: number;
  scenes: Record<string, { lead: number; tail: number }>;
  music: { file: string; drop: number; on: string; beat: number };
  sfx: Effect[];
};

const narration = JSON.parse(readFileSync(join(BRAG, "narration.json"), "utf8")) as Narration;
const voice = JSON.parse(readFileSync(join(ASSETS, "voice", "manifest.json"), "utf8")) as { lines: Spoken[] };

const round = (seconds: number) => Math.round(seconds * 1000) / 1000;
const beat = narration.music.beat;
type Timed = Line & { file: string; start: number; end: number; words: Word[] };
const lines: Timed[] = [];
const scenes: Record<string, { enter: number; start: number; end: number; lead: number; tail: number }> = {};
const order = [...new Set(narration.lines.map((line) => line.scene))];
let enter = 0;
order.forEach((name, index) => {
  const plan = narration.scenes[name];
  if (!plan) {
    throw new Error(`brag/narration.json gives the scene "${name}" no lead and tail.`);
  }
  let at = enter + plan.lead;
  const start = at;
  for (const line of narration.lines.filter((entry) => entry.scene === name)) {
    const spoken = voice.lines.find((entry) => entry.id === line.id);
    if (!spoken || spoken.text !== line.text || !spoken.words) {
      throw new Error(`The voice has no timed take of "${line.text}"; run npm run voice -- --brag.`);
    }
    const words = spoken.words.map(({ word, start: from, end: to }) => ({
      word,
      start: from === null ? null : round(at + from),
      end: to === null ? null : round(at + to),
    }));
    lines.push({ ...line, file: spoken.file, start: round(at), end: round(at + spoken.seconds), words });
    at += spoken.seconds + narration.gap;
  }
  const end = at - narration.gap;
  scenes[name] = { enter: round(enter), start: round(start), end: round(end), lead: plan.lead, tail: plan.tail };
  if (index + 1 < order.length) {
    // The next scene enters on the beat nearest the end of this one's tail, and never so early
    // that this tail loses more than KEEP of itself.
    const planned = end + plan.tail;
    let next = Math.round(planned / beat) * beat;
    if (next < end + plan.tail * KEEP) {
      next = Math.ceil((end + plan.tail * KEEP) / beat) * beat;
    }
    enter = next;
  } else {
    enter = end + plan.tail;
  }
});
const duration = round(enter);
const last = lines[lines.length - 1];

const line = (id: string) => {
  const found = lines.find((entry) => entry.id === id);
  if (!found) {
    throw new Error(`brag/narration.json has no line "${id}".`);
  }
  return found;
};
const plain = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, "");
/** When a phrase of a line starts: the time Whisper heard its first word. */
const word = (id: string, phrase: string) => {
  const { words } = line(id);
  const wanted = phrase.split(/\s+/).map(plain);
  const index = words.findIndex((_, at) => wanted.every((token, offset) => plain(words[at + offset]?.word ?? "") === token));
  const found = words[index];
  if (!found) {
    throw new Error(`The line "${id}" has no "${phrase}".`);
  }
  if (found.start === null) {
    throw new Error(`Whisper did not hear "${found.word}" in the line "${id}"; cue a word it heard.`);
  }
  return found.start;
};
const when = (effect: Effect) => {
  if (effect.scene) {
    return scenes[effect.scene].enter;
  }
  if (effect.line && effect.word) {
    return word(effect.line, effect.word);
  }
  if (effect.line) {
    return line(effect.line).start;
  }
  throw new Error(`A sound effect needs a scene or a line: ${JSON.stringify(effect)}.`);
};
const length = (file: string) =>
  round(Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString()));

const timing = {
  duration,
  scenes,
  lines: Object.fromEntries(lines.map(({ id, text, start, end, words }) => [id, { text, start, end, words }])),
};
writeFileSync(
  join(ASSETS, "timing.js"),
  `// Written by scripts/brag-timing.ts from the voice's words; edit brag/narration.json instead.\nwindow.TIMING = ${JSON.stringify(timing, null, 2)};\n`,
);

// The music sits under the voice, hushes in the tail before its drop, lifts on the drop until the
// next line, rises on the end card, and fades out. Every scene enters on one of its beats, so the
// drop, itself a beat, lands as its scene enters.
const drop = scenes[narration.music.on];
const before = lines[lines.findIndex((entry) => entry.scene === narration.music.on) - 1];
if (!drop || !before || narration.music.drop < drop.enter) {
  throw new Error(`The music's drop at ${narration.music.drop}s cannot land on the scene "${narration.music.on}".`);
}
const from = round(narration.music.drop - drop.enter);
const lane = {
  version: 1,
  lanes: [
    {
      target: "volume",
      points: [
        { t: 0, v: BED },
        { t: before.end, v: BED },
        { t: round(before.end + 0.3), v: HUSH },
        { t: round(drop.enter - 0.02), v: HUSH },
        { t: drop.enter, v: LIFT },
        { t: round(drop.start - 0.15), v: LIFT },
        { t: drop.start, v: BED },
        { t: last.end, v: BED },
        { t: round(last.end + 0.8), v: ALONE },
        { t: round(duration - 1.5), v: ALONE },
        { t: duration, v: 0 },
      ],
    },
  ],
};
const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const block = [
  START,
  `      <!-- Music: Sascha Ende, "Happy Beats / Business Moves, Vol. 1", ende.app, CC BY 4.0. -->`,
  `      <audio id="music" data-start="0" data-duration="${duration}" data-media-start="${from}" data-track-index="10" src="assets/music/${narration.music.file}" data-automation='${JSON.stringify(lane)}'></audio>`,
  `      <!-- Sound effects: Kenney, CC0. -->`,
  ...narration.sfx.map(
    (effect, index) =>
      `      <audio id="sfx-${index + 1}" data-start="${round(when(effect))}" data-duration="${length(join(ASSETS, "sfx", effect.file))}" data-track-index="${11 + (index % 4)}" data-volume="${effect.volume}" src="assets/sfx/${effect.file}"></audio>`,
  ),
  ...lines.map(
    (entry, index) =>
      `      <audio id="voice-${entry.id}" data-start="${entry.start}" data-duration="${round(entry.end - entry.start)}" data-track-index="${30 + (index % 2)}" data-volume="1" src="assets/voice/${entry.file}"></audio>`,
  ),
  `      <div id="captions">`,
  ...lines.map((entry) => `        <div class="caption" id="caption-${entry.id}"><span>${escape(entry.text)}</span></div>`),
  `      </div>`,
  `      ${END_MARK}`,
].join("\n");

const indexPath = join(COMPOSITION, "index.html");
let html = readFileSync(indexPath, "utf8");
const start = html.indexOf(START);
const stop = html.indexOf(END_MARK);
if (start < 0 || stop < 0) {
  throw new Error(`${indexPath} has no generated block between ${START} and ${END_MARK}.`);
}
html = html.slice(0, start) + block + html.slice(stop + END_MARK.length);
html = html.replace(/(<div\s+id="root"[^>]*?data-duration=")[\d.]+(")/s, `$1${duration}$2`);
writeFileSync(indexPath, html);

const clock = (seconds: number) => {
  const ms = Math.round(seconds * 1000);
  const pad = (value: number, width = 2) => String(value).padStart(width, "0");
  return `${pad(Math.floor(ms / 3600000))}:${pad(Math.floor(ms / 60000) % 60)}:${pad(Math.floor(ms / 1000) % 60)},${pad(ms % 1000, 3)}`;
};
writeFileSync(
  join(BRAG, "demo.srt"),
  lines.map((entry, index) => `${index + 1}\n${clock(entry.start)} --> ${clock(entry.end)}\n${entry.text}\n`).join("\n"),
);

console.log(`brag/: ${lines.length} lines in ${order.length} scenes, ${duration} seconds; the music starts ${from}s in.`);
order.forEach((name, index) => {
  const scene = scenes[name];
  const next = index + 1 < order.length ? scenes[order[index + 1]].enter : duration;
  console.log(
    `  ${name.padEnd(10)} enters ${scene.enter.toFixed(2)}, lead ${(scene.start - scene.enter).toFixed(2)}, voice ${(scene.end - scene.start).toFixed(2)}, tail ${(next - scene.end).toFixed(2)} (planned ${scene.tail})`,
  );
});
