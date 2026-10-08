// A heading and a few sentences, quoted from the docs, in the logo's colors.
import { AbsoluteFill } from "remotion";
import { colors } from "../theme";

export const CardScene = ({ heading, lines, square }: { heading: string; lines: string[]; square: boolean }) => (
  <AbsoluteFill style={{ justifyContent: "center", padding: square ? "80px 80px 94px" : "120px 200px 134px", gap: 40 }}>
    <div style={{ fontSize: square ? 30 : 34, fontWeight: 700, color: colors.orange, letterSpacing: 2, textTransform: "uppercase" }}>
      {heading}
    </div>
    {lines.map((line) => (
      <div key={line} style={{ fontSize: square ? 48 : 62, fontWeight: 600, lineHeight: 1.25 }}>
        {line}
      </div>
    ))}
  </AbsoluteFill>
);
