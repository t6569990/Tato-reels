import { cp, mkdir, rm, copyFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const publicDir = resolve(root, "public");
const distDir = resolve(root, "dist");

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });
await cp(publicDir, distDir, { recursive: true });

// La APK debe usar la versión principal actualizada del editor.
// mobile.html quedó como una versión anterior y no contiene los últimos controles.
await copyFile(resolve(publicDir, "pc.html"), resolve(distDir, "index.html"));

console.log("Android web bundle prepared from public/pc.html");
