#!/usr/bin/env bash
# Renders the ad in each shape and finishes it, as brag/finish.sh finishes the demo:
#   ad/finish.sh                  every shape: landscape, square, vertical
#   ad/finish.sh square           one shape
# For each shape it writes composition/index.html from template.html, runs `hyperframes check`,
# renders, takes the poster at the hook's settled frame as ad-<shape>.jpg, sets the mix to -16 LUFS
# with its true peak under -1.5 dBFS, and puts the poster on frame 0, which players and feeds show
# before the video starts. It writes ad-<shape>.mp4 and ad-<shape>.jpg here, which git ignores, and
# leaves the landscape index.html in place. Needs Node 22, ffmpeg, and Chrome, as
# `npx hyperframes doctor` checks; PRODUCER_HEADLESS_SHELL_PATH can name a Chrome already here.
set -euo pipefail
cd "$(dirname "$0")"
HF="npx --yes hyperframes@0.8.143"
# The hook, settled: "Your migration is done." and "Does the data match?" over the two tables.
POSTER_AT=3.3
shapes=("$@")
if [ ${#shapes[@]} -eq 0 ]; then
  shapes=(landscape square vertical)
fi
for shape in "${shapes[@]}"; do
  node shape.mjs "$shape"
  (cd composition && $HF check && $HF render --quality high --quiet --output "../ad-$shape.raw.mp4")
  ffmpeg -hide_banner -loglevel error -y -ss "$POSTER_AT" -i "ad-$shape.raw.mp4" -frames:v 1 -q:v 2 "ad-$shape.jpg"
  # Two pass loudness: measure, then apply the measurement, with a short fade and a limiter, as
  # brag/finish.sh does. The same pass puts the poster on frame 0 and leaves every other frame.
  measure=$(ffmpeg -hide_banner -nostats -i "ad-$shape.raw.mp4" -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
  field() { printf '%s' "$measure" | python3 -c "import json, sys; print(json.load(sys.stdin)['$1'])"; }
  loudnorm="loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$(field input_i):measured_TP=$(field input_tp):measured_LRA=$(field input_lra):measured_thresh=$(field input_thresh):offset=$(field target_offset)"
  ffmpeg -hide_banner -loglevel error -y -i "ad-$shape.raw.mp4" -i "ad-$shape.jpg" \
    -filter_complex "[0:v][1:v]overlay=0:0:enable='eq(n,0)'[v];[0:a]afade=t=in:d=0.05,$loudnorm,aresample=192000,alimiter=limit=0.8:attack=1:release=60:level=false,aresample=48000[a]" \
    -map "[v]" -map "[a]" -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p \
    -c:a aac -b:a 160k -movflags +faststart "ad-$shape.mp4"
  rm "ad-$shape.raw.mp4"
  echo "ad/ad-$shape.mp4 and ad/ad-$shape.jpg"
done
node shape.mjs landscape
