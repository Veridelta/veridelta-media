// Checks what a reviewer would otherwise check by hand: every clip matches the checksum
// its manifest recorded, every scene names a docs page, its captions fit inside it, and
// every post in launch-kit.md fits in 280 characters.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { manifest } from "../src/clips";
import { cuts } from "../src/storyboard";

const problems: string[] = [];

for (const entry of [...manifest.clips, ...manifest.images]) {
  const digest = createHash("sha256").update(readFileSync(join("public", "clips", entry.file))).digest("hex");
  if (digest !== entry.sha256) {
    problems.push(`public/clips/${entry.file} does not match its checksum; run scripts/fetch-clips.sh again.`);
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
