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
A rewritten export matched the old one 0.0%. Most of it was noise: case, codes, rounding, blanks. Declare those as rules in Veridelta, and what is left is real. Here, account 17's region, and CI fails the pull request on it.

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

> Two files, accounts_legacy.csv and accounts_rewrite.csv, and a match rate of 0.0%: 40 rows, 40 issues. Most of it is noise: west became WEST, active became A, 137.5 became 137.504, and a blank became N/A. Then the Veridelta logo, and veridelta suggest finds three rules, each with its evidence: 38 of 39, 13 of 13, and 7 of 7 differing rows. No model is called. The line "Nothing is forgiven unless a rule says so." and the four rules in accounts_rules.yaml. What is left is real: the GitHub Action's comment on a pull request, Veridelta: FAILED, with account 17's region changed from south to east, and the line "CI fails the pull request on it." Fix the export, and it passes: a match rate of 100.0%, exit code 0, with one removal the baseline accepts on purpose. It ends on the logo, the summary, pip install veridelta, and the docs address.

`promo-30` and `promo-square-30`:

> The Veridelta logo and its summary, then a terminal in a large font. A five-line veridelta.yaml names two three-row CSV files, legacy.csv and modern.csv. veridelta run finds 1 row added, 1 removed, and 1 changed, and the exit code is 1. It ends on pip install veridelta and the docs address.

`promo-60`:

> The Veridelta logo and its summary, then a terminal in a large font. A five-line veridelta.yaml names two three-row CSV files. veridelta run finds 1 row added, 1 removed, and 1 changed, and the exit code is 1. Then the top of an HTML report from a comparison of 120 orders, a card that says two tables in Snowflake, Databricks, or BigQuery are compared where they are stored, and a script that calls the MCP server's tools and prints each answer. It ends on pip install veridelta and the docs address.

The link preview card, `docs/assets/social-card.png` in the Veridelta repository:

> The Veridelta logo, its one-line summary, and the top of an HTML report from a real run.

## Files

| File | Size | Shape | Use |
| :--- | :--- | :--- | :--- |
| `brag/brag.mp4` | 1920 by 1080, 30 seconds, about 7 MB | 16:9 | The first video anyone sees: a release, a README, a post |
| `renders/promo-30.mp4` | 1920 by 1080, about 30 seconds | 16:9 | A post with a wide player, or a page |
| `renders/promo-60.mp4` | 1920 by 1080, under 60 seconds | 16:9 | A launch post, or the README of a talk |
| `renders/promo-square-30.mp4` | 1080 by 1080, about 30 seconds | 1:1 | A feed that crops wide video |
| `captions/*.srt` | One per cut | | Upload beside the video where a site takes subtitles |
| `social-card.png` in Veridelta's `docs/assets/` | 1280 by 640 | 2:1 | The repository's social preview and the docs site's link preview |

Each site sets its own limits on length, size, and format, and they change. Check the site's current help page before posting.
