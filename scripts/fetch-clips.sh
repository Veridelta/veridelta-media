#!/usr/bin/env bash
# Renders the terminal recordings at one Veridelta commit with `make demo-video`, and
# copies them into public/clips/ with the report screenshot from the same checkout. Every
# terminal frame in the videos comes from here, so each traces to a tape at that commit.
#
# Usage: scripts/fetch-clips.sh v0.27.0
#
# A commit after a release works too, such as one that adds a tape, but only while its
# package is the release's: its src/, pyproject.toml, and uv.lock must match the last
# release tag, so every frame is what that release prints.
#
# It needs what `make demo-video` needs: uv, vhs v0.12.1, ttyd, ffmpeg, and Chromium.
set -euo pipefail

ref="${1:?Name the Veridelta release or commit to render, such as v0.27.0.}"
root="$(cd "$(dirname "$0")/.." && pwd)"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
checkout="$work/veridelta"

git clone --quiet --filter=blob:none --no-checkout https://github.com/Veridelta/veridelta "$checkout"
git -C "$checkout" -c advice.detachedHead=false checkout --quiet "$ref"
release="$(git -C "$checkout" describe --tags --abbrev=0 --match 'v*' HEAD)"
if ! git -C "$checkout" diff --quiet "$release" HEAD -- src pyproject.toml uv.lock; then
  echo "The package at $ref differs from $release. Render at a release, or at a commit whose src/, pyproject.toml, and uv.lock match one." >&2
  exit 1
fi

# The MCP tape runs the server, which needs the `mcp` extra.
(cd "$checkout" && uv sync --locked --all-extras --quiet && make demo-video)

rm -rf "$root/public/clips"
mkdir -p "$root/public/clips"
cp "$checkout"/demo/video/*.mp4 "$root/public/clips/"
cp "$checkout/docs/assets/report-light.png" "$root/public/clips/"
(cd "$root" && npx tsx scripts/manifest.ts "$checkout" "$release")
