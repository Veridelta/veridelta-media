# Brag plan: Veridelta, the 25-second ad

Written with [brag](https://github.com/latent-spaces/brag)'s full workflow, at commit `669ab92` (release 0.5.0), with the tone `cinematic`, music only, in three shapes.

The first two cuts told the 60-second demo's story, a port from one language to another, with its numbers. The maintainer asked for a story anyone in data recognizes, without a language a general audience may not know, and for something visually different from the demo and the promo cuts: no text card, no terminal, no install card sequence. This cut keeps what they liked in the second one: smooth eased motion, music alone, changes on measured beats, one idea per screen, and every line held long enough to read.

## What is this app?

A command line tool that compares two datasets on their primary keys and reports every row that differs under the rules you declare, and fails CI when they differ.

## The angle

Everyone who ships data has finished a migration, a rewrite, or a pipeline change and wondered whether the data still matches. The ad shows the answer as one picture that changes: two tables, Before and After, glide together and pair their rows by key; the pairs that differ glow; the rules you declare absorb the noise until one real bug is left; CI fails on it, then passes once it is fixed. The tables are abstract, so they show no number that a run did not print. The only values on screen are two rule settings, as a configuration would write them, and CI's exit codes.

## Hook (first 2 seconds)

On the first frame: "Your migration is done." over two tables, Before and After, eight rows each, a key and three values a row, with two pairs of rows in the After table out of order. On the music's first strong beat, 1.567 seconds, "Does the data match?" rises in below it.

## Key moments

- The tables glide together, and the rows out of order trade places, side by side, until every row sits beside the row with its key: "Veridelta pairs every row by its key." The pairs that match settle; five that differ glow orange.
- "Your rules forgive the noise." Two rule settings appear, `absolute_tolerance: 0.01` and `case_insensitive: true`, and on two beats four of the glowing cells settle, two and two.
- "The real bug fails CI." One cell still glows, and a red badge reads "✕ CI · exit code 1".
- "Fix it, and CI passes." The cell turns blue and settles, and the badge turns green: "✓ CI · exit code 0".

## Outro

A light end card: the symbol and the name with `pip install veridelta`, then veridelta.github.io/veridelta and the music credit.

## Tone

- Preset: cinematic
- Creative direction: a calm product film about trust in data. One picture that changes, one line at a time.
- Interpretation: navy for the data, light for the end card. Lines rise 18 pixels and fade in over 0.6 seconds, a line leaves in 0.35 seconds before the next arrives, fades and dims start on their beat and settle softly. No slams, no shakes, no sound effects. Sentence case, as the repository's writing rules ask.

## Format and duration

Three shapes from one template: landscape 1920 by 1080, square 1080 by 1080, vertical 1080 by 1920. 24.7 seconds. The tables scale with the frame: 1.2 times in landscape, 1.25 in square, 1.45 in vertical. On a narrow frame "Your rules forgive the noise." breaks after "forgive".

## Visual identity

- Data scenes: navy `#0d2f5a` to `#08213f`, white lines, cells `#2b5d99`, orange `#de5807` and `#f39a5c` for what differs, blue `#2054b2` and `#8fb1f0` for the fix and the pass
- End card: canvas `#f5f7fa`, navy and blue
- Fonts: Inter (Regular, SemiBold, Bold) and DejaVu Sans Mono, as in `public/fonts/`
- Logo: `public/brand/veridelta-symbol.png`, shown at its own size, since it is 178 by 165 pixels (Veridelta/veridelta#426 asks for SVGs). The name is set in Inter Bold.

## Share copy

Your migration is done. Does the data match? Veridelta pairs every row by its key, your rules forgive the noise, and only the real bug fails CI.

## Audio direction

- Role: cinematic support, music alone
- Music: "Happy Beats / Business Moves, Vol. 11" by Sascha Ende, bundled with brag, CC BY 4.0. 114.84 BPM.
- Treatment: full from the first frame, fading over the last 1.2 seconds. The finished mix is set to -16 LUFS.
- Sound effects: none.

## Beats

Every change starts on a beat of the track, on the frame nearest its onset. brag's cue preset gives each beat; an onset detector (spectral flux on the decoded audio) puts each onset 18 to 35 milliseconds before the preset's time, so the changes use the measured onsets, rounded to the frame at 30 frames a second. In the finished files, the beat's onset and the frame where the picture first changes:

| Change | Frame | Onset, from the frame | Picture first changes |
| :--- | :--- | :--- | :--- |
| "Does the data match?" | 47, 1.567 s (strong) | +6.5 ms | frame 48 |
| The tables glide together | 173, 5.767 s (strong) | +15.1 ms | frame 173 |
| "Veridelta pairs every row by its key." | 189, 6.3 s (strong) | +10.0 ms | frame 189 |
| The differences glow | 220, 7.333 s | +15.8 ms | frame 221 |
| "Your rules forgive the noise." | 347, 11.567 s (strong) | +8.4 ms | frame 347 |
| The two rules | 363, 12.1 s (strong) | -2.4 ms | frame 364 |
| The tolerance absorbs two | 379, 12.633 s (strong) | -7.4 ms | frame 380 |
| The case rule absorbs two | 394, 13.133 s | +15.0 ms | frame 394 to 395 |
| "The real bug fails CI." | 458, 15.267 s | -5.4 ms | frame 458 |
| exit code 1 | 474, 15.8 s | -16.2 ms | frame 475 |
| "Fix it, and CI passes." | 568, 18.933 s | +2.6 ms | frame 568 |
| exit code 0 | 584, 19.467 s (strong) | -2.6 ms | frame 584 |
| End card | 663, 22.1 s | -6.2 ms | frame 663 |
| The address | 679, 22.633 s (strong) | -11.3 ms | frame 679 |

Every onset lands within half a frame, 16.7 milliseconds, of its change. A fade from nothing shows on the frame after the one it starts on, which is why some changes first appear a frame late; none later. The measurements are the same in all three shapes.

## Storyboard

Every line holds at least 1.5 seconds once it has settled, and about 0.4 seconds a word for a sentence.

| Seconds | Screen | On screen | Line held |
| :--- | :--- | :--- | :--- |
| 0 to 5.77 | The question | "Your migration is done." and the two tables from the first frame; "Does the data match?" rises in at 1.567 | 3.25 s |
| 5.77 to 11.57 | Pairing | The tables glide together and two pairs of rows trade places; "Veridelta pairs every row by its key."; the five pairs that differ glow at 7.333 | 4.3 s |
| 11.57 to 15.27 | Rules | "Your rules forgive the noise."; `absolute_tolerance: 0.01` and `case_insensitive: true`; four glows settle at 12.633 and 13.133 | 2.75 s |
| 15.27 to 18.93 | The bug | "The real bug fails CI."; one cell still glows; "✕ CI · exit code 1" | 2.7 s |
| 18.93 to 22.1 | The fix | "Fix it, and CI passes."; the cell turns blue and settles; "✓ CI · exit code 0" | 2.2 s |
| 22.1 to 24.73 | End card | The symbol and the name with `pip install veridelta`; veridelta.github.io/veridelta and the music credit at 22.633 | 1.5 s |

## Claims and their sources

| Claim | Source |
| :--- | :--- |
| "Your migration is done. Does the data match?" | The docs home: "Use it to verify a migration, a pipeline change, or a model's new evaluation run", https://veridelta.github.io/veridelta/ |
| "Veridelta pairs every row by its key.", rows pairing by key | The docs home: "compares two datasets on their primary keys and reports every row that differs" |
| "Your rules forgive the noise.", rows a rule absorbs | The docs home: "Nothing is forgiven unless a rule says so."; the rules page, https://veridelta.github.io/veridelta/rules/ |
| `absolute_tolerance: 0.01`, `case_insensitive: true` | Rule fields on the rules page, written as a configuration file writes them |
| "The real bug fails CI.", exit code 1 | The docs home: "only the real bug fails CI", and "the exit code tells CI whether the datasets match"; the command line page's exit codes, https://veridelta.github.io/veridelta/cli/#exit-codes |
| "Fix it, and CI passes.", exit code 0 | The command line page's exit codes |
| `pip install veridelta`, veridelta.github.io/veridelta | The docs home's install section |

The tables, their eight rows, and which cells differ are a picture, not a run: they carry no number.

**Music mood:** cinematic, calm, full from the start.
**Audio summary:** one bed under the whole ad, no sound effects, fading under the end card.
