# Hyperframes composition brief: Veridelta, the 20-second ad

## Objective

A cinematic 20-second ad that says what Veridelta does by second 15 and sends the viewer to the docs.

## Output

- Composition: `ad/composition/template.html`. `ad/shape.mjs` writes it to `ad/composition/index.html` for one shape, and `ad/finish.sh` does so for each in turn. The committed `index.html` is the landscape one, for `hyperframes preview`.
- Rendered videos: `ad/ad-landscape.mp4` (1920 by 1080), `ad/ad-square.mp4` (1080 by 1080), `ad/ad-vertical.mp4` (1080 by 1920), with a poster `.jpg` beside each.
- Duration: 20 seconds.

## Source material

- Project: Veridelta at commit `a2776a9`, release 0.42.1, and its docs home, https://veridelta.github.io/veridelta/
- Transcripts: `public/transcripts/stations-run.txt`, `stations-rules.txt`, `stations-baseline.txt`, and `stations-fixed.txt`
- Copy that must appear verbatim: the summary lines the storyboard names, as the transcripts print them; "Nothing is forgiven unless a rule says so."

## Creative direction

- Tone: cinematic. Short declarative lines, huge type, slams on strong beats, long enough holds to read.
- Angle, hook, and outro: as in `brag-plan.md`.
- Avoid: generic SaaS language, abstract filler, any number not in a transcript, all-caps copy (the repository writes in sentence case).

## Visual identity

- Navy `#0d2f5a` scenes for the problem and the climb, the light canvas `#f5f7fa` when Veridelta arrives and at the end.
- Inter and DejaVu Sans Mono from `assets/fonts/`; the symbol from `assets/images/`, never larger than its 178 by 165 pixels.
- The symbol's two colors, orange into blue, as a bar along the top, as the 60-second demo has.

## Storyboard

`brag-plan.md` is the contract. Scenes: hook 0 to 3.7, question 3.7 to 6.34, Veridelta 6.34 to 9.5, the climb 9.5 to 16.86, the outro 16.86 to 20.

## Audio

- Music: `assets/music/happy-beats-business-moves-vol-11-by-ende-dot-app.mp3` from 0, fading over the last 0.8 seconds.
- SFX: chosen after the motion, sparse, from brag's low-risk picks: `impactSoft_medium_001` and `_003`, `impactSoft_heavy_003`, `impactBell_heavy_000`, `interface/switch_004`, `interface/bong_001`.
- Audio-reactive: none; the media-use skill is not installed here.
- `finish.sh` sets each render to -16 LUFS with its true peak under -1.5 dBFS.

## Gate

`npx --yes hyperframes@0.8.143 check` passes with zero errors for every shape before it renders.
