// One scene: its picture, faded in and out over a quarter second. In a narrated cut, the
// picture sits above the subtitles, and each line of the voice plays from its moment.
import { AbsoluteFill, Html5Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CardScene } from "./scenes/CardScene";
import { InstallScene } from "./scenes/InstallScene";
import { MediaScene } from "./scenes/MediaScene";
import { ReportScene } from "./scenes/ReportScene";
import { Subtitles } from "./scenes/Subtitles";
import { TerminalScene } from "./scenes/TerminalScene";
import { TitleScene } from "./scenes/TitleScene";
import { FPS, type Scene } from "./storyboard";

const FADE = 8;
/** Pixels the subtitles take at the bottom of a narrated cut. */
const SUBTITLES = 170;

export const SceneView = ({
  scene,
  frames,
  square,
  narrated = false,
  credit,
}: {
  scene: Scene;
  frames: number;
  square: boolean;
  narrated?: boolean;
  credit?: string;
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, FADE, frames - FADE, frames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const { picture } = scene;
  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill style={{ bottom: narrated ? SUBTITLES : 0 }}>
        {picture.kind === "title" && <TitleScene square={square} />}
        {(picture.kind === "clip" || picture.kind === "image") && <MediaScene scene={scene} square={square} />}
        {picture.kind === "terminal" && (
          <TerminalScene name={picture.transcript} label={picture.label} timing={picture.timing} />
        )}
        {picture.kind === "screenshot" && (
          <ReportScene
            name={picture.image}
            label={picture.label}
            frames={frames}
            width={picture.width}
            scrollAt={picture.scrollAt}
          />
        )}
        {picture.kind === "card" && (
          <CardScene heading={picture.heading} lines={picture.lines} square={square} shows={picture.shows} />
        )}
        {picture.kind === "install" && (
          <InstallScene square={square} repository={picture.repository} credit={credit} />
        )}
      </AbsoluteFill>
      {narrated && <Subtitles captions={scene.captions} />}
      {(scene.voice ?? []).map(({ text, file, at }) =>
        file ? (
          <Sequence key={text} from={Math.round(at * FPS)} name={`voice: ${text}`}>
            <Html5Audio src={staticFile(`voice/${file}`)} />
          </Sequence>
        ) : null,
      )}
    </AbsoluteFill>
  );
};
