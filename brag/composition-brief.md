# Hyperframes composition brief: Veridelta

## Objective

Create a one-minute narrated pitch for Veridelta that makes the data parity problem felt, shows Veridelta as the answer, and sends the viewer to the tutorials.

## Output

- Composition directory: `brag/composition/`
- Rendered video: `brag/brag.mp4`, which git ignores
- Format: landscape, 1920 by 1080, 30 fps
- Duration: set by the voice and each scene's lead and tail, 60 seconds

## Source material

- Project root: Veridelta at commit `b8669bc`, which runs release 0.35.1.
- Files read: `README.md`, `pyproject.toml`, `docs/cli.md`, `docs/configuration.md`, `docs/rules.md`, `docs/ci.md`, `docs/stylesheets/brand.css`, `docs/assets/`, `demo/stations.py`, and the weather station transcripts in `demo/promo/`.
- Product name: Veridelta.
- Strongest claim: "Nothing is forgiven unless a rule says so."
- Key thing to show: the four lost minus signs in the first rows of both files, and the run that fails on them.
- Copy that must appear word for word: every spoken line, in the caption band, and every line `brag-plan.md` lists on screen.

## Creative direction

- Tone preset: `default`.
- Creative direction: a short, fast story with real output. Tension in the problem, relief at the end.
- Interpretation: sleek and clean. A push between scenes, and on the music's drop, the logo alone, centered, then up into place. Nothing behind the content and nothing half faded. Orange marks what is wrong; blue marks the answer.
- Angle: a port from IDL to Python has to match one to one, and every row differs. Which differences are fixes, and which are corruption? Veridelta's rules, suggest, and a baseline leave only the real bug, and the tutorials take it from there.
- Hook: a finished title card from the first frame, the pipeline and IDL to Python, then "Must match, 1:1".
- Payoff: the four lost minus signs and FAILED, then the fixed port at `100.0%` in blue, the mirror of the first run.
- Outro: the logo, the summary, and the install command.
- Avoid:
  - generic SaaS language, and any claim the claim table in `brag-plan.md` does not trace;
  - abstract filler;
  - dashes in copy, title case, and marketing words, per Veridelta's writing rules.

## Visual identity

- Background: flat `#f5f7fa`, with the symbol's orange into blue bar along the top, as the docs header draws it.
- Text: navy `#0d2f5a`; secondary text slate `#3f5068`.
- Accent: orange `#de5807` for large text and shapes, and `#b24606` for small orange text and behind small white text; blue `#2054b2` for rules and the answer.
- Display and body font: Inter, from `assets/fonts/`.
- Data font: DejaVu Sans Mono, from `assets/fonts/`.
- Logo: `assets/images/veridelta-symbol.png` and `veridelta-wordmark.png`, from Veridelta's `docs/assets/`.
- Captions: a navy band at the bottom, white Inter at 44 pixels, one spoken line at a time, switched at once rather than faded, each held until the next one, so the band stays put from the first line to the last.
- Contrast: every line of text meets WCAG AA, which `npx hyperframes check` measures; small text is about 7:1 or more.

## Storyboard

`brag-plan.md` is the creative contract, with each scene's narration and picture. The times come from `assets/timing.js`, which `npm run brag-timing` writes from the voice: each scene enters on a beat of the music, holds its picture for its lead, and holds what landed last for its tail. Each animation settles on the word it shows, at the time Whisper heard it, through one helper, `hit`, in three kinds: `slam`, `rise`, and `pop`.

1. Hook: the title card, the pipeline and IDL to Python, from the first frame, then "Must match, 1:1". It holds 1.5 seconds after its last line.
2. Run: the command, `0.0%`, the top column drifts, "124 rows. 124 changed.".
3. Doubts: three value pairs, the last one "On purpose".
4. Pain: a cell for each changed row, then "Fix or corruption?" in a hush.
5. Veridelta: the logo alone, centered, on the drop, then up into place; two chips; the line.
6. Rules: declare, suggest, accept, on screen as the scene enters, each with a card of its transcript on its word.
7. Left: the first rows with the four temperatures ringed, the failed run.
8. Pass: `100.0%`, `exit code 0`.
9. End: the logo, the summary, the install command, the six tutorials. It holds 3.2 seconds after the last line.

## Audio

- Voice: 12 lines in `assets/voice/`, Gemini's Orus, one take, on tracks 30 and 31.
- Music: `assets/music/happy-beats-business-moves-vol-1-by-ende-dot-app.mp3` at 0.12 under the voice, from 22.52 seconds into the track so its drop at 48.02, from brag's cue preset, lands as Veridelta enters. A volume lane hushes it before the drop, lifts it on the drop, and raises it on the end card.
- Audio-reactive: none. The canvas stays still.
- SFX: Kenney's, under CC0, from brag's `assets/sfx/`, placed by `narration.json` on a scene or a word.

## Hyperframes instructions

Built with `hyperframes-core`, `hyperframes-animation`, `hyperframes-creative`, `hyperframes-keyframes`, and `hyperframes-cli` from Hyperframes 0.8.143. One standalone `index.html`, one paused GSAP timeline that reads `assets/timing.js`, a shared background layer, and a caption band.

- `npx hyperframes check` passes before render.
