// The logo, then PyPI's one-line summary.
import { AbsoluteFill, Img, staticFile } from "remotion";
import { SENTENCE } from "../storyboard";

export const TitleScene = ({ square }: { square: boolean }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: square ? 80 : 160 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 28, marginBottom: square ? 48 : 64 }}>
      <Img src={staticFile("brand/veridelta-symbol.png")} style={{ height: square ? 150 : 170 }} />
      {/* The wordmark file is 50 pixels tall, so it stays near that size to stay sharp. */}
      <Img src={staticFile("brand/veridelta-wordmark.png")} style={{ height: square ? 64 : 70 }} />
    </div>
    <div
      style={{
        maxWidth: square ? 900 : 1400,
        fontSize: square ? 46 : 54,
        fontWeight: 600,
        lineHeight: 1.3,
        textAlign: "center",
      }}
    >
      {SENTENCE}
    </div>
  </AbsoluteFill>
);
