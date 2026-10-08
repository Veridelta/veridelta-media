// The fonts ship in public/fonts, so a cut renders the same on every machine.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

const faces = [
  { family: "Inter", file: "Inter-Regular.otf", weight: "400" },
  { family: "Inter", file: "Inter-SemiBold.otf", weight: "600" },
  { family: "Inter", file: "Inter-Bold.otf", weight: "700" },
  { family: "DejaVu Sans Mono", file: "DejaVuSansMono.ttf", weight: "400" },
  { family: "DejaVu Sans Mono", file: "DejaVuSansMono-Bold.ttf", weight: "700" },
];

/** Load every face. Remotion waits for them before it renders a frame. */
export const loadFonts = () =>
  Promise.all(
    faces.map(({ family, file, weight }) =>
      loadFont({ family, url: staticFile(`fonts/${file}`), weight }),
    ),
  );
