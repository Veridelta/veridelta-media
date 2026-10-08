// The HTML report of the run the last accounts tape types, in the terminal's frame, with a
// slow push toward the changed rows. Below it, a line says where the screenshot comes from.
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { screenshot, transcripts } from "../transcripts";
import { colors, sans } from "../theme";

export const ReportScene = ({ name, label, frames }: { name: string; label: string; frames: number }) => {
  const frame = useCurrentFrame();
  const image = screenshot(name);
  const scale = interpolate(frame, [0, frames], [1, 1.06], { extrapolateRight: "clamp" });
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
          background: colors.paper,
          border: `1px solid ${colors.rule}`,
          boxShadow: "0 24px 64px rgba(13, 47, 90, 0.18)",
        }}
      >
        <div
          style={{
            height: 48,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            padding: "0 28px",
            background: colors.navy,
            color: colors.paper,
            fontFamily: sans,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 0.5,
          }}
        >
          {label}
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <Img
            src={staticFile(`transcripts/${image.file}`)}
            style={{ width: "100%", transform: `scale(${scale})`, transformOrigin: "30% 62%" }}
          />
        </div>
      </div>
      <div style={{ marginTop: 14, fontSize: 21, color: colors.slate, fontFamily: sans }}>
        Screenshot of the HTML report of the run in demo/promo/accounts-baseline.tape, Veridelta{" "}
        {transcripts.release} at commit {transcripts.commit.slice(0, 7)}
      </div>
    </AbsoluteFill>
  );
};
