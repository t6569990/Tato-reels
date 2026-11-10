import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = resolve(root, "public/assets/tato-reels-icon.svg");
const res = resolve(root, "android/app/src/main/res");
const svg = await readFile(source);

const densities = {
  mdpi: 48,
  hdpi: 72,
  xhdpi: 96,
  xxhdpi: 144,
  xxxhdpi: 192
};

for (const [density, size] of Object.entries(densities)) {
  const dir = resolve(res, `mipmap-${density}`);
  await mkdir(dir, { recursive: true });
  const png = await sharp(svg).resize(size, size, { fit: "contain" }).png().toBuffer();
  await writeFile(resolve(dir, "ic_launcher.png"), png);
  await writeFile(resolve(dir, "ic_launcher_round.png"), png);
}

// Use the supplied complete artwork as the launcher icon on all Android versions.
// Removing adaptive XML makes Android use these matching density-specific PNGs.
const adaptiveDir = resolve(res, "mipmap-anydpi-v26");
for (const name of ["ic_launcher.xml", "ic_launcher_round.xml"]) {
  await rm(resolve(adaptiveDir, name), { force: true });
}

console.log("Applied public/assets/tato-reels-icon.svg as the Android launcher icon.");
