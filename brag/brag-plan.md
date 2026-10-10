# Brag plan: Veridelta

Written by `/brag --full --format landscape --voice`, with [brag](https://github.com/latent-spaces/brag) at commit `8531ccb`, from Veridelta at commit `b8669bc`, which runs release 0.35.1. It replaces the 30-second cut, which git history keeps. The maintainer's group found the three-minute walkthrough too slow and the 30-second cut too fast, and said people did not understand the problem. A 95-second story fixed that, and the maintainer then asked for 45 to 60 seconds that sell rather than explain: once people reach the docs, the tutorials take over. This cut runs 60 seconds, past brag's 15 to 25, to tell the problem before the answer. The maintainer then asked for the opening and the end card to hold longer, for smooth transitions with no white flash, and for accessible contrast. The voice is Gemini's in place of brag's Kokoro, as the maintainer asked.

## What is this app?

A command line tool that compares two datasets on their primary keys under rules you declare, and fails CI when they differ.

## The angle

Data parity is the problem, and Veridelta is the answer. The maintainer's own story shows the problem: a scientific dataset moved from IDL to Python and had to match one to one, while bugs were being fixed. Every difference asks whether it is a fix or corruption.

Maya, an atmospheric scientist, tells it with a made-up weather station dataset, written for the video in Veridelta's `demo/stations.py` so every number is real. The video sells the answer in three moves (declare, suggest, accept), shows the real bug failing CI, and hands the viewer to the six tutorials.

## Hook (first 8 seconds)

"Maya is moving her weather pipeline from IDL to Python. It has to match the old one. One to one." On screen from the first frame, "Maya's weather station pipeline" and IDL to Python, each word lighting as it is said, then "Must match, 1:1".

## Key moments

- The first run: `0.0%`, 124 rows, 124 changed.
- Three doubts, one value pair each: float precision, a renamed column, a fix made on purpose.
- "Fix or corruption?", over a cell for each changed row, held in a hush.
- Veridelta, on the music's drop. "Nothing is forgiven unless a rule says so."
- Declare, suggest, accept: three cards, each a line of a real run.
- The real bug, four lost minus signs, fails the run. The fixed port passes at `100.0%`.

## Outro

The logo, the PyPI summary, `pip install veridelta`, and the six tutorials at the docs address.

## Tone

- Preset: `default`.
- Creative direction: fast, plain, real output. Tension in the problem, relief at the end. No hype.
- Interpretation: nine scenes on a light canvas in the logo's colors. Push slides between them, orange for what is wrong, blue for the answer, and a caption band with every spoken line.
- Transitions: the next scene is always on screen as the last one leaves, so the frame never shows the bare canvas. A push moves both scenes as one strip, edge to edge, so neither covers the other; Veridelta and the end card dissolve in over the scene before. Each scene's layout is in place as it enters, and only what the voice names animates in. Captions switch at once, never fading through a low contrast frame, and each holds through its scene's tail, so the band leaves with its scene rather than blinking off in a hold.

## Format: landscape, 1920 by 1080, 30 fps

## Duration: 60 seconds

## Visual identity (from the project)

- Background: `#f5f7fa`, the media repository's `mist` tinted toward the navy.
- Text: navy `#0d2f5a`; secondary text slate `#3f5068`.
- Accent: orange `#de5807` for large text and shapes, and the deeper `#b24606` for small orange text and behind small white text; blue `#2054b2`, for a rule and the answer.
- Contrast: every line of text meets WCAG AA, as `npx hyperframes check` measures it on each frame. Small text is about 7:1 or more: navy, slate at 7.65:1, and code at 7.46:1 on the terminal. The captions are 11.31:1.
- Display and body font: Inter, as the media repository ships it.
- Data font: DejaVu Sans Mono.
- Strongest visual element: the `0.0%` and `100.0%` mirror, and the four ringed minus signs.

## Share copy

Porting a pipeline, every row differed. Float precision, a renamed column, a fix made on purpose, and one real bug. Veridelta sorts them under rules you declare, and only the bug fails CI. Six tutorials take it from there.

## Voice

- Engine: Gemini's speech model, the voice Orus, in one take (`b60da1ca3704`), as `scripts/voice.ts` speaks a narrated cut.
- Style: brisk, confident and engaged, with tension in the problem and relief at the end.
- Pace: each line's inner pauses capped at 0.28 seconds, played at 0.97 times its speed, at the same pitch.
- Lines: the 12 in `narration.json`, 43.7 seconds of voice in all.

## Audio direction

- Role: a bed under the voice, with sparse accents.
- Music: `happy-beats-business-moves-vol-1-by-ende-dot-app.mp3`, a beat every half second, the most energetic of brag's tracks, by Sascha Ende, under CC BY 4.0.
- Music treatment: under the voice at 0.12, about 20 dB below it. It plays from 22.52 seconds into the track, so its drop at 48.02 lands as Veridelta enters, and every scene enters on one of its beats. It hushes to 0.02 after "Which differences are fixes, and which are corruption?", lifts to 0.4 on the drop until the next line, and rises to 0.5 on the end card before it fades out.
- Audio-reactive treatment: subtle. The glow behind each scene breathes with the music's level. No waveforms.
- SFX posture: sparse. A soft thud under `0.0%`, a card slide for each doubt, a thud on "corruption", one bell on the drop, a light tap for each rule card, a thud on the failure, a thud and a tap on the pass, and a thud on the end card.
- Restraint rule: the voice leads. Nothing louder than the bed for more than a moment.

## Storyboard

`npm run brag-timing` sets each scene's times from the voice and from `narration.json`:
- each scene holds its picture for a lead before its first line;
- it holds for a tail after its last line, long enough to read what landed last;
- it enters on a beat of the music.

Every element lands on the word, as Whisper heard it said, that the "Lands on" column names.

| Scene | Seconds | Lead, tail | Narration | On screen | Lands on |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Hook | 0 to 8.0 | 0.5, 1.5 | "Maya is moving her weather pipeline from IDL to Python. It has to match the old one. One to one." | "Maya's weather station pipeline", IDL to Python, "Must match, 1:1" | All but the last on screen from the first frame; "IDL" and "Python" light on their words; "match" |
| Run | 8.0 to 12.5 | 0.4, 0.8 | "She compares them. Every single row differs." | The command, match rate FAILED, `0.0%`, the top column drifts, and "124 rows. 124 changed." | `0.0%` on "Every"; drifts on "row"; the count on "differs" |
| Doubts | 12.5 to 18.5 | 0.4, 0.8 | "Float precision. A renamed column. A bug she fixed on purpose." | "Why does every row differ?" `91.900002` to `91.9`; `temp` to `temperature_c`; `998.6` to `1010.7`, "On purpose" | Rows on "Float", "renamed", "bug"; the chip on "purpose" |
| Pain | 18.5 to 25.5 | 0.4, 1.5 | "Somewhere in there hides a real bug. Which differences are fixes, and which are corruption?" | "124 changed rows: four stations, 31 days each", a cell for each, a scan across them, then "Fix or corruption?" held in a hush | The scan on "Somewhere"; "Fix" on "fixes"; "or corruption?" on "corruption" |
| Veridelta | 25.5 to 33.0 | 0.75, 0.6 | "Veridelta compares two datasets under rules you declare. Nothing is forgiven unless a rule says so." | The logo, "Two datasets", "Rules you declare", then the line | The logo on the drop; chips on "two" and "rules"; the line on "Nothing" |
| Rules | 33.0 to 40.5 | 0.4, 1.0 | "Declare the rename. Let Veridelta suggest the rest from your data. Accept the fix with a baseline." | Declare: the `rename_to` lines of `stations_rules.yaml`. Suggest: the evidence line, 124 of 124 underlined. Accept: the baseline run's `Accepted: 31`. | Each card on "Declare", "suggest", "Accept"; the underline on "data" |
| Left | 40.5 to 48.0 | 0.4, 0.8 | "What's left is the real bug. Four readings lost their minus sign, and CI fails the pull request." | "What's left is real." The first rows of both files, the four temperatures ringed, the run's status, its 4 changes, `temperature_c: 4 mismatches`, exit code 1, and FAILED | The rows in the lead; the line on "real"; rings on "Four" and "minus"; the run on "CI"; FAILED on "fails" |
| Pass | 48.0 to 52.5 | 0.4, 1.3 | "Fix it, and it passes. One to one." | The command, match rate PASSED, `100.0%`, `exit code 0`, "Accepted: 31, the pressure fix made on purpose." | `100.0%` on "passes"; the exit code on "One" |
| End | 52.5 to 60.0 | 0.4, 3.2 | "Porting a pipeline of your own? Start with Veridelta's six tutorials." | The logo, "Compare two datasets on their primary keys under rules you declare.", `pip install veridelta`, "Six tutorials at veridelta.github.io/veridelta" | The summary on "pipeline"; the install on "Start"; the tutorials on "tutorials" |

The tails follow brag's reading floor, held after whatever lands last: about 0.8 seconds for a label, and about 0.3 seconds a word for a sentence. The opening and the end card hold longer, as the maintainer asked: the hook for 1.5 seconds after its last line, and the end card for 3.2.

## Claims and their sources

Every spoken line and every line on screen, and where it comes from. The transcripts are Veridelta's `demo/promo/stations-*.txt` at commit `b8669bc`, which the media repository copies to `public/transcripts/`. The data files are Veridelta's `demo/stations_*.csv` at that commit, which `demo/stations.py` writes.

| Claim | Source |
| :--- | :--- |
| Maya, her weather pipeline, IDL to Python | The story's frame. The data is made up: `demo/stations.py`, "Four made-up stations report one reading a day for January 2025." |
| "She compares them. Every single row differs.", `0.0%`, FAILED, "124 rows. 124 changed." | `stations-run.txt`: `Status: FAILED`, `Match Rate: 0.0%`, `Source Rows: 124`, `Changed: 124` |
| The top column drifts | `stations-run.txt`, unchanged |
| "Float precision.", `91.900002` to `91.9`, "IDL 32-bit, Python 64-bit" | NV5's IDL Data Types page: "By default, floating-point numbers without the "d" type specifier will be type FLOAT (32 bits)"; Python's docs, Floating Point Arithmetic: Python floats map to IEEE 754 double precision; `stations-data.txt`, the first row of each file |
| "A renamed column.", `temp` to `temperature_c` | `stations-data.txt`, the headers |
| "A bug she fixed on purpose.", `998.6` to `1010.7`, "S3's pressure, 31 rows" | `demo/stations.py`: "IDL used the wrong elevation for station S3 ... The port fixes that on purpose."; `stations_idl.csv` and `stations_python.csv`, S3 on 2025-01-01; `stations-run.txt`: `pressure_hpa: 31 mismatches` |
| "Somewhere in there hides a real bug." | `demo/stations.py`: "The port has a bug of its own: four of S1's readings below zero lost their minus sign." |
| "124 changed rows: four stations, 31 days each" | `stations-run.txt`: `Changed: 124`; `demo/stations.py`: four stations, January 2025 |
| "Veridelta compares two datasets under rules you declare.", "Two datasets", "Rules you declare" | Veridelta's README, its first sentence: "Veridelta compares two datasets on their primary keys and reports every row that differs under the rules you declare." |
| "Nothing is forgiven unless a rule says so." | Veridelta's README, its first paragraph, word for word |
| "Declare the rename.", the `rename_to` lines | `stations-rules.txt`, `cat stations_rules.yaml`, unchanged; `docs/rules.md`, renaming columns |
| "Let Veridelta suggest the rest from your data.", the evidence line, 124 of 124 | `stations-suggest.txt`, unchanged; `docs/cli.md`: suggest "runs the comparison, then suggests rules that would explain the differences it finds, each with its evidence" |
| "Accept the fix with a baseline.", `Accepted: 31` | `stations-baseline.txt`, unchanged; `docs/cli.md`, accepting drift |
| "What's left is the real bug. Four readings lost their minus sign" | `stations-data.txt`: `-3.5`, `-5.0`, `-5.9`, `-6.0` against `3.5`, `5.0`, `5.9`, `6.0`; `stations-baseline.txt`: `temperature_c: 4 mismatches` |
| The run's lines, FAILED, exit code 1 | `stations-baseline.txt`, unchanged: `Status: FAILED`, `Changed: 4`, `exit code: 1` |
| "and CI fails the pull request." | `docs/ci.md`: the GitHub Action runs on a pull request and fails the job on drift |
| "Fix it, and it passes. One to one.", `100.0%`, PASSED, `exit code 0` | `stations-fixed.txt`: `Status: PASSED (Perfect Match)`, `Match Rate: 100.0%`, `exit code: 0`, on `stations_python_fixed.csv` |
| "Accepted: 31, the pressure fix made on purpose." | `stations-fixed.txt`: `Accepted: 31` |
| "Compare two datasets on their primary keys under rules you declare." | `pyproject.toml`'s description, its first clause |
| "Start with Veridelta's six tutorials.", "Six tutorials at veridelta.github.io/veridelta" | Veridelta's `mkdocs.yml`: the Tutorials section lists six, `examples/01` to `06` |
| `pip install veridelta` | Veridelta's README |
| "Veridelta 0.35.1, the weather station demo in demo/promo at commit b8669bc", on every scene but the end card | `public/transcripts/manifest.json`: release `v0.35.1`, commit `b8669bc` |
