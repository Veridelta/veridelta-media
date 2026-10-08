// Writes public/clips/manifest.json: the release and commit the clips came from, and each
// file's size, length, and SHA-256, so a reviewer can trace and check every one.
//
// Usage, from scripts/fetch-clips.sh: tsx scripts/manifest.ts <veridelta checkout> <release>
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [checkout, release] = process.argv.slice(2);
if (!checkout || !release) {
  throw new Error("Usage: tsx scripts/manifest.ts <veridelta checkout> <release>");
}

const clips = join("public", "clips");
const sha256 = (file: string) => createHash("sha256").update(readFileSync(file)).digest("hex");
const probe = (file: string) => {
  const out = execFileSync("ffprobe", [
    "-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=width,height:format=duration", "-of", "json", file,
  ]);
  const data = JSON.parse(out.toString());
  return {
    width: data.streams[0].width as number,
    height: data.streams[0].height as number,
    seconds: data.format.duration ? Number(data.format.duration) : undefined,
  };
};

const files = readdirSync(clips).sort();
const manifest = {
  source: "https://github.com/Veridelta/veridelta",
  release,
  commit: execFileSync("git", ["-C", checkout, "rev-parse", "HEAD"]).toString().trim(),
  renderedWith: `make demo-video and vhs ${execFileSync("vhs", ["--version"]).toString().trim().replace(/^vhs version /, "")}`,
  clips: files
    .filter((name) => name.endsWith(".mp4"))
    .map((name) => {
      const { width, height, seconds } = probe(join(clips, name));
      return {
        name: name.replace(/\.mp4$/, ""),
        file: name,
        tape: `demo/${name.replace(/\.mp4$/, ".tape")}`,
        width,
        height,
        seconds,
        sha256: sha256(join(clips, name)),
      };
    }),
  images: files
    .filter((name) => name.endsWith(".png"))
    .map((name) => {
      const { width, height } = probe(join(clips, name));
      return {
        name: name.replace(/\.png$/, ""),
        file: name,
        source: `docs/assets/${name}`,
        width,
        height,
        sha256: sha256(join(clips, name)),
      };
    }),
};

writeFileSync(join(clips, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`public/clips/manifest.json: ${manifest.clips.length} clips and ${manifest.images.length} images from ${release}.`);
