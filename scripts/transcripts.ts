// Writes public/transcripts/manifest.json: the commit the transcripts came from, the release
// whose package it holds, and each file's tape, steps, and SHA-256, so a reviewer can trace and
// check every line a terminal scene shows.
//
// Usage, from scripts/fetch-transcripts.sh: tsx scripts/transcripts.ts <veridelta checkout> <release>
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseTranscript } from "../src/parse-transcript";

const [checkout, release] = process.argv.slice(2);
if (!checkout || !release) {
  throw new Error("Usage: tsx scripts/transcripts.ts <veridelta checkout> <release>");
}

const folder = join("public", "transcripts");
/** Where each image comes from in the checkout, and what the line under it says it is. */
const IMAGES: Record<string, { source: string; caption: string }> = {
  "promo-report.png": {
    source: "demo/screenshots.py --promo, the HTML report of the run demo/promo/accounts-baseline.tape types",
    caption: "Screenshot of the HTML report of the run in demo/promo/accounts-baseline.tape",
  },
  "action-comment.png": {
    source: "docs/assets/action-comment-light.png, the GitHub Action's comment on Veridelta/veridelta-media#13",
    caption: "Screenshot of the GitHub Action's comment on Veridelta/veridelta-media#13, from docs/ci.md",
  },
};
const sha256 = (file: string) => createHash("sha256").update(readFileSync(file)).digest("hex");
const files = readdirSync(folder).sort();

const manifest = {
  source: "https://github.com/Veridelta/veridelta",
  release,
  commit: execFileSync("git", ["-C", checkout, "rev-parse", "HEAD"]).toString().trim(),
  transcripts: files
    .filter((name) => name.endsWith(".txt"))
    .map((name) => {
      const stem = name.replace(/\.txt$/, "");
      const tape = `demo/promo/${stem}.tape`;
      if (!existsSync(join(checkout, tape))) {
        throw new Error(`No tape at ${tape} has the transcript ${name}.`);
      }
      return {
        name: stem,
        file: name,
        tape,
        sha256: sha256(join(folder, name)),
        steps: parseTranscript(readFileSync(join(folder, name), "utf8")),
      };
    }),
  images: files
    .filter((name) => name.endsWith(".png"))
    .map((name) => {
      const out = execFileSync("ffprobe", [
        "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "json",
        join(folder, name),
      ]);
      const { width, height } = JSON.parse(out.toString()).streams[0];
      const known = IMAGES[name];
      if (!known) {
        throw new Error(`scripts/transcripts.ts names no source for ${name}.`);
      }
      return {
        name: name.replace(/\.png$/, ""),
        file: name,
        ...known,
        width: width as number,
        height: height as number,
        sha256: sha256(join(folder, name)),
      };
    }),
};

writeFileSync(join(folder, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(
  `public/transcripts/manifest.json: ${manifest.transcripts.length} transcripts and ${manifest.images.length} images from ${release}.`,
);
