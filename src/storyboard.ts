// Every cut, scene by scene: what it shows, how long, its captions, and the docs page that
// backs each claim. The compositions, the SRT files, and storyboard.md all come from here.
import { clip } from "./clips";

export const FPS = 30;

const DOCS = "https://veridelta.github.io/veridelta/";

/** PyPI's summary, word for word. */
export const SENTENCE =
  "Compare two datasets on their primary keys under rules you declare, on a laptop, in CI, or inside a warehouse.";

export type Picture =
  | { kind: "title" }
  | { kind: "clip"; clip: string }
  | { kind: "image"; image: string }
  | { kind: "card"; heading: string; lines: string[] }
  | { kind: "install" };

/** A caption, timed in seconds from the start of its scene. */
export type Caption = { from: number; to: number; text: string };

export type Scene = {
  id: string;
  /** What the picture is, in words, for the storyboard. */
  description: string;
  picture: Picture;
  seconds: number;
  captions: Caption[];
  /** The docs page that backs every claim the scene makes. */
  backedBy: string;
};

export type Cut = { id: string; title: string; width: number; height: number; scenes: Scene[] };

const title = (seconds: number): Scene => ({
  id: "title",
  description: "The logo, then PyPI's one-line summary.",
  picture: { kind: "title" },
  seconds,
  captions: [{ from: 0, to: seconds, text: SENTENCE }],
  backedBy: DOCS,
});

// The quick start, recorded for video in a large font, in two clips. The caption times
// follow the tapes: the configuration shows at 1 second and the first file by 4.25; the
// summary shows at 1.75 seconds and the exit code at 6.75. No caption names what is not
// on screen yet.
const data: Scene = (() => {
  const seconds = clip("promo-data").seconds;
  return {
    id: "data",
    description:
      "The quick start's files, recorded whole for video: a five-line configuration and two three-row CSV files.",
    picture: { kind: "clip", clip: "promo-data" },
    seconds,
    captions: [
      { from: 0, to: 4.25, text: "The smallest configuration names a source, a target, and the primary key, id." },
      { from: 4.25, to: seconds, text: "Two exports that should match, with three rows each." },
    ],
    backedBy: `${DOCS}configuration/`,
  };
})();

const run: Scene = (() => {
  const seconds = clip("promo-run").seconds;
  return {
    id: "run",
    description: "The quick start's run, recorded whole for video: `veridelta run -q`, its summary, and the exit code.",
    picture: { kind: "clip", clip: "promo-run" },
    seconds,
    captions: [
      { from: 0, to: 6.75, text: "veridelta run compares them: 1 row added, 1 removed, and 1 changed." },
      { from: 6.75, to: seconds, text: "The exit code, 1, tells CI that the datasets differ." },
    ],
    backedBy: `${DOCS}cli/#exit-codes`,
  };
})();

const report: Scene = {
  id: "report",
  description: "The top of the HTML report from the docs, a comparison of 120 orders.",
  picture: { kind: "image", image: "report-light" },
  seconds: 7,
  captions: [
    {
      from: 0,
      to: 7,
      text: "veridelta run --html writes a standalone report that opens offline, with changed rows side by side.",
    },
  ],
  backedBy: `${DOCS}results/#html-report`,
};

const warehouse: Scene = {
  id: "warehouse",
  description: "A card in the logo's colors, with two sentences from the README.",
  picture: {
    kind: "card",
    heading: "Inside the warehouse",
    lines: [
      "Two tables in Snowflake, Databricks, or BigQuery are compared where they are stored.",
      "The rules compile to SQL, and only counts and keys come back.",
    ],
  },
  seconds: 6,
  captions: [
    {
      from: 0,
      to: 6,
      text: "Two tables in Snowflake, Databricks, or BigQuery are compared where they are stored. Only counts and keys come back.",
    },
  ],
  backedBy: `${DOCS}pushdown/`,
};

// The MCP client, recorded for video in a large font. The calls and answers show at 7
// seconds, once the script has started the server.
const mcp: Scene = (() => {
  const seconds = clip("promo-mcp").seconds;
  return {
    id: "mcp",
    description:
      "The MCP client, recorded whole for video: a script calls `validate_config`, `run_comparison`, and `read_discrepancies`, and prints each answer, one field to a line.",
    picture: { kind: "clip", clip: "promo-mcp" },
    seconds,
    captions: [
      { from: 0, to: 7, text: "veridelta mcp serves the same checks as MCP tools, so an agent's host can call them without a shell." },
      { from: 7, to: seconds, text: "Here a script calls the tools, as an agent's host does." },
    ],
    backedBy: `${DOCS}agents/#mcp-server`,
  };
})();

const install = (seconds: number): Scene => ({
  id: "install",
  description: "The wordmark, the install command, and the docs address.",
  picture: { kind: "install" },
  seconds,
  captions: [{ from: 0, to: seconds, text: "pip install veridelta. The docs are at veridelta.github.io/veridelta." }],
  backedBy: `${DOCS}#install`,
});

export const cuts: Cut[] = [
  {
    id: "promo-30",
    title: "30 seconds, 1920 by 1080",
    width: 1920,
    height: 1080,
    scenes: [title(3), data, run, install(4)],
  },
  {
    id: "promo-60",
    title: "60 seconds, 1920 by 1080",
    width: 1920,
    height: 1080,
    scenes: [title(3), data, run, report, warehouse, mcp, install(4)],
  },
  {
    id: "promo-square-30",
    title: "30 seconds, 1080 by 1080, for social feeds",
    width: 1080,
    height: 1080,
    scenes: [title(3), data, run, install(4)],
  },
];

export const findCut = (id: string) => {
  const cut = cuts.find((entry) => entry.id === id);
  if (!cut) {
    throw new Error(`No cut named ${id}.`);
  }
  return cut;
};

/** Each scene's first frame and length in frames, back to back. */
export const timeline = (cut: Cut) => {
  let start = 0;
  return cut.scenes.map((scene) => {
    // A clip's last partial frame is dropped, never padded, so no frame is invented.
    const frames = Math.floor(scene.seconds * FPS);
    const entry = { scene, start, frames };
    start += frames;
    return entry;
  });
};

export const cutFrames = (cut: Cut) =>
  timeline(cut).reduce((total, { frames }) => total + frames, 0);
