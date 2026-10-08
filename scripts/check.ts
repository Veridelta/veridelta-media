// Checks what a reviewer would otherwise check by hand: every clip, transcript, and line of
// the voice matches the checksum its manifest recorded, every scene names a docs page, its
// captions fit inside it, a terminal shows only its transcript's lines, and every post in
// launch-kit.md fits in 280 characters. With --final, it also refuses a draft voice.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { manifest } from "../src/clips";
import { cuts } from "../src/storyboard";
import { COLUMNS } from "../src/terminal";
import { PROMPT, parseTranscript, transcript, transcripts } from "../src/transcripts";
import { voices } from "../src/voice";

const problems: string[] = [];
const final = process.argv.includes("--final");
const sha256 = (file: string) => createHash("sha256").update(readFileSync(file)).digest("hex");

for (const entry of [...manifest.clips, ...manifest.images]) {
  if (sha256(join("public", "clips", entry.file)) !== entry.sha256) {
    problems.push(`public/clips/${entry.file} does not match its checksum; run scripts/fetch-clips.sh again.`);
  }
}

for (const entry of [...transcripts.transcripts, ...transcripts.images]) {
  if (sha256(join("public", "transcripts", entry.file)) !== entry.sha256) {
    problems.push(`public/transcripts/${entry.file} does not match its checksum; run scripts/fetch-transcripts.sh again.`);
  }
}
for (const entry of transcripts.transcripts) {
  const steps = parseTranscript(readFileSync(join("public", "transcripts", entry.file), "utf8"));
  if (!isDeepStrictEqual(steps, entry.steps)) {
    problems.push(`public/transcripts/manifest.json holds other steps than ${entry.file}.`);
  }
  for (const line of steps.flatMap((step) => [PROMPT + step.command, ...step.output])) {
    if (line.length > COLUMNS) {
      problems.push(`${entry.file}: "${line.slice(0, 40)}..." is wider than the terminal's ${COLUMNS} columns.`);
    }
  }
}

for (const line of voices.lines) {
  if (sha256(join("public", "voice", line.file)) !== line.sha256) {
    problems.push(`public/voice/${line.file} does not match its checksum; run npm run voice again.`);
  }
}

for (const cut of cuts) {
  for (const scene of cut.scenes) {
    const where = `${cut.id}, scene ${scene.id}`;
    if (!scene.backedBy.startsWith("https://veridelta.github.io/veridelta/")) {
      problems.push(`${where}: name the docs page that backs its claims.`);
    }
    let end = 0;
    for (const caption of scene.captions) {
      if (caption.from !== end || caption.to <= caption.from || caption.to > scene.seconds) {
        problems.push(`${where}: the caption "${caption.text}" leaves a gap, overlaps, or runs past the scene.`);
      }
      end = caption.to;
    }
    if (end !== scene.seconds) {
      problems.push(`${where}: the captions end at ${end} seconds, before the scene does.`);
    }
    for (const { text } of scene.voice ?? []) {
      const line = voices.lines.find((entry) => entry.text === text);
      if (!line) {
        problems.push(`${where}: the voice has not spoken "${text}"; run npm run voice.`);
      } else if (final && line.engine !== "google") {
        problems.push(`${where}: "${text}" is still the ${line.engine} draft; run npm run voice with the key.`);
      }
    }
    if (scene.picture.kind === "terminal") {
      const { steps } = transcript(scene.picture.transcript);
      const shown = steps.slice(0, scene.picture.timing.starts.length).flatMap((step) => step.output);
      for (const mark of scene.picture.timing.marks) {
        if (!shown.includes(mark.text)) {
          problems.push(`${where}: "${mark.text}" is not a line the terminal shows by then.`);
        }
      }
    }
  }
}

const kit = readFileSync("launch-kit.md", "utf8");
const posts = kit.split("## Posts")[1]?.split("\n## ")[0] ?? "";
for (const post of posts.matchAll(/```text\n([\s\S]*?)\n```/g)) {
  const length = [...post[1]].length;
  if (length > 280) {
    problems.push(`launch-kit.md: a post is ${length} characters, over 280: "${post[1].slice(0, 60)}..."`);
  }
}
if (!posts.includes("```text")) {
  problems.push("launch-kit.md: the Posts section holds no post.");
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log("The clips, the scenes, and the posts check out.");
