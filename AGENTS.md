# Agent instructions

The rules for coding agents that change this repository. [README.md](README.md) has the commands and the reasons.

- Work on a branch from `main`, and merge through a pull request whose CI passes.
- Write commit messages and pull request titles as [Conventional Commits](https://www.conventionalcommits.org/), such as `feat: add a crosswalk scene`.
- Change scenes, captions, and lengths only in `src/storyboard.ts`, then run `npm run generate`. Never edit `captions/`, `storyboard.md`, or `public/clips/` by hand.
- Follow the rules in [README.md](README.md#the-rules): a recording plays whole, every number on screen comes from its run, and no caption claims more than the docs page its scene names.
- Before a pull request, run `npm run typecheck`, `npm run check`, and `npm run generate`, and leave no change in the generated files.
- Keep the Remotion packages on one exact version. They move together.
- Follow Veridelta's [writing rules](https://github.com/Veridelta/veridelta/blob/main/CONTRIBUTING.md#writing-documentation) in captions, posts, and docs: sentence case, short sentences, and no marketing words.
