# Brag plan: Veridelta

Written by `/brag --full --format landscape --duration 20`, with [brag](https://github.com/latent-spaces/brag) at commit `8531ccb`, from Veridelta at commit `ebe1dff` (release 0.35.1). The voice is off, as brag's default. The first cut came to 21.5 seconds. The maintainer found it short, so a second cut adds two scenes, how `suggest` finds the rules and the fixed export passing, for 30 seconds. That is past brag's 15 to 25 seconds, for those two parts of the story.

## What is this app?

A command line tool that compares two datasets on their primary keys under rules you declare, and fails CI when they differ.

## The angle

The problem first. A team rewrites a pipeline and compares its output with the old one. A plain comparison calls every row different, because the rewrite spells the same data another way: upper case regions, one letter status codes, a rounding difference, and "N/A" for a blank. The real change hides in that noise. Veridelta lets you declare the noise as rules, so only the real change is left, and CI fails the pull request on it.

Every number comes from the accounts demo in Veridelta's `demo/promo/`, the same 40 accounts the full walkthrough uses.

## Hook (first 2 to 3 seconds)

The two file names, then a giant `0.0%` match rate, then "40 rows. 40 issues." The viewer sees the alarm before the product's name.

## Key moments

- Four real differences arrive one by one, each with a one word label: case, codes, rounding, blanks.
- `veridelta suggest` finds three of the rules from the data, each with its evidence, and calls no model.
- The rules file that declares them, with the project's own line: "Nothing is forgiven unless a rule says so."
- The GitHub Action's real comment on a pull request: FAILED, account 17, region `'south'` to `'east'`.
- The fixed export passes at `100.0%`, the mirror of the `0.0%` it opened on.

## Outro

The logo, the PyPI summary, `pip install veridelta`, and the docs address.

## User flow worth showing

Run the comparison and see a 0.0% match rate. Let `suggest` find the rules, and declare them. Run it in CI, which fails the pull request on the one real change. Fix the export, and it passes.

## Tone

- Preset: `default`.
- Creative direction: an engineer's demo, cut with punch. Plain words, real output, no hype.
- Interpretation: seven quick scenes on a light canvas in the logo's colors. Fast entrances, firm holds, orange for what is wrong, and blue for the answer.

## Format: landscape, 1920 by 1080, 30 fps

## Duration: 30 seconds

## Visual identity (from the project)

- Background: `#f5f7fa`, the media repository's `mist` tinted toward the navy.
- Text: navy `#0d2f5a`.
- Accent: orange `#de5807`, for the alarm and the differences; blue `#2054b2`, for a rule.
- Display and body font: Inter, as the media repository ships it.
- Data font: DejaVu Sans Mono.
- Strongest visual element: the symbol's two colors, orange into blue, as the docs header draws them, and the pull request comment.

## Share copy (draft)

A rewrite of a pipeline looked 0.0% like the old one. Four rules later, one real change was left, and CI caught it.

## Audio direction

- Role: a warm bed with sparse accents.
- Music: `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3`, steady and clean, by Sascha Ende, under CC BY 4.0.
- Music treatment: in from the first frame at 0.32, out over the last 1.5 seconds.
- Music cue guidance: the cue JSON in brag's `assets/music/cues/` gives 109.96 BPM and strong cues at 8.74, 13.11, 17.47, 22.37, 25.65, 26.74, and 27.3 seconds. The suggest headline, the rules headline, the pull request comment, the exit code, the logo, the install command, and the address lock to them. The four differences, the three counts, and the four rules take consecutive beats.
- Audio-reactive treatment: subtle. The glow behind each scene breathes with the bed's level. No waveforms.
- SFX posture: sparse. A soft thud for the alarm, a card slide for the first and last difference, soft thuds for suggest, the rules, the comment, and the pass, a light tap for the exit code, and one bell for the logo.
- Restraint rule: nothing louder than the bed for more than a moment, and nothing on every beat.

## Storyboard

### Scene 1: the alarm, 3.05 seconds

The two file names, `accounts_legacy.csv` and `accounts_rewrite.csv`, sit at the top. The match rate, `0.0%`, slams in huge in orange, under its label and a FAILED badge. Then "40 rows. 40 issues."

- Sequential: the label, the number, the line.
- Audio intent: a thud under the number.
- Transition: a push to scene 2.

### Scene 2: the noise, 4.4 seconds

"Most of it is noise." Four rows arrive on consecutive beats, each a value from the old file, an arrow, and the rewrite's value, with its label:

| Label | Old | Rewrite |
| :--- | :--- | :--- |
| Case | `west` | `WEST` |
| Codes | `active` | `A` |
| Rounding | `137.5` | `137.504` |
| Blanks | (empty) | `N/A` |

- Sequential: four rows, then all four hold for 1.6 seconds.
- Audio intent: a card slide on the first and the last row.
- Transition: a push to scene 3.

### Scene 3: suggest, 4.9 seconds

The logo at the top left. "veridelta suggest finds three, each with its evidence." Below it, the command and its six lines of evidence, unchanged, and the counts 38 of 39, 13 of 13, and 7 of 7 underlined one after another. Then "No model is called."

- Sequential: the three counts, on consecutive beats.
- Audio intent: a soft thud as the headline lands on the strong cue.
- Transition: a push to scene 4.

### Scene 4: the rules, 3.85 seconds

"Nothing is forgiven unless a rule says so." On the right, the `rules:` block of `accounts_rules.yaml`, its four rules lit one after another, each with its label from scene 2.

- Sequential: the four rules, on consecutive beats.
- Audio intent: a soft thud as the headline lands on the strong cue.
- Transition: a push to scene 5.

### Scene 5: what is left, 4.35 seconds

"What is left is real." The Action's comment arrives on the strong cue: its heading, "Veridelta: FAILED", and its changed values table, account 17's region from `'south'` to `'east'`, outlined in orange. Then "CI fails the pull request on it."

- Sequential: the headline, the comment, the outline and the second line.
- Audio intent: a soft thud as the comment lands.
- Transition: a push to scene 6.

### Scene 6: it passes, 4.3 seconds

"Fix the export, and it passes." The match rate, `100.0%`, slams in huge in blue, under its label and a PASSED badge, where the alarm had `0.0%` in orange. Then `exit code 0`, and "The baseline accepts one removal, made on purpose."

- Sequential: the headline, the number, the exit code and the line.
- Audio intent: a soft thud under the number, a light tap for the exit code.
- Transition: a blur crossfade to scene 7, the wind down.

### Scene 7: Veridelta, 5.15 seconds

The symbol and the wordmark. The summary: "Compare two datasets on their primary keys under rules you declare." Then `pip install veridelta` on the strong cue, and `veridelta.github.io/veridelta`.

- Audio intent: one bell as the logo lands, then the music fades out.

**Music mood:** steady and upbeat, under the alarm and through to the logo.

**Audio summary:** one clean bed from start to end, with quiet accents where the story turns.

## Claims and their sources

Every line on screen, and where it comes from. The transcripts are Veridelta's `demo/promo/*.txt` at commit `ebe1dff`, which the media repository copies to `public/transcripts/`.

| On screen | Source |
| :--- | :--- |
| `accounts_legacy.csv`, `accounts_rewrite.csv` | `accounts-run.txt`, the command it types |
| `0.0%`, match rate | `accounts-run.txt`: `Match Rate: 0.0%` |
| FAILED | `accounts-run.txt`: `Status: FAILED` |
| "40 rows. 40 issues." | `accounts-run.txt`: `Source Rows: 40`, `Total Issues: 40` |
| "Most of it is noise." | `accounts-rules.txt`: the four rules leave 2 of the 40 issues |
| `west` to `WEST`, `active` to `A`, `137.5` to `137.504`, a blank to `N/A` | `accounts-data.txt`, accounts 3 and 5 |
| Case, codes, rounding, blanks | the four rules: `case_insensitive`, `value_map`, `absolute_tolerance`, `null_values` |
| "veridelta suggest finds three, each with its evidence." | `accounts-suggest.txt`: three rules; `docs/cli.md`: suggest "suggests rules that would explain the differences it finds, each with its evidence" |
| `> veridelta suggest -c accounts.yaml` and its six evidence lines | `accounts-suggest.txt`, unchanged and in the tape's order |
| "No model is called." | `docs/cli.md`, word for word |
| The rules block | `accounts-rules.txt`, `cat accounts_rules.yaml`, unchanged |
| "Nothing is forgiven unless a rule says so." | Veridelta's README, its first paragraph, word for word |
| "What is left is real." | `accounts-baseline.txt`: one change, in `region`, and the removal the baseline accepts |
| The comment, FAILED, 17, `'south'`, `'east'` | `docs/assets/action-comment-light.png`, the CI guide's screenshot, cropped |
| "CI fails the pull request on it." | `docs/ci.md`: the action fails the job on drift |
| "Fix the export, and it passes." | `accounts-fixed.txt`: `veridelta run -c accounts_fixed.yaml`, on the export with account 17 fixed |
| `100.0%`, match rate, PASSED, `exit code 0` | `accounts-fixed.txt`: `Match Rate: 100.0%`, `Status: PASSED (Perfect Match)`, `exit code: 0` |
| "The baseline accepts one removal, made on purpose." | `accounts-baseline.txt`: `accepted.json` lists account 40 as removed; `accounts-fixed.txt`: `Accepted: 1` |
| "Compare two datasets on their primary keys under rules you declare." | `pyproject.toml`'s description, its first clause |
| `pip install veridelta`, `veridelta.github.io/veridelta` | Veridelta's README |
| "Veridelta 0.35.1, the accounts demo in demo/promo at commit ebe1dff", under every scene | `public/transcripts/manifest.json`: release `v0.35.1`, commit `ebe1dff` |
