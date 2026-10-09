# The 30-second demo

A short video for people who have not heard of Veridelta. It shows the problem first, a rewrite that matches its old export 0.0%, then Veridelta's answer, and the fixed export passing at 100.0%, in 30 seconds with music and no voice. The three-minute narrated cut, `demo-120`, stays as the walkthrough for those who want the whole story.

It was made with [brag](https://github.com/latent-spaces/brag), an agent skill for short launch videos, at commit `8531ccb`, with brag's full workflow, which builds the video with [Hyperframes](https://hyperframes.heygen.com/) 0.8.143. The Remotion cuts in `src/` do not use it.

## The files

| File | What it holds |
| :--- | :--- |
| [brag-plan.md](brag-plan.md) | The angle, the storyboard, the audio, and a table of every line on screen with its source |
| [composition-brief.md](composition-brief.md) | What brag handed to Hyperframes |
| `composition/index.html` | The video: seven scenes on one GSAP timeline |
| `composition/assets/` | The fonts, the logo, the CI guide's screenshot, the music, the sound effects, and the music's level for each frame |
| [finish.sh](finish.sh) | Renders the video and finishes it |
| [poster.html](poster.html) | The still the organization page links to the video with |
| [share-copy.txt](share-copy.txt) | The caption to post the video with |

## Rendering

You need Node 22, ffmpeg, and Chrome. `npx hyperframes doctor` checks them; set `PRODUCER_HEADLESS_SHELL_PATH` to use a Chrome already on the machine. The render loads GSAP from jsDelivr, pinned to 3.14.2 with an integrity hash.

```bash
cd brag/composition && npx --yes hyperframes@0.8.143 check
cd .. && ./finish.sh
```

`check` runs Hyperframes' lint, a runtime pass, a layout pass, and a WCAG contrast pass on every line of text. `finish.sh` renders `brag.mp4`, then does what brag's last step asks:

- it takes the end card at 29.5 seconds as `brag.jpg`, and puts it in place of frame 0, so a player's thumbnail is the end card;
- it sets the mix to -16 LUFS with its true peak under -1.5 dBFS, as the walkthrough's is;
- it captures `poster.html`, the end card with a play button, to `../posters/demo-poster.png`.

Git ignores `brag.mp4` and `brag.jpg`, as it ignores `renders/`. The video is about 7 MB, under the 10 MB a GitHub description plays inline.

## The rules

The rules in the [README](../README.md#the-rules) hold here too:

- Every number on screen comes from the accounts demo in Veridelta's `demo/promo/`, at commit `ebe1dff`, which runs release 0.35.1. The bottom of every scene says so.
- The suggest card shows the command and the evidence lines that `accounts-suggest.txt` prints, unchanged and in order, and the rules file shows the `rules:` block that `accounts-rules.txt` prints, unchanged.
- The pull request comment is the CI guide's screenshot, `docs/assets/action-comment-light.png`, cropped to its heading and its changed values.
- Every other line is the project's own words or traces to a transcript. [brag-plan.md](brag-plan.md#claims-and-their-sources) lists each one with its source.

To change a line, change its row in that table first, then `composition/index.html`.

`composition/assets/audio-levels.js` holds the music's level for each frame, which the glow behind each scene follows. Hyperframes' `extract-audio-data.py`, from its `hyperframes-creative` skill, measured it on the first 30 seconds of the track. Measure it again only if the music changes.

## Credits and licenses

- Music: Sascha Ende, "Happy Beats / Business Moves, Vol. 12", from [ende.app](https://ende.app/en), under [CC BY 4.0](https://ende.app/en/standard-license). It ships with brag.
- Sound effects: [Kenney](https://kenney.nl/), under CC0. They ship with brag.
- Fonts: Inter, under the SIL Open Font License 1.1, and DejaVu Sans Mono, under the Bitstream Vera license, as in `public/fonts/`. Their license texts are beside them.
- The logo and the screenshot: Veridelta's `docs/assets/` at commit `ebe1dff`, under Apache 2.0.
- brag is under the MIT license, and Hyperframes under Apache 2.0. Neither ships in this repository.
