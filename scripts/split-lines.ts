// Splits one take of many spoken lines into a clip per line. The voice reads a whole cut in
// one request, so every line has the same tone and level; scripts/align.py hears the take and
// says where each line's words start and end, and this cuts in the silence between one line's
// last word and the next line's first. It refuses a split it cannot trust, so a line's clip
// never carries another line's words.
import { execFileSync, spawnSync } from "node:child_process";

/** Pauses quieter than this, and at least this long, count as a pause. */
const NOISE = "-38dB";
const SHORTEST = 0.08;
/** The share of a line's words the take must hold, so a garbled or skipped line is refused. */
const HEARD = 0.8;

type Pause = { start: number; end: number; length: number };

/** Where scripts/align.py heard a line: its first word's start, its last word's end, and the share of its words heard. */
export type Span = { start: number | null; end: number | null; heard: number };

export const duration = (file: string) =>
  Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString());

/** Every pause inside the clip, not at its start or end. */
export const pauses = (wav: string): Pause[] => {
  const total = duration(wav);
  const log = spawnSync("ffmpeg", [
    "-hide_banner", "-nostats", "-i", wav, "-af", `silencedetect=noise=${NOISE}:d=${SHORTEST}`, "-f", "null", "-",
  ]).stderr.toString();
  const starts = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((match) => Number(match[1]));
  const ends = [...log.matchAll(/silence_end: ([\d.]+)/g)].map((match) => Number(match[1]));
  return starts
    .map((start, index) => ({ start, end: ends[index] ?? total, length: (ends[index] ?? total) - start }))
    .filter(({ start, end }) => start > 0.05 && end < total - 0.05);
};

/**
 * Where to cut a take of these lines, in seconds, or why it cannot be cut safely. Each cut sits
 * in the longest pause between one line's last word and the next line's first, or halfway
 * between them when the take holds no pause there.
 */
export const cuts = (wav: string, lines: string[], spans: Span[]): number[] | string => {
  if (spans.length !== lines.length) {
    return `heard ${spans.length} spans for ${lines.length} lines`;
  }
  const missing = spans.findIndex((span) => span.start === null || span.end === null || span.heard < HEARD);
  if (missing >= 0) {
    return `"${lines[missing].slice(0, 40)}..." is not all in the take, ${Math.round(spans[missing].heard * 100)}% of its words heard`;
  }
  const all = pauses(wav);
  const points: number[] = [];
  for (let index = 0; index + 1 < lines.length; index++) {
    const after = spans[index].end!;
    const before = spans[index + 1].start!;
    if (after > before + 0.05) {
      return `"${lines[index + 1].slice(0, 40)}..." starts before the line ahead of it ends`;
    }
    const between = all
      .map((pause) => ({ start: Math.max(pause.start, after), end: Math.min(pause.end, before) }))
      .filter((pause) => pause.end > pause.start)
      .sort((a, b) => b.end - b.start - (a.end - a.start));
    points.push(between.length > 0 ? (between[0].start + between[0].end) / 2 : (after + before) / 2);
  }
  return points;
};

/** Write the part of a clip between two moments to a file. */
export const cut = (wav: string, from: number, to: number, out: string) => {
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", wav, "-ss", `${from}`, "-to", `${to}`, out]);
};
