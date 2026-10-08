// Settings for `remotion studio` and `remotion render`. The cuts are set in src/Root.tsx.
import { Config } from "@remotion/cli/config";

// PNG frames and the BT.709 color space give standard H.264 in yuv420p, tagged as
// video sites expect, so the logo's colors look the same wherever the cut plays.
Config.setVideoImageFormat("png");
Config.setColorSpace("bt709");
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.setOverwriteOutput(true);
