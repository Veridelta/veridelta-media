# Brag plan: Veridelta

Written by `/brag --full --format landscape --voice`, with [brag](https://github.com/latent-spaces/brag) at commit `8531ccb`, from Veridelta at commit `b8669bc`, which runs release 0.35.1. It replaces the 30-second cut, which git history keeps. The maintainer's group found the three-minute walkthrough too slow and the 30-second cut too fast, and said people did not understand the problem. So this cut tells a story: the problem first, until the viewer feels it, then Veridelta as the answer. It runs 95 seconds, past brag's 15 to 25, to tell that story. The voice is Gemini's in place of brag's Kokoro, as the maintainer asked.

## What is this app?

A command line tool that compares two datasets on their primary keys under rules you declare, and fails CI when they differ.

## The angle

The maintainer's own story. A scientific dataset moved from IDL to Python and had to match one to one. But how do you keep parity while you fix bugs? Every difference asks a question:

- Is it a fix, or corruption?
- IDL and Python do floating point differently. Should that count?
- A column was renamed. How do you map it?

Maya, an atmospheric scientist, tells it with a made-up weather station dataset, written for the video in Veridelta's `demo/stations.py` so every number is real. Veridelta answers each question with a rule, and only the real bug is left.

## Hook (first 9.5 seconds)

"Maya is moving her weather station pipeline from IDL to Python." On screen, IDL to Python, word by word. Then "The new output has to match the old. One to one.", over the first rows of both files and "Must match, 1:1". The new bug is already there: four minus signs are missing. The story comes back to them at the end.

## Key moments

- The first run: `0.0%`, 124 rows, 124 changed.
- The questions: float noise, a fill value, a renamed column, and a fix made on purpose, each with its own value pair and question.
- The pain: 124 changed rows, a bug among them, and "Fix or corruption?", held in a hush.
- Veridelta, on the music's drop: two datasets, their keys, your rules. "Nothing is forgiven unless a rule says so."
- `suggest` proposes the humidity rule with its evidence: 124 of 124. "No model is called."
- A baseline accepts the 31 rows of the pressure fix, and only those.
- What is left: the four lost minus signs, in the rows from the first scene. The run fails.
- The fixed port passes at `100.0%`, the mirror of the `0.0%`.

## Outro

The logo, the PyPI summary, `pip install veridelta`, and the docs address.

## Tone

- Preset: `default`.
- Creative direction: a short, fast story with real output. Tension in the problem, relief at the end. Plain words, no hype.
- Interpretation: eleven scenes on a light canvas in the logo's colors. Push slides between them, orange for what is wrong, blue for the answer, and a caption band with every spoken line.

## Format: landscape, 1920 by 1080, 30 fps

## Duration: 95 seconds

## Visual identity (from the project)

- Background: `#f5f7fa`, the media repository's `mist` tinted toward the navy.
- Text: navy `#0d2f5a`.
- Accent: orange `#de5807`, for the alarm and the differences; blue `#2054b2`, for a rule and the answer.
- Display and body font: Inter, as the media repository ships it.
- Data font: DejaVu Sans Mono.
- Strongest visual element: the first rows of both files, which hold the bug from the first scene, and the `0.0%` and `100.0%` mirror.

## Share copy

Porting a weather pipeline from IDL to Python, every row differed. Float noise, a fill value, a renamed column, a fix made on purpose, and one new bug. Veridelta sorts them under rules you declare, and only the new bug fails the run.

## Voice

- Engine: Gemini's speech model, the voice Orus, in one take, as `scripts/voice.ts` speaks a narrated cut.
- Style: brisk, like a good trailer, confident and engaged, with tension in the problem and relief at the end.
- Pace: each line's inner pauses capped at 0.28 seconds, played at 0.97 times its speed, at the same pitch. The first cut played at 1.04; the maintainer found it fast, so the same take plays again 6.7% slower.
- Lines: the 21 in `narration.json`, 72.5 seconds of voice in all.

## Audio direction

- Role: a bed under the voice, with sparse accents.
- Music: `happy-beats-business-moves-vol-1-by-ende-dot-app.mp3`, 120.19 BPM, the most energetic of brag's tracks, by Sascha Ende, under CC BY 4.0.
- Music treatment: under the voice at 0.12, about 20 dB below it. It plays from 2.52 seconds into the track, so its drop at 48.02 lands as Veridelta enters, and every scene enters on one of its beats, half a second apart. It hushes to 0.02 after "Which differences are fixes, and which are corruption?", for about 2 seconds, lifts to 0.4 on the drop until the next line, and rises to 0.5 on the end card before it fades out.
- Audio-reactive treatment: subtle. The glow behind each scene breathes with the music's level. No waveforms.
- SFX posture: sparse. A soft thud under `0.0%`, a card slide for each question, a thud on "corruption", one bell on the drop, a thud on 124 of 124, a light tap on the baseline, a thud on the failure, a thud and a tap on the pass, and a thud on the end card.
- Restraint rule: the voice leads. Nothing louder than the bed for more than a moment.

## Storyboard

`npm run brag-timing` sets each scene's times from the voice and from `narration.json`:
- each scene holds its picture for a lead before its first line;
- it holds for a tail after its last line, long enough to read what landed last;
- it enters on a beat of the music.

Every element lands on the word, as Whisper heard it said, that the "Lands on" column names.

| Scene | Seconds | Lead, tail | Narration | On screen | Lands on |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Hook | 0 to 4.5 | 0.5, 0.4 | "Maya is moving her weather station pipeline from IDL to Python." | "Maya's weather station pipeline", then IDL to Python | "Maya"; "IDL"; "Python" |
| Files | 4.5 to 9.5 | 0.8, 1.4 | "The new output has to match the old. One to one." | The first rows of both files, "A demo dataset: four made-up stations, January 2025.", and "Must match, 1:1" | The files in the lead; "match" |
| Run | 9.5 to 14.5 | 0.5, 1.0 | "She runs both and compares. Every single row differs." | The command, match rate FAILED, `0.0%`, the top column drifts, and "124 rows. 124 changed." | `0.0%` on "Every"; drifts on "row"; the count on "differs" |
| Questions | 14.5 to 37.0 | 0.5, 0.8 | "IDL works in 32-bit floats. Python works in 64. So the same humidity comes out two ways. IDL wrote minus 999 for a missing reading. Python writes nothing. She renamed temp to temperature_c, so a match by name quietly leaves it out. And she fixed a real IDL bug. Station S3 had the wrong elevation, so its pressure changed on purpose." | "Why does every row differ?" Four rows, each an IDL value, an arrow, the Python value, and a question: `91.900002` to `91.9`, "Does it count?"; `-999.000000` to a blank, "Same reading?"; `temp` to `temperature_c`, "Never compared"; `998.6` to `1010.7`, "On purpose" | Rows on "32-bit", "minus", "temp", "S3"; questions on "two ways", "nothing", "quietly", "on purpose" |
| Pain | 37.0 to 45.5 | 0.5, 2.0 | "Somewhere in all of that, the port has a bug of its own. Which differences are fixes, and which are corruption?" | "124 changed rows: four stations, 31 days each", a cell for each, a scan across them, then "Fix or corruption?" held in a hush | The scan on "Somewhere"; "Fix" on "fixes"; "or corruption?" on "corruption" |
| Veridelta | 45.5 to 53.5 | 0.75, 0.6 | "Veridelta compares two datasets on their keys, under rules you declare. Nothing is forgiven unless a rule says so." | The logo, "Two datasets", "Their keys", "Your rules", then the line | The logo on the drop; chips on "two", "keys", "rules"; the line on "Nothing" |
| Suggest | 53.5 to 67.5 | 0.5, 0.8 | "Maya declares the rename. Then veridelta suggest reads the data and proposes the rest. One rule for humidity: a tiny tolerance, and minus 999 as missing. It explains all 124 rows. No model is called." | `stations.yaml` with its rename lit, then the suggest output with the tolerance, the fill value, and 124 of 124 underlined. Then "No model is called." | The rename on "rename"; the output on "suggest"; underlines on "tiny", "minus", "all"; the line on "No" |
| Baseline | 67.5 to 74.0 | 0.8, 1.2 | "The pressure fix was on purpose, so a baseline accepts those 31 rows. Only those." | The head of `stations_accepted.json` with S3 and `pressure_hpa` lit, `31`, "rows accepted: S3's pressure, and only that", and `Accepted: 31` | The file in the lead; bands on "pressure"; `31` on "31"; the label on "rows"; `Accepted: 31` on "Only" |
| Left | 74.0 to 83.5 | 0.5, 0.6 | "What's left is the real bug. Four cold readings lost their minus sign. They were in the first rows all along. The run fails, and in CI, so does the pull request." | "What's left is real." The first rows again, the four temperatures ringed, then the run's status, its 4 changes, `temperature_c: 4 mismatches`, exit code 1, and FAILED | The rows in the lead; the line on "real"; rings on "Four" and "minus"; a pulse on "first"; the run on "run"; FAILED on "fails" |
| Pass | 83.5 to 88.5 | 0.5, 1.8 | "She fixes the port. It passes. One to one." | The command, match rate PASSED, `100.0%`, `exit code 0`, "Accepted: 31, the pressure fix made on purpose." | `100.0%` on "passes"; the exit code on "One" |
| End | 88.5 to 94.9 | 0.5, 2.6 | "Veridelta. Compare two datasets under rules you declare." | The logo, "Compare two datasets on their primary keys under rules you declare.", `pip install veridelta`, `veridelta.github.io/veridelta` | The logo in the lead; the summary on "Compare"; the install command and address after the line |

The tails follow brag's reading floor, held after whatever lands last: about 0.8 seconds for a label, and about 0.3 seconds a word for a sentence. The opening was split in two, the title and then the files, since one 7.5-second scene could not hold both long enough to read. The suggest and baseline scenes lost their headlines, which only repeated the voice.

## Claims and their sources

Every spoken line and every line on screen, and where it comes from. The transcripts are Veridelta's `demo/promo/stations-*.txt` at commit `b8669bc`, which the media repository copies to `public/transcripts/`. The data files are Veridelta's `demo/stations_*.csv` at that commit, which `demo/stations.py` writes.

| Claim | Source |
| :--- | :--- |
| Maya, her weather station pipeline, IDL to Python | The story's frame. The data is made up, as the hook says: `demo/stations.py`, "Four made-up stations report one reading a day for January 2025." |
| "A demo dataset: four made-up stations, January 2025." | `demo/stations.py`, its docstring |
| The first rows of both files | `stations-data.txt`, unchanged |
| "She runs both and compares. Every single row differs.", `0.0%`, FAILED, "124 rows. 124 changed." | `stations-run.txt`: `Status: FAILED`, `Match Rate: 0.0%`, `Source Rows: 124`, `Changed: 124` |
| The top column drifts | `stations-run.txt`, unchanged |
| "IDL works in 32-bit floats." | NV5's IDL Data Types page: "By default, floating-point numbers without the "d" type specifier will be type FLOAT (32 bits)" |
| "Python works in 64.", "IDL 32-bit, Python 64-bit" | Python's docs, Floating Point Arithmetic: almost all platforms map Python floats to IEEE 754 double precision |
| "So the same humidity comes out two ways.", `91.900002` to `91.9` | `stations-data.txt`, the first row of each file |
| "IDL wrote minus 999 for a missing reading. Python writes nothing.", `-999.000000` to a blank | `stations-data.txt`, the second row of each file |
| "She renamed temp to temperature_c", `temp` to `temperature_c` | `stations-data.txt`, the headers |
| "so a match by name quietly leaves it out.", "Never compared" | `docs/configuration.md`, schema mode: under the default `intersection`, "Columns on one side only are left out."; `stations-run.txt` lists no drift in either column |
| "And she fixed a real IDL bug. Station S3 had the wrong elevation, so its pressure changed on purpose." | `demo/stations.py`: "IDL used the wrong elevation for station S3, so its pressure there reads 12.1 hPa low. The port fixes that on purpose." |
| `998.6` to `1010.7`, "S3's pressure, 31 rows" | `stations_idl.csv` and `stations_python.csv`, S3 on 2025-01-01; `stations-run.txt`: `pressure_hpa: 31 mismatches` |
| "Somewhere in all of that, the port has a bug of its own." | `demo/stations.py`: "The port has a bug of its own: four of S1's readings below zero lost their minus sign." |
| "124 changed rows: four stations, 31 days each" | `stations-run.txt`: `Changed: 124`; `demo/stations.py`: four stations, January 2025 |
| "Veridelta compares two datasets on their keys, under rules you declare.", "Two datasets", "Their keys", "Your rules" | Veridelta's README, its first sentence: "Veridelta compares two datasets on their primary keys and reports every row that differs under the rules you declare." |
| "Nothing is forgiven unless a rule says so." | Veridelta's README, its first paragraph, word for word |
| "Maya declares the rename.", `stations.yaml` | `stations-suggest.txt`, `cat stations.yaml`, unchanged; `docs/rules.md`, renaming columns |
| "Then veridelta suggest reads the data and proposes the rest." and its output | `stations-suggest.txt`, unchanged; `docs/cli.md`: suggest "runs the comparison, then suggests rules that would explain the differences it finds, each with its evidence" |
| "One rule for humidity: a tiny tolerance, and minus 999 as missing. It explains all 124 rows." | `stations-suggest.txt`: `humidity: relative_tolerance 5e-08, null_values [-999.0] explains 124 of 124 differing rows` |
| "No model is called." | `docs/cli.md`, word for word |
| "The pressure fix was on purpose, so a baseline accepts those 31 rows. Only those.", `31`, "S3's pressure, and only that" | `stations-baseline.txt`: `Accepted: 31`; Veridelta's `tests/unit/test_demo_tape.py` holds `stations_accepted.json` to S3's 31 rows and `pressure_hpa` alone; `docs/cli.md`, accepting drift |
| The head of `stations_accepted.json`, `Accepted: 31` | `stations-baseline.txt`, unchanged |
| "What's left is the real bug. Four cold readings lost their minus sign. They were in the first rows all along." | `stations-data.txt`: `-3.5`, `-5.0`, `-5.9`, `-6.0` against `3.5`, `5.0`, `5.9`, `6.0`; `stations-baseline.txt`: `temperature_c: 4 mismatches` |
| "The run fails", the run's lines, FAILED, exit code 1 | `stations-baseline.txt`, unchanged: `Status: FAILED`, `Changed: 4`, `exit code: 1` |
| "and in CI, so does the pull request." | `docs/ci.md`: the GitHub Action runs on a pull request and fails the job on drift |
| "She fixes the port. It passes. One to one.", `100.0%`, PASSED, `exit code 0` | `stations-fixed.txt`: `Status: PASSED (Perfect Match)`, `Match Rate: 100.0%`, `exit code: 0`, on `stations_python_fixed.csv` |
| "Accepted: 31, the pressure fix made on purpose." | `stations-fixed.txt`: `Accepted: 31` |
| "Compare two datasets on their primary keys under rules you declare.", "Veridelta. Compare two datasets under rules you declare." | `pyproject.toml`'s description, its first clause |
| `pip install veridelta`, `veridelta.github.io/veridelta` | Veridelta's README |
| "Veridelta 0.35.1, the weather station demo in demo/promo at commit b8669bc", on every scene but the end card | `public/transcripts/manifest.json`: release `v0.35.1`, commit `b8669bc` |
