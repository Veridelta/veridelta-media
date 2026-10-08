// One composition per cut in src/storyboard.ts.
import { Composition } from "remotion";
import { CutView } from "./CutView";
import { loadFonts } from "./fonts";
import { FPS, cutFrames, cuts } from "./storyboard";

loadFonts();

export const Root = () => (
  <>
    {cuts.map((cut) => (
      <Composition
        key={cut.id}
        id={cut.id}
        component={CutView}
        durationInFrames={cutFrames(cut)}
        fps={FPS}
        width={cut.width}
        height={cut.height}
        defaultProps={{ cutId: cut.id }}
      />
    ))}
  </>
);
