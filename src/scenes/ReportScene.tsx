// A screenshot in the terminal's frame: the HTML report, with a slow push toward the changed
// rows, or a page taller than the frame, which scrolls to its bottom when a line asks. Below it,
// a line says where the screenshot comes from.
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { screenshot, transcripts } from "../transcripts";
import { colors, sans } from "../theme";

/** The frame's height, its title bar's, and its width in a 1920 cut when none is set. */
const HEIGHT = 780;
const BAR = 48;
const FULL = 1680;
/** Seconds a scroll takes from the top of the picture to its bottom. */
const SCROLL = 2.5;

export const ReportScene = ({
  name,
  label,
  frames,
  width,
  scrollAt,
}: {
  name: string;
  label: string;
  frames: number;
  width?: number;
  scrollAt?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const image = screenshot(name);
  let transform: string;
  let transformOrigin: string | undefined;
  if (scrollAt === undefined) {
    transform = `scale(${interpolate(frame, [0, frames], [1, 1.06], { extrapolateRight: "clamp" })})`;
    transformOrigin = "30% 62%";
  } else {
    const shown = (width ?? FULL) * (image.height / image.width);
    const travel = Math.max(0, shown - (HEIGHT - BAR));
    const start = scrollAt * fps;
    const y = interpolate(frame, [start, start + SCROLL * fps], [0, -travel], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
    transform = `translateY(${y}px)`;
  }
  return (
    <AbsoluteFill style={{ alignItems: "center", padding: "40px 120px 0" }}>
      <div
        style={{
          width: width ?? "100%",
          height: HEIGHT,
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
            height: BAR,
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
          <Img src={staticFile(`transcripts/${image.file}`)} style={{ width: "100%", transform, transformOrigin }} />
        </div>
      </div>
      <div style={{ marginTop: 14, fontSize: 21, color: colors.slate, fontFamily: sans }}>
        {image.caption}, Veridelta {transcripts.release} at commit {transcripts.commit.slice(0, 7)}
      </div>
    </AbsoluteFill>
  );
};
