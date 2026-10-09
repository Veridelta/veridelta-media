# Storyboard

`npm run generate` writes this file from `src/storyboard.ts`. Change that file, not this one.

Every terminal recording and the report screenshot come from Veridelta commit `6375e5b`, whose package is v0.27.1's, rendered with make demo-video and vhs v0.12.1. `public/clips/manifest.json` holds each file's tape and checksum. Each recording plays whole, as its tape typed it.

The narrated cut sets in type the transcripts of Veridelta commit `c0afe41`, whose package is v0.33.4's, and shows the HTML report of the run its last tape types. `public/transcripts/manifest.json` holds each file's tape, its steps, and its checksum. Its voice is espeak (en-us), and its subtitles are the voice's lines, word for word.

## promo-30: 30 seconds, 1920 by 1080

29.0 seconds, with subtitles in `captions/promo-30.srt`.

| Time | Scene | Picture | Captions | Backed by |
| :--- | :--- | :--- | :--- | :--- |
| 0:00.0 to 0:03.0 | title | The logo, then PyPI's one-line summary. | 0:00.0 Compare two datasets on their primary keys under rules you declare, on a laptop, in CI, or inside a warehouse. | [veridelta.github.io/veridelta/](https://veridelta.github.io/veridelta/) |
| 0:03.0 to 0:14.2 | data | The quick start's files, recorded whole for video: a five-line configuration and two three-row CSV files. | 0:03.0 The smallest configuration names a source, a target, and the primary key, id.<br>0:07.3 Two exports that should match, with three rows each. | [veridelta.github.io/veridelta/configuration/](https://veridelta.github.io/veridelta/configuration/) |
| 0:14.2 to 0:25.0 | run | The quick start's run, recorded whole for video: `veridelta run -q`, its summary, and the exit code. | 0:14.2 veridelta run compares them: 1 row added, 1 removed, and 1 changed.<br>0:21.0 The exit code, 1, tells CI that the datasets differ. | [veridelta.github.io/veridelta/cli/#exit-codes](https://veridelta.github.io/veridelta/cli/#exit-codes) |
| 0:25.0 to 0:29.0 | install | The wordmark, the install command, and the docs address. | 0:25.0 pip install veridelta. The docs are at veridelta.github.io/veridelta. | [veridelta.github.io/veridelta/#install](https://veridelta.github.io/veridelta/#install) |

## promo-60: 60 seconds, 1920 by 1080

55.5 seconds, with subtitles in `captions/promo-60.srt`.

| Time | Scene | Picture | Captions | Backed by |
| :--- | :--- | :--- | :--- | :--- |
| 0:00.0 to 0:03.0 | title | The logo, then PyPI's one-line summary. | 0:00.0 Compare two datasets on their primary keys under rules you declare, on a laptop, in CI, or inside a warehouse. | [veridelta.github.io/veridelta/](https://veridelta.github.io/veridelta/) |
| 0:03.0 to 0:14.2 | data | The quick start's files, recorded whole for video: a five-line configuration and two three-row CSV files. | 0:03.0 The smallest configuration names a source, a target, and the primary key, id.<br>0:07.3 Two exports that should match, with three rows each. | [veridelta.github.io/veridelta/configuration/](https://veridelta.github.io/veridelta/configuration/) |
| 0:14.2 to 0:25.0 | run | The quick start's run, recorded whole for video: `veridelta run -q`, its summary, and the exit code. | 0:14.2 veridelta run compares them: 1 row added, 1 removed, and 1 changed.<br>0:21.0 The exit code, 1, tells CI that the datasets differ. | [veridelta.github.io/veridelta/cli/#exit-codes](https://veridelta.github.io/veridelta/cli/#exit-codes) |
| 0:25.0 to 0:32.0 | report | The top of the HTML report from the docs, a comparison of 120 orders. | 0:25.0 veridelta run --html writes a standalone report that opens offline, with changed rows side by side. | [veridelta.github.io/veridelta/results/#html-report](https://veridelta.github.io/veridelta/results/#html-report) |
| 0:32.0 to 0:38.0 | warehouse | A card in the logo's colors, with two sentences from the README. | 0:32.0 Two tables in Snowflake, Databricks, or BigQuery are compared where they are stored. Only counts and keys come back. | [veridelta.github.io/veridelta/pushdown/](https://veridelta.github.io/veridelta/pushdown/) |
| 0:38.0 to 0:51.5 | mcp | The MCP client, recorded whole for video: a script calls `validate_config`, `run_comparison`, and `read_discrepancies`, and prints each answer, one field to a line. | 0:38.0 veridelta mcp serves the same checks as MCP tools, so an agent's host can call them without a shell.<br>0:45.0 Here a script calls the tools, as an agent's host does. | [veridelta.github.io/veridelta/agents/#mcp-server](https://veridelta.github.io/veridelta/agents/#mcp-server) |
| 0:51.5 to 0:55.5 | install | The wordmark, the install command, and the docs address. | 0:51.5 pip install veridelta. The docs are at veridelta.github.io/veridelta. | [veridelta.github.io/veridelta/#install](https://veridelta.github.io/veridelta/#install) |

## promo-square-30: 30 seconds, 1080 by 1080, for social feeds

29.0 seconds, with subtitles in `captions/promo-square-30.srt`.

| Time | Scene | Picture | Captions | Backed by |
| :--- | :--- | :--- | :--- | :--- |
| 0:00.0 to 0:03.0 | title | The logo, then PyPI's one-line summary. | 0:00.0 Compare two datasets on their primary keys under rules you declare, on a laptop, in CI, or inside a warehouse. | [veridelta.github.io/veridelta/](https://veridelta.github.io/veridelta/) |
| 0:03.0 to 0:14.2 | data | The quick start's files, recorded whole for video: a five-line configuration and two three-row CSV files. | 0:03.0 The smallest configuration names a source, a target, and the primary key, id.<br>0:07.3 Two exports that should match, with three rows each. | [veridelta.github.io/veridelta/configuration/](https://veridelta.github.io/veridelta/configuration/) |
| 0:14.2 to 0:25.0 | run | The quick start's run, recorded whole for video: `veridelta run -q`, its summary, and the exit code. | 0:14.2 veridelta run compares them: 1 row added, 1 removed, and 1 changed.<br>0:21.0 The exit code, 1, tells CI that the datasets differ. | [veridelta.github.io/veridelta/cli/#exit-codes](https://veridelta.github.io/veridelta/cli/#exit-codes) |
| 0:25.0 to 0:29.0 | install | The wordmark, the install command, and the docs address. | 0:25.0 pip install veridelta. The docs are at veridelta.github.io/veridelta. | [veridelta.github.io/veridelta/#install](https://veridelta.github.io/veridelta/#install) |

## demo-120: About two minutes, 1920 by 1080, narrated, on CSV files

125.6 seconds, with subtitles in `captions/demo-120.srt`.

| Time | Scene | Picture | Captions | Backed by |
| :--- | :--- | :--- | :--- | :--- |
| 0:00.0 to 0:10.0 | accounts-data | The first six lines of each CSV file, from the legacy job and its rewrite. | 0:00.0 Sam is replacing a legacy job that exports 40 accounts.<br>0:04.7 Before switching, Sam has to show that the new export matches the old one. | [veridelta.github.io/veridelta/how-to/from-drift-to-rules/](https://veridelta.github.io/veridelta/how-to/from-drift-to-rules/) |
| 0:10.0 to 0:24.2 | accounts-run | `veridelta run` on the two files and `--key account_id`: FAILED, 39 changed, 1 removed, and exit code 1. | 0:10.0 Veridelta pairs the rows by account ID and compares each column.<br>0:15.1 39 rows differ, and one account is missing.<br>0:18.5 In CI, exit code 1 fails the check. But is any of this a real error? | [veridelta.github.io/veridelta/cli/#exit-codes](https://veridelta.github.io/veridelta/cli/#exit-codes) |
| 0:24.2 to 0:35.3 | how-it-decides | A card in the logo's colors with the three steps of a comparison. | 0:24.2 Rules say which differences are expected, column by column.<br>0:29.0 Veridelta cleans each side by those rules, then reports whatever they do not explain. | [veridelta.github.io/veridelta/rules/#transform-order](https://veridelta.github.io/veridelta/rules/#transform-order) |
| 0:35.3 to 0:48.3 | accounts-suggest | A configuration with no rules, then `veridelta suggest`, which proposes three rules with their evidence. | 0:35.3 Sam does not have to guess the rules.<br>0:38.4 veridelta suggest tries each kind of rule on the columns that differ.<br>0:42.8 It proposes three, each with the rows it explains, and calls no model. | [veridelta.github.io/veridelta/cli/#suggesting-rules](https://veridelta.github.io/veridelta/cli/#suggesting-rules) |
| 0:48.3 to 0:58.1 | accounts-rules | The configuration with all four rules, then its run: 95.0%, 1 removed, 1 changed. | 0:48.3 Sam adds a map from the old status words to the new letters. The rules live in one file.<br>0:54.7 Now only two rows differ. | [veridelta.github.io/veridelta/rules/](https://veridelta.github.io/veridelta/rules/) |
| 0:58.1 to 1:11.3 | rule-limits | A card in the logo's colors with what rules can and cannot do. | 0:58.1 Rules forgive rounding, case, empty markers, renamed codes, dates, and types.<br>1:05.0 They cannot do arithmetic, like rounding to a multiple of seven, or compare two columns. | [veridelta.github.io/veridelta/rules/#what-rules-cannot-do](https://veridelta.github.io/veridelta/rules/#what-rules-cannot-do) |
| 1:11.3 to 1:24.4 | accounts-baseline | A baseline that accepts the removed account, then the run against it: 1 accepted, 1 changed, and exit code 1. | 1:11.3 Account 40 was closed on purpose, so a baseline file accepts it.<br>1:16.8 The run accepts it, and one row still differs.<br>1:20.4 So CI holds the rewrite until that row is fixed. | [veridelta.github.io/veridelta/cli/#accepting-drift](https://veridelta.github.io/veridelta/cli/#accepting-drift) |
| 1:24.4 to 1:34.3 | accounts-report | The HTML report of the baseline run: account 17, south in the legacy file and east in the rewrite. | 1:24.4 The report shows that row side by side. Account 17 moved from south to east.<br>1:30.7 That is the real error, out of 40 differences. | [veridelta.github.io/veridelta/results/#html-report](https://veridelta.github.io/veridelta/results/#html-report) |
| 1:34.3 to 1:45.1 | where-it-runs | Draft placeholder: the GitHub Action's comment on a real pull request, once that pull request exists. | 1:34.3 Sam runs Veridelta in the terminal while writing the rules.<br>1:38.5 Then the GitHub Action runs the same check on every pull request, and comments the result. | [veridelta.github.io/veridelta/ci/](https://veridelta.github.io/veridelta/ci/) |
| 1:45.1 to 1:52.5 | elsewhere | A card in the logo's colors with the other places a comparison runs. | 1:45.1 Agents can call the same checks through MCP, and warehouse tables are compared where they are stored. | [veridelta.github.io/veridelta/](https://veridelta.github.io/veridelta/) |
| 1:52.5 to 1:58.9 | status | A card in the logo's colors that says where the project stands. | 1:52.5 Veridelta is early, and tested on generated data.<br>1:56.7 Feedback is welcome. | [veridelta.github.io/veridelta/#status](https://veridelta.github.io/veridelta/#status) |
| 1:58.9 to 2:05.6 | demo-install | The wordmark, the install command, the docs and repository addresses, and the music's credit. | 1:58.9 Try it with pip install veridelta. | [veridelta.github.io/veridelta/#install](https://veridelta.github.io/veridelta/#install) |
