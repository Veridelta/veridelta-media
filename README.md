# Veridelta media

Promotional videos for [Veridelta](https://github.com/Veridelta/veridelta), made with [Remotion](https://www.remotion.dev/). The terminal recordings they show are rendered from tapes in the Veridelta repository, at a pinned commit that runs a release, so every terminal frame is output the CLI printed. [Veridelta's decision record](https://github.com/Veridelta/veridelta/blob/main/decisions/promotional-videos-in-their-own-repository.md) says why the videos live here.

## The cuts

| Cut | Size | Length | Scenes |
| :--- | :--- | :--- | :--- |
| `promo-30` | 1920 by 1080 | About 30 seconds | The logo and summary, the quick start's files and run, how to install |
| `promo-60` | 1920 by 1080 | Under 60 seconds | Those, plus the HTML report, comparison inside the warehouse, and the MCP server |
| `promo-square-30` | 1080 by 1080 | About 30 seconds | As `promo-30`, for feeds that crop wide video |
| The demo, in [brag/](brag/README.md) | 1920 by 1080 | 21.5 seconds | The problem, then the answer, with music and no voice: two exports that match 0.0%, the noise behind it, the rules that declare it, the GitHub Action's comment on the one real change, and how to install |
| `demo-120` | 1920 by 1080 | About three minutes | The walkthrough, a narrated story on two CSV files: Sam checks the rewrite of a nightly export with the first run, how Veridelta decides, `suggest`, the rules and their limits, a baseline, the report, the GitHub Action's comment on a pull request, and the fixed export passing, then where else it runs and where the project stands |

The demo is a [Hyperframes](https://hyperframes.heygen.com/) project made with [brag](https://github.com/latent-spaces/brag), not a Remotion cut. [brag/README.md](brag/README.md) says how it was made and how to render it.

The Veridelta organization page shows [posters/demo-poster.png](posters/demo-poster.png), the demo's end card with a play button, links it to the demo, and links the walkthrough below it. [posters/demo-120-poster.png](posters/demo-120-poster.png) is a frame of `demo-120` with a play button.

[storyboard.md](storyboard.md) lists every scene with its length, its picture, its captions, and the docs page that backs each claim. [launch-kit.md](launch-kit.md) holds the posts and the alt text to publish them with.

## The rules

These are the [recording rules](https://github.com/Veridelta/veridelta/blob/main/.claude/skills/record-demo/SKILL.md#the-honesty-rules) of the Veridelta repository, applied to video:

- A terminal recording plays whole, at its own speed. Nothing is cut out of it, and no frame is edited. To change what it shows, change its tape in Veridelta and render it again.
- Every number on screen comes from the run the recording shows.
- No caption or post claims more than the docs say, and each scene names the docs page that backs it.
- A script that stands in for an agent says so on screen.
- Captions are on screen, since social video plays muted, and in an SRT file per cut.
- A terminal set in type, as in `demo-120`, shows its tape's transcript unchanged, in the tape's order, and names the tape and the commit on screen. Veridelta's tape test holds each transcript to what the CLI prints. An underline marks a line the voice talks about, and never changes its text.
- A narrated cut's subtitles are the voice's lines, word for word.

## Working on the videos

You need Node 22. `npm ci` installs the exact versions in `package-lock.json`.

| Command | What it does |
| :--- | :--- |
| `npm run studio` | Opens Remotion Studio, to watch and adjust the cuts. |
| `npm run render` | Renders every cut to `renders/`, which git ignores. `npm run render -- --scale=0.5` renders a half size preview. |
| `npm run posters` | Renders each poster in `src/Poster.tsx` to `posters/`: the last frame of one line of a cut, with a play button, for a README to link to the video. |
| `npm run generate` | Writes `captions/*.srt` and `storyboard.md` from `src/storyboard.ts`. Run it after changing a scene. |
| `npm run check` | Checks each clip against its checksum, each scene's docs page and caption times, and each post's length. |
| `npm run typecheck` | Type-checks the project. |
| `npm run fetch-clips -- v0.27.0` | Renders the recordings at a Veridelta release, or a later commit with the same package, and copies them into `public/clips/`. |
| `npm run fetch-transcripts -- ee04c6d` | Copies the accounts tapes' transcripts, the report of their last run, and the CI guide's screenshot of the Action's pull request comment, at a Veridelta release or a later commit with the same package, into `public/transcripts/`. |
| `npm run voice` | Speaks each narrated cut with Gemini's speech model into `public/voice/`, with a Google AI Studio key in `GEMINI_API_KEY`. It reads a whole cut in one request, a take, so every line has one tone and one level. `scripts/align.py` hears where each line's words are, with Whisper through `uv`, and the take is cut in the silence between lines; a take that skips or garbles a line is spoken again whole. `-- --again` speaks every take again, `-- --draft` uses espeak-ng instead, to time a draft, and `-- --samples` writes the first lines in a few voices to `samples/`. |
| `npm run check -- --final` | Also refuses a line the draft voice still speaks, and a narrated cut whose lines come from more than one take, before a cut is published. |

CI runs the type check, `npm run check`, and `npm run generate` on every pull request, fails when the generated files differ from the committed ones, and uploads a half size render of each cut as the `previews` artifact.

`src/storyboard.ts` defines every cut and scene. The compositions, the subtitles, and the storyboard all come from it, so a change there changes all three.

## Where the pictures come from

- `public/clips/` holds the terminal recordings and the report screenshot. `scripts/fetch-clips.sh` makes them: it clones Veridelta at the release or commit you name, runs `make demo-video`, and copies the files. A commit after a release works only while its `src/`, `pyproject.toml`, and `uv.lock` match the release's, so every frame is what that release prints. `public/clips/manifest.json` records the commit, the release, and each file's tape and checksum. Fetching needs what `make demo-video` needs: uv, vhs v0.12.1, ttyd, ffmpeg, and Chromium.
- The quick start and the MCP client come from the tapes in Veridelta's `demo/promo/`, kept for video alone. They type in a 32 pixel font, a few lines to a clip, so the text stays legible on a phone. No clip is enlarged, since an enlarged terminal blurs.
- `public/transcripts/` holds the transcripts of the accounts tapes in Veridelta's `demo/promo/`, and the HTML report of the run the last one types. `scripts/fetch-transcripts.sh` makes them, under the same release rule, after it runs Veridelta's tape test at that commit. `public/transcripts/manifest.json` records the commit, each transcript's tape, steps, and checksum, and the report's checksum.
- `public/voice/` holds each line of the narrated cuts, spoken by `npm run voice` and trimmed of silence. The take is set to -16 LUFS before it is cut, so the lines keep its levels. `public/voice/manifest.json` records each line's text, length, engine, voice, take, and checksum, and the cut is timed from those lengths.
- `public/music/` holds the music under the narrated cut. Git ignores it, since a track's license may not let this repository share the file, so a render plays music only where someone put the track. `demo-120` plays Bensound's "Hip Jazz", under Bensound's free license, which asks for the credit its last scene shows.
- `public/brand/` holds the logo, copied from Veridelta's `docs/assets/` at commit `6f09910`.
- `public/fonts/` holds Inter, under the SIL Open Font License 1.1, and DejaVu Sans Mono, under the Bitstream Vera license. Their license texts are beside them. They ship here so a cut renders the same on every machine.

## Licenses

The code in this repository is under the [Apache 2.0 license](LICENSE). Remotion is not: its [license](https://www.remotion.dev/license) is free for an individual, a company of up to three people, or a non-profit, and a larger company needs a company license. Veridelta has one maintainer, so the free license fits, as the maintainer decided on 2026-10-07. A fourth person means a company license, or moving the project to [Revideo](https://re.video/), which is MIT licensed.
