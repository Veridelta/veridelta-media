#!/usr/bin/env bash
# Copies the transcripts of Veridelta's accounts tapes at one Veridelta commit into
# public/transcripts/, with the HTML report of the run the last tape types and the CI guide's
# screenshot of the GitHub Action's pull request comment. The demo cut sets each transcript in
# type, so every terminal line it shows traces to a tape at that commit.
# Before copying, it runs Veridelta's tape test there, which holds each transcript to what the
# CLI prints.
#
# Usage: scripts/fetch-transcripts.sh ee04c6d
#
# As with scripts/fetch-clips.sh, a commit after a release works too, but only while its
# src/, pyproject.toml, and uv.lock match the last release tag.
#
# It needs uv, and Chromium for Playwright: set PLAYWRIGHT_BROWSERS_PATH to where it is, or
# run `uv run --group accessibility playwright install chromium` in a Veridelta checkout once.
set -euo pipefail

ref="${1:?Name the Veridelta release or commit to read, such as ee04c6d.}"
root="$(cd "$(dirname "$0")/.." && pwd)"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
checkout="$work/veridelta"

git clone --quiet --filter=blob:none --no-checkout https://github.com/Veridelta/veridelta "$checkout"
git -C "$checkout" -c advice.detachedHead=false checkout --quiet "$ref"
release="$(git -C "$checkout" describe --tags --abbrev=0 --match 'v*' HEAD)"
if ! git -C "$checkout" diff --quiet "$release" HEAD -- src pyproject.toml uv.lock; then
  echo "The package at $ref differs from $release. Read a release, or a commit whose src/, pyproject.toml, and uv.lock match one." >&2
  exit 1
fi

(
  cd "$checkout"
  uv sync --locked --all-extras --quiet
  uv run --locked pytest tests/unit/test_demo_tape.py --quiet --no-cov -p no:cacheprovider
  uv run --locked --group accessibility python demo/screenshots.py --promo
)

rm -rf "$root/public/transcripts"
mkdir -p "$root/public/transcripts"
cp "$checkout"/demo/promo/accounts-*.txt "$root/public/transcripts/"
cp "$checkout/demo/video/promo-report.png" "$root/public/transcripts/"
cp "$checkout/docs/assets/action-comment-light.png" "$root/public/transcripts/action-comment.png"
(cd "$root" && npx tsx scripts/transcripts.ts "$checkout" "$release")
