#!/usr/bin/env bash
# Renders the composition and finishes it: the mix is set to -16 LUFS with its true peak under
# -1.5 dBFS, the level of the walkthrough. The video starts on its own first frame, the hook's
# title card, which players show before it plays; no other frame is put in its place.
#
# Writes brag.mp4, the release asset; brag-inline.mp4, a 720p copy under GitHub's 10 MB limit for a
# video in a release description; and brag.jpg, the end card, all here, which git ignores; and
# ../posters/demo-poster.png. Needs Node 22, ffmpeg, and Chrome, as `npx hyperframes doctor` checks.
set -euo pipefail
cd "$(dirname "$0")"

# The end card, once everything on it has settled, for the organization page's poster: half a
# second before the end, which scripts/brag-timing.ts writes into assets/timing.js.
duration=$(sed -n 's/^  "duration": \([0-9.]*\),$/\1/p' composition/assets/timing.js)
POSTER_AT=$(python3 -c "print(round($duration - 0.5, 2))")

(cd composition && npx --yes hyperframes@0.8.143 render --quality high --output ../brag.raw.mp4)
ffmpeg -hide_banner -loglevel error -y -ss "$POSTER_AT" -i brag.raw.mp4 -frames:v 1 -q:v 2 brag.jpg

# Two pass loudness: measure, then apply the measurement. A fade of 50 ms and a limiter keep the
# first beat under the peak while the normalizer settles.
measure=$(ffmpeg -hide_banner -nostats -i brag.raw.mp4 -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
field() { printf '%s' "$measure" | python3 -c "import json, sys; print(json.load(sys.stdin)['$1'])"; }
loudnorm="loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$(field input_i):measured_TP=$(field input_tp):measured_LRA=$(field input_lra):measured_thresh=$(field input_thresh):offset=$(field target_offset)"

ffmpeg -hide_banner -loglevel error -y -i brag.raw.mp4 \
  -filter_complex "[0:a]afade=t=in:d=0.05,$loudnorm,aresample=192000,alimiter=limit=0.8:attack=1:release=60:level=false,aresample=48000[a]" \
  -map 0:v -map "[a]" -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p \
  -c:a aac -b:a 160k -movflags +faststart brag.mp4
rm brag.raw.mp4

# The copy for the release description: 720p, at a bitrate that keeps it under 10 MB.
ffmpeg -hide_banner -loglevel error -y -i brag.mp4 -vf scale=1280:720:flags=lanczos \
  -c:v libx264 -crf 22 -maxrate 1000k -bufsize 2000k -preset slow -pix_fmt yuv420p \
  -c:a aac -b:a 96k -movflags +faststart brag-inline.mp4

# The organization page's poster: the poster frame with a play button.
chrome=$(cd composition && npx --yes hyperframes@0.8.143 browser path | tail -n 1)
# Chrome refuses its sandbox as root, as in a container, and on some CI runners; the page is a
# local file.
sandbox=()
if [ "$(id -u)" = 0 ] || [ -n "${CI:-}" ]; then sandbox=(--no-sandbox); fi
"$chrome" "${sandbox[@]}" --headless --hide-scrollbars --force-device-scale-factor=1 --window-size=1920,1080 \
  --screenshot="$PWD/../posters/demo-poster.png" "file://$PWD/poster.html" 2>/dev/null

for file in brag.mp4 brag-inline.mp4; do
  ffprobe -v error -show_entries format=duration,size -of default=nw=1 "$file"
done
ffmpeg -hide_banner -nostats -i brag.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -E '^\s+(I|Peak):'
