// The wordmark, the install command, and where the docs are.
import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, mono } from "../theme";

export const InstallScene = ({ square }: { square: boolean }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: square ? 40 : 48, paddingBottom: 14 }}>
    <Img src={staticFile("brand/veridelta-wordmark.png")} style={{ height: square ? 64 : 70 }} />
    <div
      style={{
        padding: square ? "22px 40px" : "26px 52px",
        borderRadius: 14,
        background: colors.navy,
        color: colors.paper,
        fontFamily: mono,
        fontSize: square ? 50 : 64,
        fontWeight: 700,
      }}
    >
      pip install veridelta
    </div>
    <div style={{ fontSize: square ? 38 : 46, fontWeight: 600, color: colors.blue }}>veridelta.github.io/veridelta</div>
    <div style={{ fontSize: square ? 26 : 30, color: colors.slate }}>Open source, under the Apache 2.0 license</div>
  </AbsoluteFill>
);
