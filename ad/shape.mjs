// Writes composition/index.html from template.html for one shape:
//   node ad/shape.mjs landscape | square | vertical
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SHAPES = {
  landscape: [1920, 1080],
  square: [1080, 1080],
  vertical: [1080, 1920],
};

const shape = process.argv[2] ?? "landscape";
if (!(shape in SHAPES)) {
  console.error(`Name a shape: ${Object.keys(SHAPES).join(", ")}.`);
  process.exit(1);
}
const [width, height] = SHAPES[shape];
const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, "template.html"), "utf8")
  .replaceAll("{{SHAPE}}", shape)
  .replaceAll("{{WIDTH}}", String(width))
  .replaceAll("{{HEIGHT}}", String(height))
  .replace(/<!-- The template for every shape\.[\s\S]*?-->\n/, `<!-- Written by ad/shape.mjs from template.html for the ${shape} shape. Edit template.html. -->\n`);
writeFileSync(join(here, "composition", "index.html"), html);
console.log(`composition/index.html: ${shape}, ${width} by ${height}.`);
