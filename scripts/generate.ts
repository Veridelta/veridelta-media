// Writes captions/<cut>.srt and storyboard.md from src/storyboard.ts, so the subtitles and
// the storyboard always say what the cuts show. CI fails when the committed files differ.
import { mkdirSync, writeFileSync } from "node:fs";
import { manifest } from "../src/clips";
import { FPS, cutFrames, cuts, timeline } from "../src/storyboard";
import { transcripts } from "../src/transcripts";
import { voices } from "../src/voice";

/** SRT's time stamp, such as 00:00:08,500. */
const srtTime = (seconds: number) => {
  const total = Math.round(seconds * 1000);
  const pad = (value: number, width = 2) => String(value).padStart(width, "0");
  const hours = Math.floor(total / 3_600_000);
  const minutes = Math.floor(total / 60_000) % 60;
  const secs = Math.floor(total / 1000) % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)},${pad(total % 1000, 3)}`;
};

/** A short time for the storyboard, such as 0:08.5. */
const clock = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${(seconds - minutes * 60).toFixed(1).padStart(4, "0")}`;
};

/** Each caption's start and end within the cut, in seconds. */
const cutCaptions = (cut: (typeof cuts)[number]) =>
  timeline(cut).flatMap(({ scene, start, frames }) =>
    scene.captions.map((caption) => ({
      scene,
      text: caption.text,
      from: start / FPS + caption.from,
      to: Math.min(start / FPS + caption.to, (start + frames) / FPS),
    })),
  );

mkdirSync("captions", { recursive: true });
for (const cut of cuts) {
  const entries = cutCaptions(cut).map(
    (caption, index) => `${index + 1}\n${srtTime(caption.from)} --> ${srtTime(caption.to)}\n${caption.text}\n`,
  );
  writeFileSync(`captions/${cut.id}.srt`, entries.join("\n"));
}

const lines = [
  "# Storyboard",
  "",
  "`npm run generate` writes this file from `src/storyboard.ts`. Change that file, not this one.",
  "",
  `Every terminal recording and the report screenshot come from Veridelta commit \`${manifest.commit.slice(0, 7)}\`, whose package is ${manifest.release}'s, rendered with ${manifest.renderedWith}. \`public/clips/manifest.json\` holds each file's tape and checksum. Each recording plays whole, as its tape typed it.`,
  "",
  `The narrated cut sets in type the transcripts of Veridelta commit \`${transcripts.commit.slice(0, 7)}\`, whose package is ${transcripts.release}'s, and shows the HTML report of the run its last tape types. \`public/transcripts/manifest.json\` holds each file's tape, its steps, and its checksum. Its voice is ${[...new Set(voices.lines.map((line) => `${line.engine} (${line.voice})`))].join(" and ") || "not spoken yet"}, and its subtitles are the voice's lines, word for word.`,
  "",
];
for (const cut of cuts) {
  lines.push(`## ${cut.id}: ${cut.title}`, "", `${(cutFrames(cut) / FPS).toFixed(1)} seconds, with subtitles in \`captions/${cut.id}.srt\`.`, "");
  lines.push("| Time | Scene | Picture | Captions | Backed by |", "| :--- | :--- | :--- | :--- | :--- |");
  for (const { scene, start, frames } of timeline(cut)) {
    const from = start / FPS;
    const captions = scene.captions.map((caption) => `${clock(from + caption.from)} ${caption.text}`).join("<br>");
    lines.push(
      `| ${clock(from)} to ${clock((start + frames) / FPS)} | ${scene.id} | ${scene.description} | ${captions} | [${scene.backedBy.replace("https://", "")}](${scene.backedBy}) |`,
    );
  }
  lines.push("");
}
writeFileSync("storyboard.md", lines.join("\n"));
console.log(`Wrote storyboard.md and ${cuts.length} caption files.`);
