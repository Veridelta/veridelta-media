// A heading and a few sentences in the logo's colors. In a narrated cut, each line can appear
// as the voice reaches it, so the card never runs ahead of what is said.
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";

/** Frames a line takes to fade in. */
const FADE = 10;

export const CardScene = ({
  heading,
  lines,
  square,
  shows,
}: {
  heading: string;
  lines: string[];
  square: boolean;
  shows?: number[];
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: square ? "80px 80px 94px" : "120px 200px 134px", gap: 40 }}>
      <div style={{ fontSize: square ? 30 : 34, fontWeight: 700, color: colors.orange, letterSpacing: 2, textTransform: "uppercase" }}>
        {heading}
      </div>
      {lines.map((line, index) => {
        const from = (shows?.[index] ?? 0) * fps;
        const shown = interpolate(frame, [from, from + FADE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div
            key={line}
            style={{
              fontSize: square ? 48 : 62,
              fontWeight: 600,
              lineHeight: 1.25,
              opacity: shown,
              transform: `translateY(${(1 - shown) * 12}px)`,
            }}
          >
            {line}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
