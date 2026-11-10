import { cp, mkdir, readFile, rm, writeFile, copyFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const publicDir = resolve(root, "public");
const distDir = resolve(root, "dist");

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });
await cp(publicDir, distDir, { recursive: true });
await copyFile(resolve(publicDir, "mobile.html"), resolve(distDir, "index.html"));

const indexPath = resolve(distDir, "index.html");
let html = await readFile(indexPath, "utf8");
const admobBootstrap = `
<style id="tato-admob-layout">
  html.tato-admob-native body { padding-bottom: 150px !important; }
</style>
<script type="module" src="./assets/admob.bundle.js"></script>
`;
if (!html.includes("admob.bundle.js")) {
  html = html.replace("</body>", admobBootstrap + "\n</body>");
  await writeFile(indexPath, html);
}

console.log("Android web bundle prepared from public/mobile.html with native AdMob bootstrap.");
