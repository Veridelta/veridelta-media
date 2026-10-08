// The voice's lines, as scripts/voice.ts made them: each line's file, its length, and the
// engine and voice that spoke it. A line the voice has not spoken yet gets an estimated length,
// so the cut still renders, and `npm run check` names it.
import manifest from "../public/voice/manifest.json";

export type Engine = "google" | "espeak";

export type VoiceLine = {
  text: string;
  file: string;
  seconds: number;
  engine: Engine;
  voice: string;
  sha256: string;
};

export const voices = manifest as { lines: VoiceLine[] };

export const spoken = (text: string) => voices.lines.find((line) => line.text === text);

/** About 2.6 words a second, as a calm voice reads, until the line is spoken. */
export const estimate = (text: string) => 0.4 + text.split(/\s+/).length / 2.6;
