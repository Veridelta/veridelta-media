# The 25-second ad

A calm, cinematic ad for Veridelta, 25 seconds, music only, in three shapes: landscape 1920 by 1080, square 1080 by 1080, and vertical 1080 by 1920. It is made with [brag](https://github.com/latent-spaces/brag)'s full workflow and rendered by [Hyperframes](https://hyperframes.heygen.com/), as the 60-second demo in [brag/](../brag/README.md) is. It says what Veridelta does by second 16, so a viewer who scrolls past still knows, and one who stays knows where to look further. It looks unlike the demo and the promo cuts on purpose: one picture of two tables that changes, rather than text cards and terminals.

Your migration is done: does the data match? Two tables, Before and After, glide together and pair their rows by key. The pairs that differ glow; the rules you declare absorb the noise until one real bug is left; CI fails on it, then passes once it is fixed. It ends on `pip install veridelta` and the docs address. Each change starts on a beat of the music. [brag-plan.md](brag-plan.md) has the storyboard, the measured beats, and the source of every line.

## The files

| File | What it holds |
| :--- | :--- |
| [brag-plan.md](brag-plan.md) | The angle, the storyboard, the audio, and every line on screen with its source |
| [composition-brief.md](composition-brief.md) | What the plan hands to Hyperframes |
| [template.html](template.html) | The video, for every shape: the tables and their lines, and the end card, on one GSAP timeline |
| [shape.mjs](shape.mjs) | Writes `composition/index.html` from the template for one shape |
| `composition/` | The Hyperframes project: `index.html` for the landscape shape, and its fonts, symbol, and music |
| [finish.sh](finish.sh) | Checks, renders, and finishes each shape |
| [share-copy.txt](share-copy.txt) | The caption to post it with |

## Rendering

You need Node 22, ffmpeg, and Chrome. `npx hyperframes doctor` checks them; set `PRODUCER_HEADLESS_SHELL_PATH` to use a Chrome already on the machine.

```bash
ad/finish.sh
```

For each shape it writes `composition/index.html` from the template, runs `hyperframes check`, renders, takes the poster at 3.3 seconds, when "Does the data match?" has settled, sets the mix to -16 LUFS with its true peak under -1.5 dBFS, and puts the poster on frame 0, which feeds show before a video plays. It writes `ad-landscape.mp4`, `ad-square.mp4`, and `ad-vertical.mp4`, each with its `.jpg` poster, here, and git ignores them. `ad/finish.sh square` renders one shape.

To change the ad, edit `template.html`, never `composition/index.html`, then run `node ad/shape.mjs landscape` and `npx --yes hyperframes@0.8.143 check` in `composition/` for each shape you touched.

## The rules

The rules in the [README](../README.md#the-rules) hold here too:

- Every line says what Veridelta's docs say, and no more. [brag-plan.md](brag-plan.md#claims-and-their-sources) lists each one with its source.
- The tables are a picture, not a run, so they carry no number. The only values on screen are two rule settings, as a configuration writes them, and CI's exit codes.

## Credits and licenses

- Music: Sascha Ende, "Happy Beats / Business Moves, Vol. 11", from [ende.app](https://ende.app/en), under [CC BY 4.0](https://ende.app/en/standard-license). It ships with brag, and the end card credits it.
- Fonts: Inter, under the SIL Open Font License 1.1, and DejaVu Sans Mono, under the Bitstream Vera license. Their license texts are in `composition/assets/fonts/`.
- The symbol: Veridelta's `docs/assets/`, under Apache 2.0.
