import { cp, mkdir, rm, copyFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const publicDir = resolve(root, "public");
const distDir = resolve(root, "dist");

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });
await cp(publicDir, distDir, { recursive: true });
await copyFile(resolve(publicDir, "mobile.html"), resolve(distDir, "index.html"));

console.log("Android web bundle prepared from public/mobile.html");
