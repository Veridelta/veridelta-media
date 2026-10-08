#!/usr/bin/env bash
# Renders every cut in src/storyboard.ts to renders/<cut>.mp4. Extra arguments go to
# `remotion render`, such as --scale=0.5 for a quick preview, or --browser-executable to
# use a Chromium already on the machine.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p renders
cuts=$(npx tsx -e 'import("./src/storyboard.ts").then(({ cuts }) => console.log(cuts.map((cut) => cut.id).join(" ")))')
for cut in $cuts; do
  npx remotion render src/index.ts "$cut" "renders/$cut.mp4" "$@"
done
