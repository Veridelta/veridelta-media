// The terminal recordings and the screenshot, as scripts/fetch-clips.sh recorded them.
import manifest from "../public/clips/manifest.json";

export { manifest };

export const clip = (name: string) => {
  const found = manifest.clips.find((entry) => entry.name === name);
  if (!found) {
    throw new Error(`public/clips/manifest.json has no clip named ${name}.`);
  }
  return found;
};

export const image = (name: string) => {
  const found = manifest.images.find((entry) => entry.name === name);
  if (!found) {
    throw new Error(`public/clips/manifest.json has no image named ${name}.`);
  }
  return found;
};
