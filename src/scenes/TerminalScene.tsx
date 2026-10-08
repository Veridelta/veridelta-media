// A transcript of one of Veridelta's tapes, set in type: each command is typed at a steady
// pace, its output shows at once as a terminal shows it, and the oldest lines scroll off the
// top. A mark underlines a line the voice talks about, and never changes its text. Below the
// terminal, a line names the tape and the commit, so a viewer can trace every line.
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ROWS, TYPING, runSeconds, type TerminalTiming } from "../terminal";
import { PROMPT, transcript, transcripts, type Step } from "../transcripts";
import { colors, mono, sans } from "../theme";

type Row = { text: string; kind: "prompt" | "output"; cursor?: boolean };

/** What the terminal shows at a moment: every row so far, the newest last. */
const rowsAt = (steps: Step[], starts: number[], seconds: number, blink: boolean): Row[] => {
  const rows: Row[] = [];
  let idle = true;
  starts.forEach((start, index) => {
    if (seconds < start) {
      return;
    }
    const { command, output } = steps[index];
    const typed = Math.min(command.length, Math.floor((seconds - start) * TYPING));
    if (seconds < start + runSeconds(command)) {
      rows.push({ text: command.slice(0, typed), kind: "prompt", cursor: blink });
      idle = false;
      return;
    }
    rows.push({ text: command, kind: "prompt" });
    rows.push(...output.map((text) => ({ text, kind: "output" as const })));
    idle = true;
  });
  if (idle) {
    // The shell's next prompt, waiting, as after every command.
    rows.push({ text: "", kind: "prompt", cursor: blink });
  }
  return rows;
};

export const TerminalScene = ({
  name,
  label,
  timing,
}: {
  name: string;
  label: string;
  timing: TerminalTiming;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;
  const { steps, tape } = transcript(name);
  // The cursor blinks twice a second.
  const blink = Math.floor(seconds * 2) % 2 === 0;
  const rows = rowsAt(steps, timing.starts, seconds, blink).slice(-ROWS);
  const markOf = (row: Row) => {
    const mark = row.kind === "output" ? timing.marks.find((entry) => entry.text === row.text) : undefined;
    return mark && seconds >= mark.at
      ? interpolate((seconds - mark.at) * fps, [0, 8], [0, 1], { extrapolateRight: "clamp" })
      : 0;
  };
  return (
    <AbsoluteFill style={{ alignItems: "center", padding: "40px 120px 0" }}>
      <div
        style={{
          width: "100%",
          height: 780,
          display: "flex",
          flexDirection: "column",
          borderRadius: 16,
          overflow: "hidden",
          background: colors.navy,
          boxShadow: "0 24px 64px rgba(13, 47, 90, 0.22)",
        }}
      >
        <div
          style={{
            height: 48,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            background: "rgba(0, 0, 0, 0.22)",
            fontFamily: sans,
            fontSize: 22,
          }}
        >
          <span style={{ color: colors.paper, fontWeight: 600, letterSpacing: 0.5 }}>{label}</span>
          <span style={{ color: "#9fb2c8" }}>{tape}</span>
        </div>
        <div
          style={{
            flex: 1,
            padding: "22px 40px",
            fontFamily: mono,
            fontSize: 26,
            lineHeight: "34px",
            whiteSpace: "pre",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          {rows.map((row, index) => {
            const mark = markOf(row);
            // The underline starts under the first character, past any indent.
            const indent = row.text.length - row.text.trimStart().length;
            return (
              <div
                key={index}
                style={{
                  height: 34,
                  color: row.kind === "prompt" ? colors.paper : "#d3dde9",
                  fontWeight: row.kind === "prompt" ? 700 : 400,
                  // The underline grows in from the left, in the logo's orange.
                  backgroundImage: `linear-gradient(${colors.orange}, ${colors.orange})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: `${indent}ch 31px`,
                  backgroundSize: `${mark * (row.text.length - indent)}ch 3px`,
                }}
              >
                {row.kind === "prompt" && <span style={{ color: "#f08a4b" }}>{PROMPT}</span>}
                {row.text}
                {row.cursor && <span style={{ background: colors.paper }}> </span>}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ marginTop: 14, fontSize: 21, color: colors.slate, fontFamily: sans }}>
        Set in type from the transcript of {tape}, Veridelta {transcripts.release} at commit{" "}
        {transcripts.commit.slice(0, 7)}
      </div>
    </AbsoluteFill>
  );
};
