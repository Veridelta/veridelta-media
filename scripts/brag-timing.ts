// Times the demo in brag/ by its voice. Each line of brag/narration.json starts once the line
// before it ends: a short gap inside a scene, a longer one where the scene changes so the picture
// can move first, and a hold where the story should land. The end card holds after the last line.
//
// It writes three things from brag/composition/assets/voice/manifest.json, which
// `npm run voice -- --brag` writes:
// - brag/composition/assets/timing.js, each line's and each scene's times, which the timeline reads;
// - the generated block of brag/composition/index.html: the music, each line's audio and caption,
//   the sound effects, and the root's length;
// - brag/demo.srt, the captions, word for word.
//
// The music is placed so that its drop lands as the scene narration.json names enters, after a
// hush in the hold before it. A sound effect plays as a scene enters, as a line starts, or at a
// word of a line, whose time is estimated from where the word falls in the line's text; the
// timeline's `word` in index.html estimates it the same way.
//
// Usage: npm run brag-timing
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** Seconds before the first line. */
const LEAD = 0.6;
/** Seconds between two lines of one scene. */
const GAP = 0.2;
/** Seconds between the last line of a scene and the first of the next, as the picture moves. */
const SCENE = 0.9;
/** Seconds a scene enters before the end of the scene before it, plus that one's hold. */
const ENTER = 0.15;
/** Seconds held after a line, beyond the gap, where the story should land. */
const HOLD: Record<string, number> = { question: 1.9, forgiven: 0.4, model: 0.4, fails: 0.3 };
/** Seconds the end card holds after the last line. */
const END = 4.2;
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
type Spoken = { id: string; text: string; file: string; seconds: number };
type Effect = { scene?: string; line?: string; word?: string; file: string; volume: number };
type Narration = { lines: Line[]; music: { file: string; drop: number; on: string }; sfx: Effect[] };

const narration = JSON.parse(readFileSync(join(BRAG, "narration.json"), "utf8")) as Narration;
const voice = JSON.parse(readFileSync(join(ASSETS, "voice", "manifest.json"), "utf8")) as { lines: Spoken[] };

const round = (seconds: number) => Math.round(seconds * 1000) / 1000;
const lines: (Line & { file: string; start: number; end: number })[] = [];
const scenes: Record<string, { enter: number; start: number; end: number }> = {};
let at = LEAD;
narration.lines.forEach((line, index) => {
  const spoken = voice.lines.find((entry) => entry.id === line.id);
  if (!spoken || spoken.text !== line.text) {
    throw new Error(`The voice has no take of "${line.text}"; run npm run voice -- --brag.`);
  }
  const previous = lines[index - 1];
  if (previous) {
    at = previous.end + (previous.scene === line.scene ? GAP : SCENE) + (HOLD[previous.id] ?? 0);
  }
  lines.push({ ...line, file: spoken.file, start: round(at), end: round(at + spoken.seconds) });
  const scene = (scenes[line.scene] ??= { enter: 0, start: round(at), end: 0 });
  scene.end = round(at + spoken.seconds);
});
// A scene enters once the one before it, and its hold, finish, so its picture is in place before
// its first line.
Object.values(scenes).forEach((scene, index) => {
  scene.enter = index === 0 ? 0 : round(scene.start - SCENE + ENTER);
});
const last = lines[lines.length - 1];
const duration = round(last.end + END);

const line = (id: string) => {
  const found = lines.find((entry) => entry.id === id);
  if (!found) {
    throw new Error(`brag/narration.json has no line "${id}".`);
  }
  return found;
};
/** When a word of a line is spoken, estimated from where it falls in the line's text. */
const word = (id: string, text: string) => {
  const { start, end, text: whole } = line(id);
  const index = whole.indexOf(text);
  if (index < 0) {
    throw new Error(`The line "${id}" has no "${text}".`);
  }
  return start + (index / whole.length) * (end - start);
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

const timing = { duration, scenes, lines: Object.fromEntries(lines.map(({ id, text, start, end }) => [id, { text, start, end }])) };
writeFileSync(
  join(ASSETS, "timing.js"),
  `// Written by scripts/brag-timing.ts from the voice's lengths; edit brag/narration.json instead.\nwindow.TIMING = ${JSON.stringify(timing, null, 2)};\n`,
);

// The music sits under the voice, hushes in the hold before its drop, lifts on the drop until the
// next line, rises on the end card, and fades out.
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

console.log(`brag/: ${lines.length} lines in ${Object.keys(scenes).length} scenes, ${duration} seconds; the music starts ${from}s in.`);
for (const [name, scene] of Object.entries(scenes)) {
  console.log(`  ${name.padEnd(10)} enters ${scene.enter.toFixed(2)}, voice ${scene.start.toFixed(2)} to ${scene.end.toFixed(2)}`);
}
