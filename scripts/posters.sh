#!/usr/bin/env bash
# Renders each poster in src/Poster.tsx to posters/<id>.png, which READMEs show to link to a
# cut. Extra arguments go to `remotion still`, such as --browser-executable to use a Chromium
# already on the machine.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p posters
ids=$(npx tsx -e 'import("./src/Poster.tsx").then(({ posters }) => console.log(posters.map((poster) => poster.id).join(" ")))')
for id in $ids; do
  npx remotion still src/index.ts "$id" "posters/$id.png" "$@"
done
