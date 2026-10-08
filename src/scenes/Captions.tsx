// The scene's caption for the current moment, faded in when it changes. Social video plays
// muted, so every word the cut says is on screen.
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Caption } from "../storyboard";

export const Captions = ({ captions, size }: { captions: Caption[]; size: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;
  const active =
    captions.find((caption) => seconds >= caption.from && seconds < caption.to) ?? captions[captions.length - 1];
  const opacity = interpolate((seconds - active.from) * fps, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <div style={{ fontSize: size, fontWeight: 600, lineHeight: 1.3, opacity }}>{active.text}</div>;
};
