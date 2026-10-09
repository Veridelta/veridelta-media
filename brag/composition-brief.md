# Hyperframes composition brief: Veridelta

## Objective

Create a short launch video for Veridelta that makes its problem plain in the first seconds and shows Veridelta as the answer.

## Output

- Composition directory: `brag/composition/`
- Rendered video: `brag/brag.mp4`, which git ignores
- Format: landscape, 1920 by 1080, 30 fps
- Duration: 21.5 seconds

## Source material

- Project root: Veridelta at commit `ebe1dff`, release 0.35.1.
- Files read: `README.md`, `pyproject.toml`, `docs/stylesheets/brand.css`, `docs/ci.md`, `docs/assets/`, and the accounts transcripts in `demo/promo/`.
- Product name: Veridelta.
- Strongest claim: "Nothing is forgiven unless a rule says so."
- Key UI to show: the GitHub Action's pull request comment, `docs/assets/action-comment-light.png`, cropped to its heading and its changed values table.
- Copy that must appear word for word:
  - `0.0%`, "40 rows. 40 issues."
  - "Most of it is noise."
  - the `rules:` block of `accounts_rules.yaml`
  - "Nothing is forgiven unless a rule says so."
  - "What is left is real." and "CI fails the pull request on it."
  - "Compare two datasets on their primary keys under rules you declare."
  - `pip install veridelta`, `veridelta.github.io/veridelta`

## Creative direction

- Tone preset: `default`.
- Creative direction: an engineer's demo, cut with punch. Plain words, real output, no hype.
- Interpretation: fast entrances and firm holds. Orange marks what is wrong; blue marks a rule.
- Angle: a rewrite looks 0.0% like the old export, because it spells the same data another way. Veridelta declares that noise as rules, and the one real change fails CI.
- Hook: the two file names, then a huge `0.0%` match rate.
- Outro: the logo, the summary, and the install command.
- Avoid:
  - generic SaaS language, and any claim the claim table in `brag-plan.md` does not trace;
  - abstract filler;
  - dashes in copy, title case, and marketing words, per Veridelta's writing rules.

## Visual identity

- Background: `#f5f7fa`, with a faint data grid and the symbol's orange into blue bar along the top, as the docs header draws it.
- Text: navy `#0d2f5a`; secondary text slate `#4a5d75`.
- Accent: orange `#de5807` for large text and shapes, and `#b24606` behind small white text; blue `#2054b2` for rules.
- Display and body font: Inter, from `assets/fonts/`.
- Data font: DejaVu Sans Mono, from `assets/fonts/`.
- Logo: `assets/images/veridelta-symbol.png` and `veridelta-wordmark.png`, from Veridelta's `docs/assets/`.

## Storyboard

`brag-plan.md` is the creative contract.

1. The alarm, 0 to 3.05 seconds: the file names, `0.0%` match rate, "40 rows. 40 issues."
2. The noise, 3.05 to 7.45: the headline, then four value pairs on consecutive beats.
3. The rules, 7.45 to 11.85: the logo, the rules block, the headline on the strong cue, each rule lit with its label.
4. What is left, 11.85 to 16.2: the headline, the comment on the strong cue, the outline, the second line.
5. Veridelta, 16.2 to 21.5: the logo on the strong cue, the summary, the install command, the address.

## Audio

- Role: a warm bed with sparse accents.
- Arc: steady from the first frame, out over the last 1.5 seconds.
- Music: `assets/music/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3` at 0.32.
- Music cue guidance: brag's preset `happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.json`, 109.96 BPM. Lock the rules headline to 8.74, the comment to 13.11, and the logo to 17.47. The four value pairs take 4.39, 4.91, 5.34, and 6.00.
- Audio-reactive: subtle. The glow behind the content breathes with the bed's level, from `assets/audio-levels.js`, made by Hyperframes' `extract-audio-data.py` from the first 21.5 seconds of the track.
- SFX: `impactSoft_medium_001` under the `0.0%`, `card-slide-1` on the first and last value pair, `impactSoft_medium_002` on the rules headline, `impactSoft_medium_003` on the comment, `impactBell_heavy_000` on the logo, and `bong_001` on the install command. All are Kenney's, under CC0, from brag's `assets/sfx/`.

## Hyperframes instructions

Built with `hyperframes-core`, `hyperframes-animation`, `hyperframes-creative`, `hyperframes-keyframes`, and `hyperframes-cli` from Hyperframes 0.8.143. One standalone `index.html`, one paused GSAP timeline, a shared background layer, and push slides between scenes, with a blur crossfade into the last.

- `npx hyperframes check` passes before render.
- Every line holds for at least 0.3 seconds a word once it has settled.
- Creation and render stay local.
