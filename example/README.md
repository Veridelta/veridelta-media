# Action example

The files the demo video uses, checked by the [Veridelta GitHub Action](https://veridelta.github.io/veridelta/ci/) on a pull request.

- `accounts_legacy.csv` is the export from the legacy job, with 40 accounts. `accounts_rewrite.csv` is the export from its rewrite, and account 40 is gone from it.
- `veridelta.yaml` pairs the rows by `account_id` and holds four rules: letter case in `region`, a rounding tolerance on `balance`, "N/A" as null in `note`, and a map from the old status words to letters.
- `accepted.json` is a baseline. It accepts the removal of account 40, which was closed on purpose.

The workflow is `.github/workflows/action-example.yml`. It fails while account 17 moves from south to east, which no rule explains and the baseline does not accept.

The pull request that adds these files stays open as the example. Do not merge it.
