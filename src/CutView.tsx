// A cut: its scenes back to back on the logo's light background, with the band below.
import { AbsoluteFill, Sequence } from "remotion";
import { SceneView } from "./SceneView";
import { findCut, timeline } from "./storyboard";
import { colors, sans } from "./theme";

export const CutView = ({ cutId }: { cutId: string }) => {
  const cut = findCut(cutId);
  const square = cut.width === cut.height;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(120deg, ${colors.paper} 0%, ${colors.mist} 100%)`,
        color: colors.navy,
        fontFamily: sans,
      }}
    >
      {timeline(cut).map(({ scene, start, frames }) => (
        <Sequence key={scene.id} from={start} durationInFrames={frames} name={scene.id}>
          <SceneView scene={scene} frames={frames} square={square} />
        </Sequence>
      ))}
      {/* The symbol's two halves, orange into blue, along the bottom edge, as on the card. */}
      <AbsoluteFill
        style={{
          top: "auto",
          height: 14,
          background: `linear-gradient(90deg, ${colors.orange} 0%, ${colors.orange} 45%, ${colors.blue} 55%, ${colors.blue} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
