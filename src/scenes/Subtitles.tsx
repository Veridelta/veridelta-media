// The line the voice says, word for word, in the lower third, for a viewer who plays the cut
// muted or cannot hear it.
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Caption } from "../storyboard";
import { colors, sans } from "../theme";

export const Subtitles = ({ captions }: { captions: Caption[] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;
  const active =
    captions.find((caption) => seconds >= caption.from && seconds < caption.to) ?? captions[captions.length - 1];
  const opacity = interpolate((seconds - active.from) * fps, [0, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 44,
        display: "flex",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          padding: "14px 32px",
          borderRadius: 12,
          background: "rgba(13, 47, 90, 0.92)",
          color: colors.paper,
          fontFamily: sans,
          fontSize: 40,
          fontWeight: 600,
          lineHeight: 1.3,
          textAlign: "center",
        }}
      >
        {active.text}
      </div>
    </div>
  );
};
