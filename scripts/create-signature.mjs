import opentype from "opentype.js";
import fs from "node:fs/promises";
const buffer = await fs.readFile(
  "node_modules/@fontsource/allura/files/allura-latin-400-normal.woff",
);
const font = opentype.parse(
  buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
);
const path = font.getPath("Ahmad Abdullah", 12, 80, 80);
const box = path.getBoundingBox();
// Serialize numeric commands directly; avoid optimizer rounding corrupting SVG coordinates.
const fields = {
  M: ["x", "y"],
  L: ["x", "y"],
  Q: ["x1", "y1", "x", "y"],
  C: ["x1", "y1", "x2", "y2", "x", "y"],
  Z: [],
};
const pathData = path.commands
  .map(
    (command) =>
      command.type +
      (fields[command.type] || [])
        .map((field) => Number(command[field].toFixed(2)))
        .join(" "),
  )
  .join(" ");
await fs.mkdir("public/images/brand", { recursive: true });
await fs.writeFile(
  "public/images/brand/ahmad-abdullah-signature.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.ceil(box.x2 + 15)} 112" role="img" aria-label="Ahmad Abdullah signature"><path d="${pathData}" fill="#b04d30"/><path d="M44 96 Q190 82 ${Math.ceil(box.x2 - 10)} 96" fill="none" stroke="#b04d30" stroke-width="1.1" stroke-linecap="round"/></svg>`,
);
