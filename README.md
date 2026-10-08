# Veridelta media

Promotional videos for [Veridelta](https://github.com/Veridelta/veridelta), made with [Remotion](https://www.remotion.dev/). The terminal recordings they show are rendered from tapes in the Veridelta repository, at a pinned release, so every terminal frame is output the CLI printed. [Veridelta's decision record](https://github.com/Veridelta/veridelta/blob/main/decisions/promotional-videos-in-their-own-repository.md) says why the videos live here.

## The cuts

| Cut | Size | Length | Scenes |
| :--- | :--- | :--- | :--- |
| `promo-30` | 1920 by 1080 | About 30 seconds | The logo and summary, the quick start recording, how to install |
| `promo-60` | 1920 by 1080 | Under 60 seconds | Those, plus the HTML report, comparison inside the warehouse, and the MCP server |
| `promo-square-30` | 1080 by 1080 | About 30 seconds | As `promo-30`, for feeds that crop wide video |

[storyboard.md](storyboard.md) lists every scene with its length, its picture, its captions, and the docs page that backs each claim. [launch-kit.md](launch-kit.md) holds the posts and the alt text to publish them with.

## The rules

These are the [recording rules](https://github.com/Veridelta/veridelta/blob/main/.claude/skills/record-demo/SKILL.md#the-honesty-rules) of the Veridelta repository, applied to video:

- A terminal recording plays whole, at its own speed. Nothing is cut out of it, and no frame is edited. To change what it shows, change its tape in Veridelta and render it again.
- Every number on screen comes from the run the recording shows.
- No caption or post claims more than the docs say, and each scene names the docs page that backs it.
- A script that stands in for an agent says so on screen.
- Captions are on screen, since social video plays muted, and in an SRT file per cut.

## Working on the videos

You need Node 22. `npm ci` installs the exact versions in `package-lock.json`.

| Command | What it does |
| :--- | :--- |
| `npm run studio` | Opens Remotion Studio, to watch and adjust the cuts. |
| `npm run render` | Renders every cut to `renders/`, which git ignores. `npm run render -- --scale=0.5` renders a half size preview. |
| `npm run generate` | Writes `captions/*.srt` and `storyboard.md` from `src/storyboard.ts`. Run it after changing a scene. |
| `npm run check` | Checks each clip against its checksum, each scene's docs page and caption times, and each post's length. |
| `npm run typecheck` | Type-checks the project. |
| `npm run fetch-clips -- v0.27.0` | Renders the recordings at a Veridelta release and copies them into `public/clips/`. |

CI runs the type check, `npm run check`, and `npm run generate` on every pull request, fails when the generated files differ from the committed ones, and uploads a half size render of each cut as the `previews` artifact.

`src/storyboard.ts` defines every cut and scene. The compositions, the subtitles, and the storyboard all come from it, so a change there changes all three.

## Where the pictures come from

- `public/clips/` holds the terminal recordings and the report screenshot. `scripts/fetch-clips.sh` makes them: it clones Veridelta at the release you name, runs `make demo-video`, and copies the files. `public/clips/manifest.json` records the release, its commit, and each file's checksum. Fetching needs what `make demo-video` needs: uv, vhs v0.12.1, ttyd, ffmpeg, and Chromium.
- `public/brand/` holds the logo, copied from Veridelta's `docs/assets/` at commit `6f09910`.
- `public/fonts/` holds Inter, under the SIL Open Font License 1.1, and DejaVu Sans Mono, under the Bitstream Vera license. Their license texts are beside them. They ship here so a cut renders the same on every machine.

## Licenses

The code in this repository is under the [Apache 2.0 license](LICENSE). Remotion is not: its [license](https://www.remotion.dev/license) is free for an individual, a company of up to three people, or a non-profit, and a larger company needs a company license. Veridelta has one maintainer, so the free license fits, as the maintainer decided on 2026-10-07. A fourth person means a company license, or moving the project to [Revideo](https://re.video/), which is MIT licensed.
