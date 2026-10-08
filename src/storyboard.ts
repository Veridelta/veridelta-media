// Every cut, scene by scene: what it shows, how long, its captions, and the docs page that
// backs each claim. The compositions, the SRT files, and storyboard.md all come from here.
import { clip } from "./clips";
import { runSeconds, type TerminalTiming } from "./terminal";
import { transcript } from "./transcripts";
import { estimate, spoken } from "./voice";

export const FPS = 30;

const DOCS = "https://veridelta.github.io/veridelta/";

/** PyPI's summary, word for word. */
export const SENTENCE =
  "Compare two datasets on their primary keys under rules you declare, on a laptop, in CI, or inside a warehouse.";

/** A transcript of one of Veridelta's tapes, set in type, and when its commands start. */
export type TerminalPicture = { kind: "terminal"; transcript: string; label: string; timing: TerminalTiming };

export type Picture =
  | { kind: "title" }
  | { kind: "clip"; clip: string }
  | { kind: "image"; image: string }
  | TerminalPicture
  | { kind: "screenshot"; image: string; label: string }
  | { kind: "card"; heading: string; lines: string[] }
  | { kind: "install"; repository?: boolean };

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
  /** In a narrated cut, each line the voice says: its file, and when, from the scene's start. */
  voice?: { text: string; file?: string; at: number; seconds: number }[];
};

export type Cut = {
  id: string;
  title: string;
  width: number;
  height: number;
  scenes: Scene[];
  /**
   * A cut with a voice shows each line as a subtitle, and plays music under it when the file is
   * in public/, which git ignores, with its credit on the last scene.
   */
  narrated?: { music: { file: string; credit: string } };
};

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

// The two-minute demo, narrated. Each scene is a list of beats: a line the voice says, and
// what the picture does as the line starts, such as typing a transcript's next command or
// underlining a line of its output. The voice's measured lengths set every time, so a scene
// is as long as its lines, and its subtitles are those lines, word for word.

/** One line the voice says, and what the picture does as it starts. */
export type Beat = {
  say: string;
  /** The transcript's next step, whose command starts to type as the line starts. */
  type?: number;
  /** Output lines to underline, matched whole, once the line starts and any command has run. */
  mark?: string[];
};

/** Seconds before the first line, between two lines, and after the last. */
const LEAD = 0.6;
const GAP = 0.45;
const TAIL = 1;
/** Seconds a command's output stays on screen before the next line starts. */
const SETTLE = 0.9;

type Narrated = Omit<Scene, "seconds" | "captions" | "voice" | "picture"> & {
  picture: Exclude<Picture, TerminalPicture> | Omit<TerminalPicture, "timing">;
  beats: Beat[];
  /** Seconds the picture stays after its last line, past the usual pause, to be read. */
  hold?: number;
};

const narrate = ({ beats, picture, hold = 0, ...scene }: Narrated): Scene => {
  const timing: TerminalTiming = { starts: [], marks: [] };
  const steps = picture.kind === "terminal" ? transcript(picture.transcript).steps : [];
  const voice: NonNullable<Scene["voice"]> = [];
  let at = LEAD;
  for (const beat of beats) {
    const line = spoken(beat.say);
    const seconds = line?.seconds ?? estimate(beat.say);
    let busy = seconds;
    let ran = at;
    if (beat.type !== undefined) {
      if (beat.type !== timing.starts.length || !steps[beat.type]) {
        throw new Error(`Scene ${scene.id}: "${beat.say}" types step ${beat.type}, but the next is ${timing.starts.length}.`);
      }
      timing.starts.push(at);
      ran = at + runSeconds(steps[beat.type].command);
      busy = Math.max(busy, ran - at + SETTLE);
    }
    timing.marks.push(...(beat.mark ?? []).map((text) => ({ text, at: ran })));
    voice.push({ text: beat.say, file: line?.file, at, seconds });
    at += busy + GAP;
  }
  const seconds = at - GAP + TAIL + hold;
  const captions = voice.map(({ text, at: from }, index) => ({
    text,
    from: index === 0 ? 0 : from,
    to: index + 1 < voice.length ? voice[index + 1].at : seconds,
  }));
  return {
    ...scene,
    picture: picture.kind === "terminal" ? { ...picture, timing } : picture,
    seconds,
    captions,
    voice,
  };
};

const demo: Scene[] = [
  narrate({
    id: "demo-title",
    description: "The logo, then PyPI's one-line summary.",
    picture: { kind: "title" },
    beats: [
      { say: "Veridelta compares two datasets on their primary keys." },
      { say: "It reports every row that differs, under rules you declare." },
    ],
    backedBy: DOCS,
  }),
  narrate({
    id: "accounts-data",
    description: "The first six lines of each CSV file, before and after the rewrite.",
    picture: { kind: "terminal", transcript: "accounts-data", label: "1 · The two files" },
    beats: [
      { say: "Here are 40 accounts, exported before and after a rewrite.", type: 0 },
      { say: "Did the rewrite keep the data the same?", type: 1 },
    ],
    backedBy: `${DOCS}how-to/from-drift-to-rules/`,
  }),
  narrate({
    id: "accounts-run",
    description: "`veridelta run` on the two files and `--key account_id`: FAILED, 39 changed, 1 removed, and exit code 1.",
    picture: { kind: "terminal", transcript: "accounts-run", label: "2 · The first run" },
    beats: [
      { say: "One command compares them on the account ID, with no configuration file.", type: 0 },
      { say: "39 rows changed, and 1 row is gone.", mark: ["Changed:       39", "Removed:       1"] },
      { say: "The exit code is 1, so a CI job would fail.", type: 1, mark: ["exit code: 1"] },
    ],
    backedBy: `${DOCS}cli/#exit-codes`,
  }),
  narrate({
    id: "accounts-suggest",
    description: "A configuration with no rules, then `veridelta suggest`, which proposes three rules with their evidence.",
    picture: { kind: "terminal", transcript: "accounts-suggest", label: "3 · suggest" },
    beats: [
      { say: "This file names the two exports and the key, with no rules yet.", type: 0 },
      { say: "veridelta suggest tries each kind of rule on the columns that differ.", type: 1 },
      {
        say: "It proposes a rule for letter case, rounding, and missing notes, each with its evidence.",
        mark: [
          "region: case_insensitive true explains 38 of 39 differing rows",
          "balance: absolute_tolerance 0.005 explains 13 of 13 differing rows, the largest gap 0.004",
          'note: null_values ["N/A"] explains 7 of 7 differing rows',
        ],
      },
      { say: "No model is called. Each rule is one you could write by hand." },
    ],
    backedBy: `${DOCS}cli/#suggesting-rules`,
  }),
  narrate({
    id: "accounts-crosswalk",
    description: "`veridelta crosswalk` with the three suggested rules: a value map from each status to its letter, 13 of 13 rows each.",
    picture: { kind: "terminal", transcript: "accounts-crosswalk", label: "4 · crosswalk" },
    beats: [
      { say: "The status codes changed too, from words to letters.", type: 0 },
      {
        say: "crosswalk lines up the values and proposes a map, with how many rows agree.",
        mark: [
          "  'active' -> 'A': 13 of 13 rows (100.0%)",
          "  'closed' -> 'C': 13 of 13 rows (100.0%)",
          "  'paused' -> 'P': 13 of 13 rows (100.0%)",
        ],
      },
    ],
    backedBy: `${DOCS}rules/#proposing-a-value-map`,
  }),
  narrate({
    id: "accounts-rules",
    description: "The configuration with all four rules, then its run: 95.0%, 1 removed, 1 changed.",
    picture: { kind: "terminal", transcript: "accounts-rules", label: "5 · Four rules" },
    beats: [
      { say: "The configuration now declares all four rules.", type: 0 },
      { say: "Two rows still differ.", type: 1, mark: ["Removed:       1", "Changed:       1"] },
      { say: "Nothing is forgiven unless a rule says so." },
    ],
    backedBy: `${DOCS}rules/`,
  }),
  narrate({
    id: "accounts-baseline",
    description: "A baseline that accepts the removed account, then the run against it: 1 accepted, 1 changed, and exit code 1.",
    picture: { kind: "terminal", transcript: "accounts-baseline", label: "6 · A baseline" },
    beats: [
      { say: "Account 40 was removed on purpose, so a baseline file accepts that change.", type: 0 },
      { say: "The run accepts it, and still fails on the other row.", type: 1, mark: ["Accepted:      1", "Changed:       1"] },
      { say: "So CI holds the rewrite until that row is fixed.", type: 2, mark: ["exit code: 1"] },
    ],
    backedBy: `${DOCS}cli/#accepting-drift`,
  }),
  narrate({
    id: "accounts-report",
    description: "The HTML report of the baseline run: account 17, south in the legacy file and east in the rewrite.",
    picture: { kind: "screenshot", image: "promo-report", label: "7 · The HTML report" },
    beats: [
      { say: "The HTML report shows that row side by side." },
      { say: "Account 17 moved from south to east. That is the real defect." },
    ],
    backedBy: `${DOCS}results/#html-report`,
  }),
  narrate({
    id: "status",
    description: "A card in the logo's colors that says where the project stands.",
    picture: {
      kind: "card",
      heading: "Where it stands",
      lines: [
        "Alpha, at version 0.33.",
        "Tested on generated data, with drift seeded on purpose.",
        "Not yet run by other users, or in a live cloud warehouse.",
      ],
    },
    beats: [
      { say: "Veridelta is early, at version 0.33." },
      { say: "It is tested on generated data, with drift seeded on purpose." },
      { say: "It has not yet been run by other users, or in a live cloud warehouse." },
      { say: "Feedback is welcome." },
    ],
    backedBy: `${DOCS}#status`,
  }),
  narrate({
    id: "demo-install",
    description: "The wordmark, the install command, the docs and repository addresses, and the music's credit.",
    picture: { kind: "install", repository: true },
    beats: [{ say: "Try it with pip install veridelta." }],
    hold: 3,
    backedBy: `${DOCS}#install`,
  }),
];

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
  {
    id: "demo-120",
    title: "About two minutes, 1920 by 1080, narrated, on CSV files",
    width: 1920,
    height: 1080,
    scenes: demo,
    narrated: { music: { file: "music/bensound-hipjazz.mp3", credit: "Music: Bensound" } },
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
