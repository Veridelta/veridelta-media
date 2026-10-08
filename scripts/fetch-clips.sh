#!/usr/bin/env bash
# Renders the terminal recordings at one Veridelta release with `make demo-video`, and
# copies them into public/clips/ with the report screenshot from the same release. Every
# terminal frame in the videos comes from here, so each traces to a tape at that release.
#
# Usage: scripts/fetch-clips.sh v0.27.0
#
# It needs what `make demo-video` needs: uv, vhs v0.12.1, ttyd, ffmpeg, and Chromium.
set -euo pipefail

ref="${1:?Name the Veridelta release to render, such as v0.27.0.}"
root="$(cd "$(dirname "$0")/.." && pwd)"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

git clone --quiet --depth 1 --branch "$ref" https://github.com/Veridelta/veridelta "$work/veridelta"
# The MCP tape runs the server, which needs the `mcp` extra.
(cd "$work/veridelta" && uv sync --locked --all-extras --quiet && make demo-video)

rm -rf "$root/public/clips"
mkdir -p "$root/public/clips"
cp "$work"/veridelta/demo/video/*.mp4 "$root/public/clips/"
cp "$work/veridelta/docs/assets/report-light.png" "$root/public/clips/"
(cd "$root" && npx tsx scripts/manifest.ts "$work/veridelta" "$ref")
