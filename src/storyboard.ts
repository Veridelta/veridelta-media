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
  | {
      kind: "screenshot";
      image: string;
      label: string;
      /** The frame's width in pixels, when narrower than the full width suits a tall image. */
      width?: number;
      /** Seconds from the scene's start when the picture scrolls to its bottom, in place of a slow push. */
      scrollAt?: number;
    }
  | {
      kind: "card";
      heading: string;
      lines: string[];
      /** Seconds from the scene's start when each line appears; without them, all show at once. */
      shows?: number[];
    }
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

// The narrated demo. Each scene is a list of beats: a line the voice says, and what the
// picture does with it, such as typing a transcript's next command, underlining a line of its
// output, or showing a card's next line. The voice's measured lengths set every time, so a scene
// is as long as its lines, and its subtitles are those lines, word for word. A line never talks
// about output that is not on screen yet.

/** One line the voice says, and what the picture does with it. */
export type Beat = {
  say: string;
  /** The transcript's next step, whose command starts to type as the line starts. */
  type?: number;
  /** The transcript's next step, typed first; the line starts once its output shows. */
  run?: number;
  /** Output lines to underline, matched whole, which must be on screen as the line starts. */
  mark?: string[];
  /** A screenshot taller than its frame scrolls to its bottom as the line starts. */
  scroll?: boolean;
  /** The card's next line appears as the line starts. */
  reveal?: boolean;
};

/** Seconds before the first line, between two lines, and after the last. */
const LEAD = 0.6;
const GAP = 0.5;
const TAIL = 0.9;
/** Seconds a command's output stays on screen before the next line starts. */
const SETTLE = 1.2;
/** Seconds from a command's output to the line that talks about it. */
const AFTER = 0.4;

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
  const shows: number[] = [];
  let scrollAt: number | undefined;
  let at = LEAD;
  for (const beat of beats) {
    const where = `Scene ${scene.id}: "${beat.say}"`;
    const line = spoken(beat.say);
    const seconds = line?.seconds ?? estimate(beat.say);
    if (beat.type !== undefined && beat.run !== undefined) {
      throw new Error(`${where} both types and runs a step.`);
    }
    const step = beat.type ?? beat.run;
    // When the step's output shows, or when the line starts if it types nothing.
    let ran: number | undefined;
    if (step !== undefined) {
      if (step !== timing.starts.length || !steps[step]) {
        throw new Error(`${where} types step ${step}, but the next is ${timing.starts.length}.`);
      }
      timing.starts.push(at);
      ran = at + runSeconds(steps[step].command);
    }
    const from = beat.run !== undefined && ran !== undefined ? ran + AFTER : at;
    if (beat.mark?.length && ran !== undefined && ran > from) {
      throw new Error(`${where} marks output before it shows; run the step instead of typing it.`);
    }
    timing.marks.push(...(beat.mark ?? []).map((text) => ({ text, at: ran ?? from })));
    if (beat.scroll) {
      if (picture.kind !== "screenshot") {
        throw new Error(`${where} scrolls, but only a screenshot scrolls.`);
      }
      scrollAt = from;
    }
    if (beat.reveal) {
      if (picture.kind !== "card" || shows.length >= picture.lines.length) {
        throw new Error(`${where} shows a card line that is not there.`);
      }
      shows.push(from);
    }
    voice.push({ text: beat.say, file: line?.file, at: from, seconds });
    at = Math.max(from + seconds, ran === undefined ? 0 : ran + SETTLE) + GAP;
  }
  if (picture.kind === "card" && shows.length > 0 && shows.length !== picture.lines.length) {
    throw new Error(`Scene ${scene.id} shows ${shows.length} of its card's ${picture.lines.length} lines.`);
  }
  const seconds = at - GAP + TAIL + hold;
  const captions = voice.map(({ text, at: from }, index) => ({
    text,
    from: index === 0 ? 0 : from,
    to: index + 1 < voice.length ? voice[index + 1].at : seconds,
  }));
  return {
    ...scene,
    picture:
      picture.kind === "terminal"
        ? { ...picture, timing }
        : picture.kind === "screenshot" && scrollAt !== undefined
          ? { ...picture, scrollAt }
          : picture.kind === "card" && shows.length > 0
            ? { ...picture, shows }
            : picture,
    seconds,
    captions,
    voice,
  };
};

const demo: Scene[] = [
  narrate({
    id: "sam",
    description: "A card in the logo's colors that introduces Sam, the nightly export, and the rewrite he has to check.",
    picture: {
      kind: "card",
      heading: "Meet Sam",
      lines: [
        "Sam looks after the data jobs at a small company.",
        "Every night, an old job exports 40 accounts to a CSV file.",
        "Sam rewrote it. Before switching, the new export has to match.",
      ],
    },
    beats: [
      { say: "This is Sam. He looks after the data jobs at a small company.", reveal: true },
      { say: "Every night, an old job exports the company's 40 customer accounts to a CSV file.", reveal: true },
      {
        say: "Sam has rewritten that job. Before he switches over, he has to show the new export matches the old one.",
        reveal: true,
      },
    ],
    backedBy: `${DOCS}how-to/from-drift-to-rules/`,
  }),
  narrate({
    id: "accounts-data",
    description: "The first six lines of each CSV file, from the legacy job and its rewrite, with two rows of the rewrite underlined.",
    picture: { kind: "terminal", transcript: "accounts-data", label: "1 · Two exports" },
    beats: [
      { say: "This is the old export. Each account has a region, a status, a balance, and a note.", type: 0 },
      {
        say: "They do not look the same. Regions are in capitals, and statuses are single letters.",
        run: 1,
        mark: ["1,SOUTH,P,112.5,renewal 2027", "2,EAST,C,125.0,renewal 2028"],
      },
    ],
    backedBy: `${DOCS}how-to/from-drift-to-rules/`,
  }),
  narrate({
    id: "accounts-run",
    description: "`veridelta run` on the two files and `--key account_id`: FAILED, 39 changed, 1 removed, and exit code 1.",
    picture: { kind: "terminal", transcript: "accounts-run", label: "2 · The first run" },
    beats: [
      { say: "So Sam runs Veridelta on the two files, pairing the rows by account ID.", type: 0 },
      { say: "39 accounts differ, and one is missing from the rewrite.", mark: ["Changed:       39", "Removed:       1"] },
      { say: "The exit code is 1, so in CI, this run would fail.", run: 1, mark: ["exit code: 1"] },
      { say: "But which of these differences are real errors?" },
    ],
    backedBy: `${DOCS}cli/#exit-codes`,
  }),
  narrate({
    id: "how-it-decides",
    description: "A card in the logo's colors with the three steps of a comparison, each shown as the voice names it.",
    picture: {
      kind: "card",
      heading: "How Veridelta decides",
      lines: [
        "1. Pair the rows by their primary key.",
        "2. Clean each column by the rules you declare.",
        "3. Compare, and report every difference no rule explains.",
      ],
    },
    beats: [
      { say: "Veridelta pairs each row with its match, by the key.", reveal: true },
      { say: "Rules tell it which differences Sam expects, column by column.", reveal: true },
      { say: "Whatever the rules do not explain is reported. Nothing is hidden.", reveal: true },
    ],
    backedBy: `${DOCS}rules/#transform-order`,
  }),
  narrate({
    id: "accounts-suggest",
    description: "A configuration with no rules, then `veridelta suggest`, which proposes three rules with their evidence.",
    picture: { kind: "terminal", transcript: "accounts-suggest", label: "3 · suggest" },
    beats: [
      { say: "Sam starts from a configuration with no rules at all.", type: 0 },
      { say: "veridelta suggest tries each kind of rule on the columns that differ, without calling a model.", type: 1 },
      {
        say: "It finds three, each with the rows it explains: letter case in region, rounding in balance, and N/A as an empty note.",
        mark: [
          "region: case_insensitive true explains 38 of 39 differing rows",
          "balance: absolute_tolerance 0.005 explains 13 of 13 differing rows, the largest gap 0.004",
          'note: null_values ["N/A"] explains 7 of 7 differing rows',
        ],
      },
    ],
    backedBy: `${DOCS}cli/#suggesting-rules`,
  }),
  narrate({
    id: "accounts-rules",
    description: "The configuration with all four rules, its status map underlined, then its run: 95.0%, 1 removed, 1 changed.",
    picture: { kind: "terminal", transcript: "accounts-rules", label: "4 · Four rules" },
    beats: [
      {
        say: "Sam keeps all three, and adds one suggest could not guess: the old status words, mapped to the new letters.",
        run: 0,
        mark: ["    value_map:", "      active: A", "      closed: C", "      paused: P"],
      },
      { say: "Now only two accounts differ.", run: 1, mark: ["Removed:       1", "Changed:       1"] },
    ],
    backedBy: `${DOCS}rules/`,
  }),
  narrate({
    id: "rule-limits",
    description: "A card in the logo's colors with what rules can and cannot do, each line shown as the voice says it.",
    picture: {
      kind: "card",
      heading: "What rules can and cannot do",
      lines: [
        "They can forgive rounding, case, spacing, empty markers, renamed codes, text patterns, dates, and types.",
        "They cannot do arithmetic, such as rounding to a multiple of 7.",
        "They cannot compare two columns. Rows pair only by their key.",
      ],
    },
    beats: [
      { say: "Rules can forgive rounding, case, empty markers, renamed codes, dates, and types.", reveal: true },
      { say: "They cannot do arithmetic, like rounding to a multiple of seven.", reveal: true },
      { say: "And they cannot compare two columns. Rows pair only by their key.", reveal: true },
    ],
    backedBy: `${DOCS}rules/#what-rules-cannot-do`,
  }),
  narrate({
    id: "accounts-baseline",
    description: "A baseline that accepts the removed account, then the run against it: 1 accepted, 1 changed, and exit code 1.",
    picture: { kind: "terminal", transcript: "accounts-baseline", label: "5 · A baseline" },
    beats: [
      {
        say: "The missing account, number 40, was closed on purpose. Sam writes that down in a baseline file.",
        run: 0,
        mark: ['      "account_id": 40'],
      },
      { say: "Veridelta accepts the closed account. One account still differs.", run: 1, mark: ["Accepted:      1", "Changed:       1"] },
      { say: "So the run still fails.", run: 2, mark: ["exit code: 1"] },
    ],
    backedBy: `${DOCS}cli/#accepting-drift`,
  }),
  narrate({
    id: "accounts-report",
    description: "The HTML report of the baseline run: account 17, south in the legacy file and east in the rewrite.",
    picture: { kind: "screenshot", image: "promo-report", label: "6 · The HTML report" },
    beats: [
      { say: "The report shows that row side by side. Account 17 is in the south in the old export, and in the east in the rewrite." },
      { say: "That is the real bug, one among 40 differences." },
    ],
    backedBy: `${DOCS}results/#html-report`,
  }),
  narrate({
    id: "where-it-runs",
    description:
      "The GitHub Action's comment on a pull request that compares the same files with the same rules and baseline: FAILED, 1 accepted, and account 17's region, south to east.",
    picture: { kind: "screenshot", image: "action-comment", label: "7 · The pull request", width: 1400 },
    beats: [
      { say: "On every pull request, the GitHub Action runs the same check and comments the result." },
      { say: "Until account 17 is fixed, the check fails, so the bug cannot ship.", scroll: true },
    ],
    backedBy: `${DOCS}ci/`,
  }),
  narrate({
    id: "accounts-fixed",
    description: "The same run on the fixed export, with account 17's region corrected: PASSED, 1 accepted, and exit code 0.",
    picture: { kind: "terminal", transcript: "accounts-fixed", label: "8 · The fix" },
    beats: [
      { say: "Sam fixes the region in his rewrite and runs the check on the new export.", type: 0 },
      { say: "It passes.", mark: ["Status:        PASSED (Perfect Match)"] },
      { say: "The exit code is 0. Sam can switch off the old job.", run: 1, mark: ["exit code: 0"] },
    ],
    backedBy: `${DOCS}cli/#accepting-drift`,
  }),
  narrate({
    id: "elsewhere",
    description: "A card in the logo's colors with the other places a comparison runs, each shown as the voice names it.",
    picture: {
      kind: "card",
      heading: "Elsewhere",
      lines: [
        "Agents call the same checks as MCP tools.",
        "Tables in Snowflake, Databricks, or BigQuery are compared where they are stored.",
      ],
    },
    beats: [
      { say: "AI agents can run the same check through MCP.", reveal: true },
      { say: "And warehouse tables are compared where they are stored.", reveal: true },
    ],
    backedBy: DOCS,
  }),
  narrate({
    id: "status",
    description: "A card in the logo's colors that says where the project stands.",
    picture: {
      kind: "card",
      heading: "Where it stands",
      lines: ["Alpha, tested on generated data, with drift seeded on purpose.", "Not yet run by other users, or in a live cloud warehouse."],
    },
    beats: [
      { say: "Veridelta is early, and tested on generated data." },
      { say: "Feedback is welcome." },
    ],
    backedBy: `${DOCS}#status`,
  }),
  narrate({
    id: "demo-install",
    description: "The wordmark, the install command, the docs and repository addresses, and the music's credit.",
    picture: { kind: "install", repository: true },
    beats: [{ say: "Try it with pip install veridelta." }],
    hold: 2,
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
    title: "About three minutes, 1920 by 1080, narrated, on CSV files",
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
