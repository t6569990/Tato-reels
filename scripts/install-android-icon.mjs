import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const svg = resolve(root, "assets/tato-reels-icon.svg");
const res = resolve(root, "android/app/src/main/res");
const densities = {
  "mipmap-mdpi": 48,
  "mipmap-hdpi": 72,
  "mipmap-xhdpi": 96,
  "mipmap-xxhdpi": 144,
  "mipmap-xxxhdpi": 192
};

// Generate the classic launcher icons and the adaptive-icon foreground
// directly from the approved Tato Reels Creator artwork.
for (const [folder, size] of Object.entries(densities)) {
  const dir = resolve(res, folder);
  await mkdir(dir, { recursive: true });
  const png = await sharp(svg).resize(size, size, { fit: "contain" }).png().toBuffer();
  await writeFile(resolve(dir, "ic_launcher.png"), png);
  await writeFile(resolve(dir, "ic_launcher_round.png"), png);
}

const adaptiveDir = resolve(res, "mipmap-anydpi-v26");
await mkdir(adaptiveDir, { recursive: true });
const foregroundDir = resolve(res, "mipmap-xxxhdpi");
await mkdir(foregroundDir, { recursive: true });
await writeFile(
  resolve(foregroundDir, "ic_launcher_foreground.png"),
  await sharp(svg).resize(432, 432, { fit: "contain" }).png().toBuffer()
);

const drawableDir = resolve(res, "drawable");
await mkdir(drawableDir, { recursive: true });
await writeFile(
  resolve(drawableDir, "ic_launcher_background.xml"),
  '<?xml version="1.0" encoding="utf-8"?>\n<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle"><solid android:color="#10104C"/></shape>\n'
);

const adaptive = (name) => `<?xml version="1.0" encoding="utf-8"?>\n<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n    <background android:drawable="@drawable/ic_launcher_background"/>\n    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>\n</adaptive-icon>\n`;
await writeFile(resolve(adaptiveDir, "ic_launcher.xml"), adaptive("ic_launcher"));
await writeFile(resolve(adaptiveDir, "ic_launcher_round.xml"), adaptive("ic_launcher_round"));

console.log("Native Android launcher icons generated from assets/tato-reels-icon.svg");
