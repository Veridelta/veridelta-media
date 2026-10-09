// One composition per cut in src/storyboard.ts, and one per poster in src/Poster.tsx.
import { Composition } from "remotion";
import { CutView } from "./CutView";
import { loadFonts } from "./fonts";
import { Poster, posters } from "./Poster";
import { FPS, cutFrames, cuts, findCut } from "./storyboard";

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
    {/* As long as its cut, since a scene past a composition's end never renders; every frame
        is the poster's. */}
    {posters.map(({ id, ...props }) => {
      const cut = findCut(props.cutId);
      return (
        <Composition
          key={id}
          id={id}
          component={Poster}
          durationInFrames={cutFrames(cut)}
          fps={FPS}
          width={cut.width}
          height={cut.height}
          defaultProps={props}
        />
      );
    })}
  </>
);
