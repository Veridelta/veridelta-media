// A terminal recording, whole, or the report screenshot, beside its captions. Below them, a
// line says where the picture comes from, so a viewer can trace it.
import { AbsoluteFill, Img, OffthreadVideo, staticFile } from "remotion";
import { clip, image, manifest } from "../clips";
import type { Scene } from "../storyboard";
import { colors } from "../theme";
import { Captions } from "./Captions";

const fit = (width: number, height: number, maxWidth: number, maxHeight: number) => {
  const scale = Math.min(maxWidth / width, maxHeight / height);
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
};

export const MediaScene = ({ scene, square }: { scene: Scene; square: boolean }) => {
  const { picture } = scene;
  if (picture.kind !== "clip" && picture.kind !== "image") {
    throw new Error(`Scene ${scene.id} has no clip or image.`);
  }
  const media = picture.kind === "clip" ? clip(picture.clip) : image(picture.image);
  const origin =
    picture.kind === "clip"
      ? `Recorded from ${clip(picture.clip).tape} at Veridelta ${manifest.release}`
      : `Screenshot ${image(picture.image).source} at Veridelta ${manifest.release}`;
  const box = square
    ? fit(media.width, media.height, 960, 640)
    : fit(media.width, media.height, picture.kind === "clip" ? 980 : 1060, 946);
  const frame = {
    ...box,
    flexShrink: 0,
    borderRadius: 14,
    overflow: "hidden",
    border: `1px solid ${colors.rule}`,
    boxShadow: "0 24px 64px rgba(13, 47, 90, 0.18)",
  } as const;
  const src = staticFile(`clips/${media.file}`);
  return (
    <AbsoluteFill
      style={{
        flexDirection: square ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
        gap: square ? 36 : 80,
        padding: square ? "48px 60px 74px" : "60px 90px 74px",
      }}
    >
      {picture.kind === "clip" ? (
        <OffthreadVideo src={src} muted style={frame} />
      ) : (
        <Img src={src} style={{ ...frame, objectFit: "cover", objectPosition: "top left" }} />
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 28, flex: 1 }}>
        <Captions captions={scene.captions} size={square ? 40 : picture.kind === "clip" ? 54 : 46} />
        <div style={{ fontSize: square ? 20 : 24, color: colors.slate }}>{origin}</div>
      </div>
    </AbsoluteFill>
  );
};
