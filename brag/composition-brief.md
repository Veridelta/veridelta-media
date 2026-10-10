# Hyperframes composition brief: Veridelta

## Objective

Create a short narrated story for Veridelta that makes its problem felt before it shows Veridelta as the answer.

## Output

- Composition directory: `brag/composition/`
- Rendered video: `brag/brag.mp4`, which git ignores
- Format: landscape, 1920 by 1080, 30 fps
- Duration: set by the voice and each scene's lead and tail, 94.9 seconds

## Source material

- Project root: Veridelta at commit `b8669bc`, which runs release 0.35.1.
- Files read: `README.md`, `pyproject.toml`, `docs/cli.md`, `docs/configuration.md`, `docs/rules.md`, `docs/ci.md`, `docs/stylesheets/brand.css`, `docs/assets/`, `demo/stations.py`, and the weather station transcripts in `demo/promo/`.
- Product name: Veridelta.
- Strongest claim: "Nothing is forgiven unless a rule says so."
- Key thing to show: the first rows of both files, which hold the bug from the first scene.
- Copy that must appear word for word: every spoken line, in the caption band, and every line `brag-plan.md` lists on screen.

## Creative direction

- Tone preset: `default`.
- Creative direction: a short, fast story with real output. Tension in the problem, relief at the end.
- Interpretation: push slides between scenes, a zoom through on the music's drop, and a blur crossfade into the end card. Orange marks what is wrong; blue marks the answer.
- Angle: a port from IDL to Python has to match one to one, and every row differs. Which differences are fixes, and which are corruption? Veridelta answers each with a declared rule, and only the real bug is left.
- Hook: IDL to Python, the first rows of both files, "Must match, 1:1".
- Payoff: the four lost minus signs, in the rows from the hook, then the fixed port at `100.0%` in blue, the mirror of the first run.
- Outro: the logo, the summary, and the install command.
- Avoid:
  - generic SaaS language, and any claim the claim table in `brag-plan.md` does not trace;
  - abstract filler;
  - dashes in copy, title case, and marketing words, per Veridelta's writing rules.

## Visual identity

- Background: `#f5f7fa`, with a faint data grid and the symbol's orange into blue bar along the top, as the docs header draws it.
- Text: navy `#0d2f5a`; secondary text slate `#4a5d75`.
- Accent: orange `#de5807` for large text and shapes, and `#b24606` behind small white text; blue `#2054b2` for rules and the answer.
- Display and body font: Inter, from `assets/fonts/`.
- Data font: DejaVu Sans Mono, from `assets/fonts/`.
- Logo: `assets/images/veridelta-symbol.png` and `veridelta-wordmark.png`, from Veridelta's `docs/assets/`.
- Captions: a navy band at the bottom, white Inter at 44 pixels, one spoken line at a time.

## Storyboard

`brag-plan.md` is the creative contract, with each scene's narration and picture. The times come from `assets/timing.js`, which `npm run brag-timing` writes from the voice: each scene enters on a beat of the music, holds its picture for its lead, and holds what landed last for its tail. Each animation settles on the word it shows, at the time Whisper heard it, through one helper, `hit`, in three kinds: `slam`, `rise`, and `pop`.

1. Hook: the pipeline, IDL to Python, word by word.
2. Files: the first rows of both files, "Must match, 1:1".
3. Run: the command, `0.0%`, "124 rows. 124 changed.", the top column drifts.
4. Questions: four value pairs, each with its question.
5. Pain: a cell for each changed row, then "Fix or corruption?" in a hush.
6. Veridelta: the logo on the drop, three chips, the line.
7. Suggest: the declared rename, then the suggest output, its evidence underlined.
8. Baseline: the baseline file, `31`, `Accepted: 31`.
9. Left: the first rows again with the four temperatures ringed, the failed run.
10. Pass: `100.0%`, `exit code 0`.
11. End: the logo, the summary, the install command, the address.

## Audio

- Voice: 21 lines in `assets/voice/`, Gemini's Orus, one take, on tracks 30 and 31.
- Music: `assets/music/happy-beats-business-moves-vol-1-by-ende-dot-app.mp3` at 0.12 under the voice, from 2.52 seconds into the track so its drop at 48.02, from brag's cue preset, lands as Veridelta enters. A volume lane hushes it before the drop, lifts it on the drop, and raises it on the end card.
- Audio-reactive: subtle. The glow behind the content breathes with the music's level, from `assets/audio-levels.js`, made by Hyperframes' `extract-audio-data.py` from the part of the track the video plays.
- SFX: Kenney's, under CC0, from brag's `assets/sfx/`, placed by `narration.json` on a scene or a word.

## Hyperframes instructions

Built with `hyperframes-core`, `hyperframes-animation`, `hyperframes-creative`, `hyperframes-keyframes`, and `hyperframes-cli` from Hyperframes 0.8.143. One standalone `index.html`, one paused GSAP timeline that reads `assets/timing.js`, a shared background layer, and a caption band.

- `npx hyperframes check` passes before render.
