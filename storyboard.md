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

115.6 seconds, with subtitles in `captions/demo-120.srt`.

| Time | Scene | Picture | Captions | Backed by |
| :--- | :--- | :--- | :--- | :--- |
| 0:00.0 to 0:08.9 | demo-title | The logo, then PyPI's one-line summary. | 0:00.0 Veridelta compares two datasets on their primary keys.<br>0:04.4 It reports every row that differs, under rules you declare. | [veridelta.github.io/veridelta/](https://veridelta.github.io/veridelta/) |
| 0:08.9 to 0:16.9 | accounts-data | The first six lines of each CSV file, before and after the rewrite. | 0:08.9 Here are 40 accounts, exported before and after a rewrite.<br>0:13.7 Did the rewrite keep the data the same? | [veridelta.github.io/veridelta/how-to/from-drift-to-rules/](https://veridelta.github.io/veridelta/how-to/from-drift-to-rules/) |
| 0:16.9 to 0:30.4 | accounts-run | `veridelta run` on the two files and `--key account_id`: FAILED, 39 changed, 1 removed, and exit code 1. | 0:16.9 One command compares them on the account ID, with no configuration file.<br>0:22.6 39 rows changed, and 1 row is gone.<br>0:26.1 The exit code is 1, so a CI job would fail. | [veridelta.github.io/veridelta/cli/#exit-codes](https://veridelta.github.io/veridelta/cli/#exit-codes) |
| 0:30.4 to 0:50.5 | accounts-suggest | A configuration with no rules, then `veridelta suggest`, which proposes three rules with their evidence. | 0:30.4 This file names the two exports and the key, with no rules yet.<br>0:35.4 veridelta suggest tries each kind of rule on the columns that differ.<br>0:39.8 It proposes a rule for letter case, rounding, and missing notes, each with its evidence.<br>0:45.8 No model is called. Each rule is one you could write by hand. | [veridelta.github.io/veridelta/cli/#suggesting-rules](https://veridelta.github.io/veridelta/cli/#suggesting-rules) |
| 0:50.5 to 1:00.6 | accounts-crosswalk | `veridelta crosswalk` with the three suggested rules: a value map from each status to its letter, 13 of 13 rows each. | 0:50.5 The status codes changed too, from words to letters.<br>0:54.9 crosswalk lines up the values and proposes a map, with how many rows agree. | [veridelta.github.io/veridelta/rules/#proposing-a-value-map](https://veridelta.github.io/veridelta/rules/#proposing-a-value-map) |
| 1:00.6 to 1:10.7 | accounts-rules | The configuration with all four rules, then its run: 95.0%, 1 removed, 1 changed. | 1:00.6 The configuration now declares all four rules.<br>1:04.4 Two rows still differ.<br>1:07.2 Nothing is forgiven unless a rule says so. | [veridelta.github.io/veridelta/rules/](https://veridelta.github.io/veridelta/rules/) |
| 1:10.7 to 1:24.4 | accounts-baseline | A baseline that accepts the removed account, then the run against it: 1 accepted, 1 changed, and exit code 1. | 1:10.7 Account 40 was removed on purpose, so a baseline file accepts that change.<br>1:16.8 The run accepts it, and still fails on the other row.<br>1:20.4 So CI holds the rewrite until that row is fixed. | [veridelta.github.io/veridelta/cli/#accepting-drift](https://veridelta.github.io/veridelta/cli/#accepting-drift) |
| 1:24.4 to 1:33.7 | accounts-report | The HTML report of the baseline run: account 17, south in the legacy file and east in the rewrite. | 1:24.4 The HTML report shows that row side by side.<br>1:28.5 Account 17 moved from south to east. That is the real defect. | [veridelta.github.io/veridelta/results/#html-report](https://veridelta.github.io/veridelta/results/#html-report) |
| 1:33.7 to 1:48.9 | status | A card in the logo's colors that says where the project stands. | 1:33.7 Veridelta is early, at version 0.33.<br>1:38.0 It is tested on generated data, with drift seeded on purpose.<br>1:42.2 It has not yet been run by other users, or in a live cloud warehouse.<br>1:46.7 Feedback is welcome. | [veridelta.github.io/veridelta/#status](https://veridelta.github.io/veridelta/#status) |
| 1:48.9 to 1:55.6 | demo-install | The wordmark, the install command, the docs and repository addresses, and the music's credit. | 1:48.9 Try it with pip install veridelta. | [veridelta.github.io/veridelta/#install](https://veridelta.github.io/veridelta/#install) |
