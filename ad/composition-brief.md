# Hyperframes composition brief: Veridelta, the 24-second ad

## Objective

A calm, cinematic 24-second ad that says what Veridelta does by second 17 and sends the viewer to the docs. One idea per screen, every line held well past brag's reading floor.

## Output

- Composition: `ad/template.html`. `ad/shape.mjs` writes it to `ad/composition/index.html` for one shape, and `ad/finish.sh` does so for each in turn. The committed `index.html` is the landscape one, for `hyperframes preview`.
- Rendered videos: `ad/ad-landscape.mp4` (1920 by 1080), `ad/ad-square.mp4` (1080 by 1080), `ad/ad-vertical.mp4` (1080 by 1920), with a poster `.jpg` beside each.
- Duration: 24.2 seconds.

## Source material

- Project: Veridelta at commit `a2776a9`, release 0.42.1, and its docs home, https://veridelta.github.io/veridelta/
- Transcripts: `public/transcripts/stations-run.txt` and `stations-fixed.txt`
- Copy that must appear verbatim: "Nothing is forgiven unless a rule says so."

## Creative direction

- Tone: cinematic, calm. Short declarative lines, big type, gentle rises and fades, no slams, long holds.
- Angle, hook, and outro: as in `brag-plan.md`.
- Avoid: generic SaaS language, abstract filler, any number not in a transcript, all-caps copy (the repository writes in sentence case), sound effects, anything that snaps in.

## Visual identity

- Navy `#0d2f5a` scenes for the problem and the two runs, the light canvas `#f5f7fa` when Veridelta arrives and at the end.
- Inter and DejaVu Sans Mono from `assets/fonts/`; the symbol from `assets/images/`, never larger than its 178 by 165 pixels.
- The symbol's two colors, orange into blue, as a bar along the top, as the 60-second demo has.

## Storyboard

`brag-plan.md` is the contract. Scenes: hook 0 to 5.77, question 5.77 to 8.93, Veridelta 8.93 to 13.67, the first run 13.67 to 16.83, the last run 16.83 to 20.5, the end card 20.5 to 24.2. Each change starts on the frame nearest a measured onset of the music, as `brag-plan.md` lists them.

## Audio

- Music: `assets/music/happy-beats-business-moves-vol-11-by-ende-dot-app.mp3` from 0, fading over the last 1.2 seconds.
- SFX: none. The music carries every change.
- Audio-reactive: none; the media-use skill is not installed here.
- `finish.sh` sets each render to -16 LUFS with its true peak under -1.5 dBFS.

## Gate

`npx --yes hyperframes@0.8.143 check` passes with zero errors for every shape before it renders.
