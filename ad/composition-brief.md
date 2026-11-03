# Hyperframes composition brief: Veridelta, the 25-second ad

## Objective

A calm 25-second ad, built around a picture anyone in data recognizes, that says what Veridelta does by second 16 and sends the viewer to the docs. One idea per screen, every line held well past brag's reading floor.

## Output

- Composition: `ad/template.html`. `ad/shape.mjs` writes it to `ad/composition/index.html` for one shape, and `ad/finish.sh` does so for each in turn. The committed `index.html` is the landscape one, for `hyperframes preview`.
- Rendered videos: `ad/ad-landscape.mp4` (1920 by 1080), `ad/ad-square.mp4` (1080 by 1080), `ad/ad-vertical.mp4` (1080 by 1920), with a poster `.jpg` beside each.
- Duration: 24.733 seconds.

## Source material

- Veridelta's docs home, https://veridelta.github.io/veridelta/, its rules page, and its command line page's exit codes.
- Copy: the lines in `brag-plan.md`, each with its source there.

## Creative direction

- Tone: cinematic, calm. One picture that changes: two tables that pair their rows by key, differences that glow, rules that absorb the noise, one bug that fails CI, and a fix that passes it.
- Angle, hook, and outro: as in `brag-plan.md`.
- Avoid: language or tool names a general data audience may not know, the demo's and the promo cuts' layouts (text cards, terminals, an install card sequence), generic SaaS language, any number no run or doc gives, all-caps copy, sound effects, anything that snaps in.

## Visual identity

- Navy `#0d2f5a` to `#08213f` for the data, the light canvas `#f5f7fa` for the end card.
- Inter and DejaVu Sans Mono from `assets/fonts/`; the symbol from `assets/images/`, never larger than its 178 by 165 pixels.
- The symbol's two colors, orange into blue, as a bar along the top.

## Storyboard

`brag-plan.md` is the contract: the question 0 to 5.77, pairing 5.77 to 11.57, rules 11.57 to 15.27, the bug 15.27 to 18.93, the fix 18.93 to 22.1, the end card 22.1 to 24.73. The tables stay on screen from the first frame to the end card; only the line above them and the badge below them change. Each change starts on the frame nearest a measured onset of the music, as `brag-plan.md` lists them.

## Audio

- Music: `assets/music/happy-beats-business-moves-vol-11-by-ende-dot-app.mp3` from 0, fading over the last 1.2 seconds.
- SFX: none. The music carries every change.
- `finish.sh` sets each render to -16 LUFS with its true peak under -1.5 dBFS.

## Gate

`npx --yes hyperframes@0.8.143 check --at-transitions` passes with zero errors for every shape before it renders.
