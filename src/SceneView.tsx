// One scene: its picture, faded in and out over a quarter second.
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CardScene } from "./scenes/CardScene";
import { InstallScene } from "./scenes/InstallScene";
import { MediaScene } from "./scenes/MediaScene";
import { TitleScene } from "./scenes/TitleScene";
import type { Scene } from "./storyboard";

const FADE = 8;

export const SceneView = ({ scene, frames, square }: { scene: Scene; frames: number; square: boolean }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, FADE, frames - FADE, frames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const { picture } = scene;
  return (
    <AbsoluteFill style={{ opacity }}>
      {picture.kind === "title" && <TitleScene square={square} />}
      {(picture.kind === "clip" || picture.kind === "image") && <MediaScene scene={scene} square={square} />}
      {picture.kind === "card" && <CardScene heading={picture.heading} lines={picture.lines} square={square} />}
      {picture.kind === "install" && <InstallScene square={square} />}
    </AbsoluteFill>
  );
};
