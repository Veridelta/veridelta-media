// The wordmark, the install command, and where the docs are. A cut may add the repository's
// address, and a credit for what it plays.
import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, mono } from "../theme";

export const InstallScene = ({
  square,
  repository = false,
  credit,
}: {
  square: boolean;
  repository?: boolean;
  credit?: string;
}) => (
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
    {repository && (
      <div style={{ fontSize: square ? 34 : 40, fontWeight: 600, color: colors.navy }}>github.com/Veridelta/veridelta</div>
    )}
    <div style={{ fontSize: square ? 26 : 30, color: colors.slate }}>Open source, under the Apache 2.0 license</div>
    {credit && <div style={{ fontSize: square ? 20 : 22, color: colors.slate }}>{credit}</div>}
  </AbsoluteFill>
);
