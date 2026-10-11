# The 60-second demo

A short pitch for people who have not heard of Veridelta: data parity is the problem, and Veridelta is the answer. Maya, an atmospheric scientist, ports her weather pipeline from IDL to Python, and the new output has to match the old one to one. It does not: every row differs. Float precision, a renamed column, and a bug she fixed on purpose hide one real bug. Veridelta's rules, `suggest`, and a baseline leave only that bug, which fails CI, and the video ends on the six tutorials in the docs. It is narrated, with captions and music, and replaces both the 30-second cut and the three-minute walkthrough on the release.

It was made with [brag](https://github.com/latent-spaces/brag), an agent skill for short launch videos, at commit `8531ccb`, with brag's full workflow, which builds the video with [Hyperframes](https://hyperframes.heygen.com/) 0.8.143. The voice is Gemini's, as in the narrated Remotion cuts, in place of brag's own. The Remotion cuts in `src/` do not use Hyperframes.

## The files

| File | What it holds |
| :--- | :--- |
| [brag-plan.md](brag-plan.md) | The angle, the story, the audio, and a table of every spoken line and every line on screen with its source |
| [composition-brief.md](composition-brief.md) | What brag handed to Hyperframes |
| [narration.json](narration.json) | The narration, line by line and scene by scene, the voice and how it reads, the music and where its drop lands, and the sound effects |
| `composition/index.html` | The video: nine scenes on one GSAP timeline |
| `composition/assets/` | The fonts, the logo, the music, the sound effects, the voice, and each line's time |
| `demo.srt` | The captions, word for word, for the release |
| [finish.sh](finish.sh) | Renders the video and finishes it |
| [poster.html](poster.html) | The still the organization page links to the video with |
| [release-notes.md](release-notes.md) | The description of the demo's release |
| [share-copy.txt](share-copy.txt) | The caption to post the video with |

## The voice and its timing

`npm run voice -- --brag` speaks `narration.json` in one Gemini take, as `scripts/voice.ts` speaks a narrated cut, with `GEMINI_API_KEY` set. Whisper finds each line in the take, the take is cut between lines, and each line has its inner pauses capped at `pause` seconds and plays at `tempo` times its speed, at the same pitch, so the story keeps its pace without a word changing. The clips and their manifest go to `composition/assets/voice/`. The take is spoken again only when a line, the voice, the style, or the pause changes. When only `tempo` changes, the clips already spoken play again at the new speed, with no key and no request, so the voice stays the one heard. Then `scripts/align.py --words` times every word of each clip with Whisper, matching its words to the line letter by letter, and the manifest keeps each word's start and end.

`npm run brag-timing` then times the video by the voice:

- each scene holds its picture for its `lead` before its first line, plays its lines `gap` seconds apart, and holds for its `tail` after its last line, long enough to read what landed last;
- each scene enters on a beat of the music, the nearest one that keeps most of the tail before it;
- it writes each scene's, line's, and word's times to `composition/assets/timing.js`, and the timeline lands every element on the word that names it;
- it writes the music, each line's audio and caption, and the sound effects between the `narration` markers in `composition/index.html`, and the root's length;
- it places the music so its drop lands as Veridelta enters, after a hush on "Which differences are fixes, and which are corruption?";
- it plays each sound effect as a scene enters, as a line starts, or on a word Whisper heard;
- it writes `demo.srt`.

Change the words in `narration.json`, never in the generated block.

## Rendering

You need Node 22, ffmpeg, and Chrome. `npx hyperframes doctor` checks them; set `PRODUCER_HEADLESS_SHELL_PATH` to use a Chrome already on the machine. The render loads GSAP from jsDelivr, pinned to 3.14.2 with an integrity hash.

```bash
cd brag/composition && npx --yes hyperframes@0.8.143 check
cd .. && ./finish.sh
```

`check` runs Hyperframes' lint, a runtime pass, a layout pass, and a WCAG contrast pass on every line of text. `finish.sh` renders `brag.mp4`, then:

- it leaves the first frame as it is: the hook's title card, which players show before the video starts. brag's last step would put the end card there instead, which flashes for a frame as the video starts;
- it takes the end card half a second before the end as `brag.jpg`, for the poster;
- it sets the mix to -16 LUFS with its true peak under -1.5 dBFS, as the walkthrough's is;
- it writes `brag-inline.mp4`, a 720p copy under the 10 MB a GitHub description plays inline;
- it captures `poster.html`, the end card with a play button, to `../posters/demo-poster.png`.

Git ignores `brag.mp4`, `brag-inline.mp4`, and `brag.jpg`, as it ignores `renders/`.

## Publishing

Once a render is reviewed and merged, the Release the Demo workflow publishes it. Run it from the Actions tab, or through GitHub's API, on `main`. It renders the demo from that commit with `finish.sh` and publishes it as the release named in its `tag` input, `demo-60` by default, named for the demo's length:

- the assets are `veridelta-demo.mp4` and `veridelta-demo.srt`;
- a new release gets [release-notes.md](release-notes.md) as its description, and becomes the latest release;
- a release that exists gets the new assets and keeps its description;
- its `replaces` input names an older release to delete, with its tag, once the new one is up.

One step stays by hand: GitHub plays a video inline in a description only when it was uploaded through its web editor. Edit the release once, and drag `brag-inline.mp4` to the top of the description.

Link to the demo as https://github.com/Veridelta/veridelta-media/releases/latest, which follows the release when its name changes.

## The rules

The rules in the [README](../README.md#the-rules) hold here too:

- Every number on screen and in the voice comes from the weather station demo in Veridelta's `demo/promo/`, at commit `b8669bc`, which runs release 0.35.1. The top of every scene says so.
- Every terminal card shows lines from a transcript in `public/transcripts/`, unchanged and in order. A line too long for its card wraps at a space.
- The captions carry every spoken line, word for word.
- Every other line is the project's own words, or traces to a transcript, Veridelta's docs, or NV5's IDL docs. [brag-plan.md](brag-plan.md#claims-and-their-sources) lists each one with its source.

To change a line, change its row in that table first, then `narration.json` or `composition/index.html`.

## Credits and licenses

- Voice: Gemini's speech model, the voice Orus.
- Music: Sascha Ende, "Happy Beats / Business Moves, Vol. 1", from [ende.app](https://ende.app/en), under [CC BY 4.0](https://ende.app/en/standard-license). It ships with brag.
- Sound effects: [Kenney](https://kenney.nl/), under CC0. They ship with brag.
- Fonts: Inter, under the SIL Open Font License 1.1, and DejaVu Sans Mono, under the Bitstream Vera license, as in `public/fonts/`. Their license texts are beside them.
- The logo: Veridelta's `docs/assets/`, under Apache 2.0.
- brag is under the MIT license, and Hyperframes under Apache 2.0. Neither ships in this repository.
