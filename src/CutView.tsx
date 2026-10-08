// A cut: its scenes back to back on the logo's light background, with the band below. A
// narrated cut plays its music under the voice, quieter while a line plays.
import { AbsoluteFill, Html5Audio, Sequence, getStaticFiles, interpolate, staticFile } from "remotion";
import { SceneView } from "./SceneView";
import { FPS, cutFrames, findCut, timeline, type Cut } from "./storyboard";
import { colors, sans } from "./theme";

/** The music's volume while the voice speaks, and between lines. */
const UNDER = 0.06;
const BETWEEN = 0.13;
/** Frames the music takes to dip before a line and to come back after it. */
const RAMP = 9;

/** Each line's first and last frame in the cut. */
const voiceSpans = (cut: Cut) =>
  timeline(cut).flatMap(({ scene, start }) =>
    (scene.voice ?? []).map(({ at, seconds }) => [start + Math.round(at * FPS), start + Math.round((at + seconds) * FPS)]),
  );

const musicVolume = (cut: Cut) => {
  const spans = voiceSpans(cut);
  const total = cutFrames(cut);
  return (frame: number) => {
    const dip = Math.max(
      0,
      ...spans.map(([from, to]) =>
        interpolate(frame, [from - RAMP, from, to, to + RAMP], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      ),
    );
    // In over the first second, out over the last three.
    const fade = interpolate(frame, [0, FPS, total - 3 * FPS, total], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return (BETWEEN + (UNDER - BETWEEN) * dip) * fade;
  };
};

export const CutView = ({ cutId }: { cutId: string }) => {
  const cut = findCut(cutId);
  const square = cut.width === cut.height;
  const music = cut.narrated?.music;
  const playing = music && getStaticFiles().some((file) => file.name === music.file) ? music : undefined;
  const scenes = timeline(cut);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(120deg, ${colors.paper} 0%, ${colors.mist} 100%)`,
        color: colors.navy,
        fontFamily: sans,
      }}
    >
      {scenes.map(({ scene, start, frames }, index) => (
        <Sequence key={scene.id} from={start} durationInFrames={frames} name={scene.id}>
          <SceneView
            scene={scene}
            frames={frames}
            square={square}
            narrated={Boolean(cut.narrated)}
            credit={index === scenes.length - 1 ? playing?.credit : undefined}
          />
        </Sequence>
      ))}
      {playing && <Html5Audio src={staticFile(playing.file)} volume={musicVolume(cut)} />}
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
