// The transcripts of Veridelta's tapes for video, as scripts/fetch-transcripts.sh copied them.
// Veridelta's own test holds each transcript to what the CLI prints at the manifest's commit,
// and a terminal scene shows only their text, so every line it sets in type is real output.
import manifest from "../public/transcripts/manifest.json";

export { PROMPT, parseTranscript, type Step } from "./parse-transcript";
export { manifest as transcripts };

export const transcript = (name: string) => {
  const found = manifest.transcripts.find((entry) => entry.name === name);
  if (!found) {
    throw new Error(`public/transcripts/manifest.json has no transcript named ${name}.`);
  }
  return found;
};

export const screenshot = (name: string) => {
  const found = manifest.images.find((entry) => entry.name === name);
  if (!found) {
    throw new Error(`public/transcripts/manifest.json has no image named ${name}.`);
  }
  return found;
};
