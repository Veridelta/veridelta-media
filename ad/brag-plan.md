# Brag plan: Veridelta, the 20-second ad

Written with [brag](https://github.com/latent-spaces/brag)'s full workflow, at commit `669ab92` (release 0.5.0), with the tone `cinematic`, music only, in three shapes. The material is Veridelta's weather station demo at commit `a2776a9`, which runs release 0.42.1: the same runs the 60-second demo in `brag/` shows.

## What is this app?

A command line tool that compares two datasets on their primary keys and reports every row that differs under the rules you declare, and fails CI when they differ.

## The angle

A port must match, and every row differs. That is the drama. The answer is not a feature list: it is one number, the match rate, climbing as the rules explain each difference, until only the real bug is left, and then a fix makes it 100%. The viewer sees what Veridelta does in the climb, by second 15, and the name and install line close it.

## Hook (first 3.7 seconds)

On the first frame: "Ported from IDL to Python." over "124 rows.", with 124 cells in a grid, four stations by 31 days. On the music's first strong beat, 1.6 seconds, "124 changed." slams in and every cell turns orange.

## Key moments

- The question, in two slams: "Fix" and "or corruption?"
- The light comes on: the canvas turns light, the symbol and the name land on a strong beat, then "Nothing is forgiven unless a rule says so."
- The climb: one giant match rate, 0.0% to 71.77% under "Rules you declare", to 96.77% under "Drift you accept" with 31 rows accepted, then "FAILED" and "The real bug fails CI", then 100.0% and "PASSED" under "Fixed. Exit code 0." Beside it, the run's own summary lines, unchanged.

## Outro

The symbol and the name, then `pip install veridelta`, then veridelta.github.io/veridelta.

## User flow worth showing

Run, rules, baseline, fix: the four runs of the weather station tapes, as their match rates.

## Tone

- Preset: cinematic
- Creative direction: a trailer for a data integrity tool. Short declarative lines, each landing before the next.
- Interpretation: dark navy scenes for the problem, a flip to the light canvas when Veridelta arrives, huge type, slams on strong beats, and long enough holds to read. Sentence case, as the repository's writing rules ask; the weight comes from size and contrast.

## Format and duration

Three shapes from one template: landscape 1920 by 1080, square 1080 by 1080, vertical 1080 by 1920. 20 seconds.

## Visual identity

- Problem scenes: navy `#0d2f5a`, white text, orange `#f39a5c` for what differs, code text `#e8eef6` and `#b4c3d6`
- Veridelta scenes: canvas `#f5f7fa`, navy text, orange `#b24606`, blue `#2054b2`
- Fonts: Inter (Regular, SemiBold, Bold) and DejaVu Sans Mono, as in `public/fonts/`
- Logo: `public/brand/veridelta-symbol.png`, shown at its own size, since it is 178 by 165 pixels (Veridelta/veridelta#426 asks for SVGs). The name is set in Inter Bold.

## Share copy (draft)

A port must match one to one, and every row differs. Veridelta compares two datasets under rules you declare, and only the real bug fails CI.

## Audio direction

- Role: cinematic support
- Music: "Happy Beats / Business Moves, Vol. 11" by Sascha Ende, bundled with brag, CC BY 4.0. 114.84 BPM.
- Treatment: full from the first frame, a fade in the last 0.8 seconds. The finished mix is set to -16 LUFS, as the 60-second demo's is.
- Music cue guidance: the preset's strong cues at 1.60, 3.70, 6.34 and 12.65 seconds, and its beat grid at 9.50, 11.60, 13.18, 14.76 and 16.86 seconds, carry the scene changes and the climb's steps.
- Audio-reactive treatment: none. The media-use skill that extracts per-frame audio is not installed here.
- SFX: sparse. A soft impact on "124 changed.", on "Fix" and on "or corruption?", a bell when Veridelta lands, a switch on each step of the climb, a heavier impact on FAILED, a bong on PASSED, and a soft impact when the name lands at the end.
- Restraint: no sound on every line, nothing bright or repeated quickly.

## Storyboard

### Scene 1: hook, 0 to 3.7 seconds

Navy. "Ported from IDL to Python." in small slate type, "124 rows." in white, and a grid of 124 cells below. On 1.6 seconds, "124 changed." slams in orange, and the cells turn orange left to right.
Audio: soft impact on the slam.
Transition: hard cut on the beat.

### Scene 2: question, 3.7 to 6.34 seconds

Navy. "Fix" slams on 3.7 seconds, "or corruption?" on 4.75. Both hold to 6.34.
Audio: soft impact on each slam.
Transition: the canvas floods light on the beat.

### Scene 3: Veridelta, 6.34 to 9.5 seconds

Light canvas. The symbol and the name "Veridelta" land on 6.34, with a bell. "Nothing is forgiven unless a rule says so." rises at 7.1 and holds.
Transition: navy again on 9.5.

### Scene 4: the climb, 9.5 to 16.86 seconds

Navy. "Match rate" above one giant number. Each step holds at least 1.5 seconds:

| From | Number | Label | Summary lines, from the tape |
| :--- | :--- | :--- | :--- |
| 9.5 | 0.0% | | `Status:        FAILED`, `Match Rate:    0.0%` |
| 9.96 | 71.77% | Rules you declare | `Status:        FAILED`, `Match Rate:    71.77%` |
| 11.6 | 96.77% | Drift you accept | `Match Rate:    96.77%`, `Accepted:      31` |
| 13.18 | 96.77%, FAILED | The real bug fails CI | `Changed:       4`, `exit code: 1` |
| 14.76 | 100.0%, PASSED | Fixed. Exit code 0. | `Status:        PASSED (Perfect Match)`, `exit code: 0` |

Audio: a switch on each step, a heavier impact on FAILED, a bong on PASSED.

### Scene 5: outro, 16.86 to 20 seconds

Light canvas. The symbol and "Veridelta" land on 16.86, `pip install veridelta` at 17.4, and veridelta.github.io/veridelta at 17.9. Holds to 20.
Audio: soft impact on the name, the music fades from 19.2.

## Claims and their sources

| Claim | Source |
| :--- | :--- |
| "Ported from IDL to Python." | The weather station demo: `stations_idl.csv` and `stations_python.csv`, in Veridelta's `demo/`, as `brag/brag-plan.md` tells it |
| "124 rows.", "124 changed.", the 124 cells | `public/transcripts/stations-run.txt`: `Source Rows:   124`, `Changed:       124`; four stations by 31 days, as the demo's data has |
| "Fix or corruption?" | The demo's own question, `brag/brag-plan.md` |
| "Nothing is forgiven unless a rule says so." | The docs home, https://veridelta.github.io/veridelta/ |
| 0.0% | `stations-run.txt`: `Match Rate:    0.0%` |
| 71.77%, "Rules you declare" | `stations-rules.txt`: `Match Rate:    71.77%`; the docs home: "under the rules you declare" |
| 96.77%, 31 accepted, "Drift you accept" | `stations-baseline.txt`: `Match Rate:    96.77%`, `Accepted:      31`; a baseline accepts named drift, https://veridelta.github.io/veridelta/cli/#accepting-drift |
| FAILED, 4 changed, exit code 1, "The real bug fails CI" | `stations-baseline.txt`; the docs home: "only the real bug fails CI" |
| 100.0%, PASSED, exit code 0 | `stations-fixed.txt` |
| `pip install veridelta`, veridelta.github.io/veridelta | The docs home's install section |
| "Veridelta 0.42.1, the weather station demo at commit a2776a9", on every scene but the last | `public/transcripts/manifest.json` |

**Music mood:** cinematic, full from the start.
**Audio summary:** one bed under the whole ad, with a few impacts where a line slams and a bell when Veridelta arrives.
