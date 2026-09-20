/** Run after extracting the supplied Sprint 11 archive. Source files never enter Git. */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
const root = process.argv[2] || ".artifacts/source-audit/archive/Sprint-11";
const projects = [
  "95-prime-baby-gear",
  "96-ollie-burwell",
  "97-nokoluxe",
  "99-paw-by-four",
];
const result = {};
for (const folder of projects) {
  const manifest = JSON.parse(
    await fs.readFile(path.join(root, folder, "asset-manifest.json"), "utf8"),
  );
  const dir = `public/images/blog/${manifest.slug}`;
  await fs.mkdir(dir, { recursive: true });
  result[manifest.slug] = {};
  for (const image of manifest.images) {
    if (
      /qa_user_flow|responsive_comparison|interaction_detail_state/.test(
        image.file,
      )
    )
      continue;
    const input = path.join(root, folder, "images", image.file);
    const key = image.file
      .replace(/^\d+_/, "")
      .replace(manifest.slug.replaceAll("-", "_") + "_", "")
      .replace(/_001\.jpg$/, "")
      .replaceAll("_", "-");
    const buffer = await fs.readFile(input);
    const m = await sharp(buffer).metadata();
    const width = Math.min(1440, m.width);
    const height = Math.round((m.height * width) / m.width);
    const src = `/images/blog/${manifest.slug}/${key}.webp`;
    await sharp(buffer)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 84 })
      .toFile("public" + src);
    let smallSrc;
    let smallWidth;
    if (width > 720) {
      smallSrc = src.replace(".webp", "-720.webp");
      smallWidth = 720;
      await sharp(buffer)
        .resize(720)
        .webp({ quality: 82 })
        .toFile("public" + smallSrc);
    }
    let avifSrc;
    if (key === "desktop-home-hero") {
      avifSrc = src.replace(".webp", ".avif");
      await sharp(buffer)
        .resize({ width, withoutEnlargement: true })
        .avif({ quality: 57, effort: 4 })
        .toFile("public" + avifSrc);
    }
    result[manifest.slug][key] = {
      src,
      width,
      height,
      alt: `${manifest.name}: ${image.label.toLowerCase()}`,
      smallSrc,
      smallWidth,
      avifSrc,
      caption: image.label.replace(" / catalogue", ""),
      sourcePath: image.path,
      capturedAt: manifest.generated,
    };
  }
}
await fs.writeFile(
  "src/data/blog/assets.json",
  JSON.stringify(result, null, 2) + "\n",
);
console.log(
  Object.fromEntries(
    Object.entries(result).map(([k, v]) => [k, Object.keys(v)]),
  ),
);
