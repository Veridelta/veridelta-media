// The still a README shows to link to a narrated cut: one frame of the cut, with a play button
// over a part of the picture that holds no text. The frame is the last of a line the voice
// says, so it follows the cut's timing, shows that line's marks and caption, and is never a
// picture the video does not show.
import { AbsoluteFill, Freeze } from "remotion";
import { CutView } from "./CutView";
import { FPS, cutFrames, findCut, timeline } from "./storyboard";
import { colors, sans } from "./theme";

export type PosterProps = {
  cutId: string;
  /** The start of the line whose last frame the poster shows. */
  line: string;
  /** The button's center, in pixels of the cut. */
  x: number;
  y: number;
};

export const posters: (PosterProps & { id: string })[] = [
  // suggest's three rules, each underlined with its evidence, while the voice says so.
  { id: "demo-120-poster", cutId: "demo-120", line: "It proposes a rule for letter case", x: 1440, y: 500 },
];

/** The last frame of the line that starts with this text. */
export const posterFrame = (cutId: string, line: string) => {
  for (const { scene, start } of timeline(findCut(cutId))) {
    const spoken = scene.voice?.find((entry) => entry.text.startsWith(line));
    if (spoken) {
      return start + Math.round((spoken.at + spoken.seconds) * FPS) - 1;
    }
  }
  throw new Error(`No line in ${cutId} starts with "${line}".`);
};

const length = (cutId: string) => {
  const seconds = Math.round(cutFrames(findCut(cutId)) / FPS);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

const RADIUS = 104;

export const Poster = ({ cutId, line, x, y }: PosterProps) => (
  <AbsoluteFill>
    <Freeze frame={posterFrame(cutId, line)}>
      <CutView cutId={cutId} />
    </Freeze>
    <div
      style={{
        position: "absolute",
        left: x - RADIUS,
        top: y - RADIUS,
        width: 2 * RADIUS,
        height: 2 * RADIUS,
        borderRadius: "50%",
        background: colors.orange,
        boxShadow: "0 14px 36px rgba(0, 0, 0, 0.45)",
      }}
    >
      <svg viewBox="0 0 100 100" width={2 * RADIUS} height={2 * RADIUS}>
        <polygon points="40,28 40,72 76,50" fill={colors.paper} />
      </svg>
    </div>
    <div
      style={{
        position: "absolute",
        left: x - 400,
        width: 800,
        top: y + RADIUS + 30,
        textAlign: "center",
        fontFamily: sans,
      }}
    >
      <div style={{ fontSize: 46, fontWeight: 600, color: colors.paper }}>Watch the demo</div>
      <div style={{ fontSize: 34, fontWeight: 500, color: "#9fb2c8", marginTop: 10 }}>
        {length(cutId)}, narrated, with captions
      </div>
    </div>
  </AbsoluteFill>
);
