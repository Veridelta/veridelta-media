# Brag plan: Veridelta, the 24-second ad

Written with [brag](https://github.com/latent-spaces/brag)'s full workflow, at commit `669ab92` (release 0.5.0), with the tone `cinematic`, music only, in three shapes. The material is Veridelta's weather station demo at commit `a2776a9`, which runs release 0.42.1: the same runs the 60-second demo in `brag/` shows.

The first cut was faster: slams on every beat, a bell, five sound effects, and a match rate that changed four times in five seconds. The maintainer found it hard to read and asked for something smoother and simpler. This cut keeps one idea per screen, holds each line well past brag's reading floor, and lets the music carry it alone.

## What is this app?

A command line tool that compares two datasets on their primary keys and reports every row that differs under the rules you declare, and fails CI when they differ.

## The angle

A port must match, and every row differs. Veridelta turns that into one number, the match rate: 0.0% before any rules, 100.0% once the rules are declared and the real bug is fixed. The viewer knows what Veridelta does by second 17, and the end card says where to start.

## Hook (first 2 seconds)

On the first frame: "Ported from IDL to Python." over "124 rows.", with 124 cells in a grid, four stations by 31 days. On the music's first strong beat, 1.567 seconds, "124 changed." rises in and the cells warm to orange in one slow wave.

## Key moments

- The question, as one line: "Fix or corruption?"
- The light comes on: the symbol and the name, then "Nothing is forgiven unless a rule says so."
- Two runs, one number each: 0.0% and FAILED, "Without rules"; then 100.0% and PASSED, "With rules, and the bug fixed".

## Outro

The symbol and the name, then `pip install veridelta`, then veridelta.github.io/veridelta, one line at a time.

## Tone

- Preset: cinematic
- Creative direction: a calm trailer for a data integrity tool. One idea per screen, big type, no slams.
- Interpretation: dark navy for the problem and the runs, the light canvas when Veridelta arrives and at the end. Lines rise 18 pixels and fade in over 0.6 seconds; scenes dip through a 0.35-second fade out and a 0.6-second fade in. Sentence case, as the repository's writing rules ask.

## Format and duration

Three shapes from one template: landscape 1920 by 1080, square 1080 by 1080, vertical 1080 by 1920. 24.2 seconds. On a narrow frame the question breaks after "Fix".

## Visual identity

- Problem scenes: navy `#0d2f5a`, white text, orange `#f39a5c` for what differs, light blue `#8fb1f0` for the pass
- Veridelta scenes: canvas `#f5f7fa`, navy text, blue `#2054b2`
- Fonts: Inter (Regular, SemiBold, Bold) and DejaVu Sans Mono, as in `public/fonts/`
- Logo: `public/brand/veridelta-symbol.png`, shown at its own size, since it is 178 by 165 pixels (Veridelta/veridelta#426 asks for SVGs). The name is set in Inter Bold.

## Share copy

A port must match one to one, and every row differs. Veridelta compares two datasets under rules you declare, accepts the drift you name, and fails CI on the rest.

## Audio direction

- Role: cinematic support, music alone
- Music: "Happy Beats / Business Moves, Vol. 11" by Sascha Ende, bundled with brag, CC BY 4.0. 114.84 BPM.
- Treatment: full from the first frame, fading over the last 1.2 seconds. The finished mix is set to -16 LUFS, as the 60-second demo's is.
- Sound effects: none. The music carries every change.

## Beats

Every change starts on a beat of the track, on the frame nearest its onset. brag's cue preset gives each beat; an onset detector (spectral flux on the decoded audio) puts each onset 18 to 32 milliseconds before the preset's time, so the changes use the measured onsets, rounded to the frame at 30 frames a second.

| Change | Preset beat | Measured onset | Frame | In the finished files |
| :--- | :--- | :--- | :--- | :--- |
| "124 changed." rises | 1.602 s (strong) | 1.573 s | 47, 1.567 s | onset +6.5 ms after the frame |
| Question | 5.805 s (strong) | 5.782 s | 173, 5.767 s | onset +15.1 ms |
| Veridelta | 8.963 s (strong) | 8.940 s | 268, 8.933 s | onset +6.4 ms |
| The rule line | 9.497 s (strong) | 9.468 s | 284, 9.467 s | onset +1.2 ms |
| 0.0%, FAILED | 13.700 s | 13.677 s | 410, 13.667 s | onset +9.9 ms |
| 100.0%, PASSED | 16.858 s | 16.834 s | 505, 16.833 s | onset +1.2 ms |
| End card | 20.538 s | 20.515 s | 615, 20.5 s | onset +14.8 ms |
| The end | 24.230 s (strong) | 24.201 s | 726, 24.2 s | |

At each scene change the old scene has faded fully out and the new one has not started, so that frame is the emptiest of its neighborhood. In all three renders the emptiest frame is the change's own frame, to the frame. Every onset lands within half a frame, 16.7 milliseconds, of the change it carries.

## Storyboard

Every line holds at least 1.5 seconds once it has settled, and about 0.4 seconds a word for a sentence.

### Scene 1: hook, 0 to 5.77 seconds

Navy. "Ported from IDL to Python." and "124 rows." from the first frame, with 124 cells below. "124 changed." rises in on 1.567 seconds; the cells turn orange in one wave over a second. "124 changed." holds 3.2 seconds once settled.

### Scene 2: question, 5.77 to 8.93 seconds

Navy. "Fix or corruption?" rises in on the beat and holds 2.1 seconds.

### Scene 3: Veridelta, 8.93 to 13.67 seconds

Light canvas. The symbol and the name rise in on 8.933 seconds. "Nothing is forgiven unless a rule says so." rises in on 9.467 seconds and holds 3.25 seconds.

### Scene 4: the first run, 13.67 to 16.83 seconds

Navy. "Match rate" with a FAILED badge, 0.0% in orange, and "Without rules", together. They hold 2.2 seconds.

### Scene 5: the last run, 16.83 to 20.5 seconds

Navy. "Match rate" with a PASSED badge, 100.0% in light blue, and "With rules, and the bug fixed". They hold 2.7 seconds.

### Scene 6: end card, 20.5 to 24.2 seconds

Light canvas. The symbol and the name on 20.5 seconds, `pip install veridelta` half a second later, veridelta.github.io/veridelta half a second after that, and the music credit. The address holds 2 seconds as the music fades.

## Claims and their sources

| Claim | Source |
| :--- | :--- |
| "Ported from IDL to Python." | The weather station demo: `stations_idl.csv` and `stations_python.csv`, in Veridelta's `demo/`, as `brag/brag-plan.md` tells it |
| "124 rows.", "124 changed.", the 124 cells | `public/transcripts/stations-run.txt`: `Source Rows:   124`, `Changed:       124`; four stations by 31 days, as the demo's data has |
| "Fix or corruption?" | The demo's own question, `brag/brag-plan.md` |
| "Nothing is forgiven unless a rule says so." | The docs home, https://veridelta.github.io/veridelta/ |
| 0.0%, FAILED, "Without rules" | `stations-run.txt`: the first run names files and keys, no rules: `Status:        FAILED`, `Match Rate:    0.0%` |
| 100.0%, PASSED, "With rules, and the bug fixed" | `stations-fixed.txt`: the rules file, the baseline, and the fixed export: `Status:        PASSED (Perfect Match)`, `Match Rate:    100.0%` |
| `pip install veridelta`, veridelta.github.io/veridelta | The docs home's install section |
| "Veridelta 0.42.1, the weather station demo at commit a2776a9", on every scene but the last | `public/transcripts/manifest.json` |

**Music mood:** cinematic, calm, full from the start.
**Audio summary:** one bed under the whole ad, no sound effects, fading under the end card.
