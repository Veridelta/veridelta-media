// Splits one clip of several spoken lines into a clip per line, at the pauses between them.
// The voice reads a scene's lines in one request, which sounds more even and spends fewer
// requests, and this cuts the clip where it paused longest. It refuses a split it cannot
// trust, so a line's clip never carries another line's words.
import { execFileSync, spawnSync } from "node:child_process";

/** Pauses quieter than this, and at least this long, count as a pause. */
const NOISE = "-38dB";
const SHORTEST = 0.18;

type Pause = { start: number; end: number; length: number };

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
 * Where to cut a clip of these lines, in seconds, or why it cannot be cut safely. The cuts sit
 * in the middle of the longest pauses, one fewer than the lines. A split is trusted only when
 * those pauses are clearly longer than every other, and each line's length matches its words.
 */
export const cuts = (wav: string, lines: string[]): number[] | string => {
  if (lines.length === 1) {
    return [];
  }
  const found = pauses(wav);
  const longest = [...found].sort((a, b) => b.length - a.length);
  const chosen = longest.slice(0, lines.length - 1);
  const rest = longest.slice(lines.length - 1);
  if (chosen.length < lines.length - 1) {
    return `found ${found.length} pauses for ${lines.length} lines`;
  }
  const shortestChosen = Math.min(...chosen.map((pause) => pause.length));
  if (shortestChosen < 0.25 || (rest.length > 0 && shortestChosen < 1.15 * rest[0].length)) {
    return "the pauses between lines are no longer than the pauses inside them";
  }
  const points = chosen.map((pause) => (pause.start + pause.end) / 2).sort((a, b) => a - b);
  const bounds = [0, ...points, duration(wav)];
  const pace = lines.map((line, index) => (bounds[index + 1] - bounds[index]) / line.length);
  const mean = pace.reduce((sum, value) => sum + value, 0) / pace.length;
  if (pace.some((value) => value < 0.6 * mean || value > 1.6 * mean)) {
    return "a line's length does not match its words";
  }
  return points;
};

/** Write the part of a clip between two moments to a file. */
export const cut = (wav: string, from: number, to: number, out: string) => {
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", wav, "-ss", `${from}`, "-to", `${to}`, out]);
};
