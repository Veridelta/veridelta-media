# Launch kit

Texts and alt text to post the cuts with. Every claim here is one the docs make, and every number comes from the run the video shows. `npm run check` holds each post to 280 characters, so each fits every site below.

## What Veridelta does

The sentence, PyPI's summary word for word:

> Compare two datasets on their primary keys under rules you declare, on a laptop, in CI, or inside a warehouse.

The paragraph, from the README:

> Veridelta compares two datasets on their primary keys and reports every row that differs under the rules you declare. Nothing is forgiven unless a rule says so, and the exit code tells CI whether the datasets match. Use it to verify a migration, a pipeline change, or a model's new evaluation run, on a laptop, in CI, or inside a warehouse.

## Posts

With the demo, `brag/brag.mp4`, as `brag/share-copy.txt` has it:

```text
Porting a weather pipeline from IDL to Python, every row differed. Float noise, a fill value, a renamed column, a fix made on purpose, and one new bug. Veridelta sorts them under rules you declare, and only the new bug fails the run.

https://veridelta.github.io/veridelta/
```

With `promo-30` or `promo-square-30`:

```text
Veridelta compares two datasets on their primary keys and reports every row that differs under the rules you declare. The exit code tells CI whether they match.

pip install veridelta
https://veridelta.github.io/veridelta/
```

With `promo-60`, for a migration:

```text
Moving a table to a new system? Veridelta pairs its rows on their primary keys and lists every row added, removed, or changed. Two tables in Snowflake, Databricks, or BigQuery are compared where they are stored.

https://github.com/Veridelta/veridelta
```

For AI agents, with `promo-60`:

```text
veridelta mcp serves Veridelta's checks and comparisons as MCP tools, so an agent's host can call them without a shell. It reads files only from the folders you name.

https://veridelta.github.io/veridelta/agents/
```

## Alt text

The demo:

> Maya's weather station pipeline, IDL to Python, and the first rows of both files, which must match one to one. The first run fails at a match rate of 0.0%: 124 rows, 124 changed. Why does every row differ? 91.900002 became 91.9, from 32-bit floats in IDL and 64-bit in Python. -999.000000 became a blank. temp became temperature_c, so it was never compared. S3's pressure went from 998.6 to 1010.7, a fix made on purpose. A grid of 124 changed rows asks: fix or corruption? Then the Veridelta logo: two datasets, their keys, your rules. Nothing is forgiven unless a rule says so. Maya declares the rename, and veridelta suggest proposes a rule for humidity, a relative tolerance and -999.0 as missing, which explains 124 of 124 differing rows. No model is called. A baseline accepts S3's 31 pressure rows, and only those. What is left is real: four cold readings lost their minus sign, in the first rows from the start, and the run fails with exit code 1. The fixed port passes at 100.0%, exit code 0. It ends on the logo, the summary, pip install veridelta, and the docs address. It is narrated, with captions.

`promo-30` and `promo-square-30`:

> The Veridelta logo and its summary, then a terminal in a large font. A five-line veridelta.yaml names two three-row CSV files, legacy.csv and modern.csv. veridelta run finds 1 row added, 1 removed, and 1 changed, and the exit code is 1. It ends on pip install veridelta and the docs address.

`promo-60`:

> The Veridelta logo and its summary, then a terminal in a large font. A five-line veridelta.yaml names two three-row CSV files. veridelta run finds 1 row added, 1 removed, and 1 changed, and the exit code is 1. Then the top of an HTML report from a comparison of 120 orders, a card that says two tables in Snowflake, Databricks, or BigQuery are compared where they are stored, and a script that calls the MCP server's tools and prints each answer. It ends on pip install veridelta and the docs address.

The link preview card, `docs/assets/social-card.png` in the Veridelta repository:

> The Veridelta logo, its one-line summary, and the top of an HTML report from a real run.

## Files

| File | Size | Shape | Use |
| :--- | :--- | :--- | :--- |
| `brag/brag.mp4` | 1920 by 1080, 85 seconds | 16:9 | The first video anyone sees: a release, a README, a post |
| `brag/brag-inline.mp4` | 1280 by 720, 85 seconds, under 10 MB | 16:9 | A release description, which plays a video under 10 MB inline |
| `brag/demo.srt` | | | The demo's captions, beside the video on a release |
| `renders/promo-30.mp4` | 1920 by 1080, about 30 seconds | 16:9 | A post with a wide player, or a page |
| `renders/promo-60.mp4` | 1920 by 1080, under 60 seconds | 16:9 | A launch post, or the README of a talk |
| `renders/promo-square-30.mp4` | 1080 by 1080, about 30 seconds | 1:1 | A feed that crops wide video |
| `captions/*.srt` | One per cut | | Upload beside the video where a site takes subtitles |
| `social-card.png` in Veridelta's `docs/assets/` | 1280 by 640 | 2:1 | The repository's social preview and the docs site's link preview |

Each site sets its own limits on length, size, and format, and they change. Check the site's current help page before posting.
