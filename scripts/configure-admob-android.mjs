import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const manifestPath = resolve("android/app/src/main/AndroidManifest.xml");
const testAppId = "ca-app-pub-3940256099942544~3347511713";
let manifest = await readFile(manifestPath, "utf8");

if (!manifest.includes("com.google.android.gms.ads.APPLICATION_ID")) {
  const applicationClose = manifest.indexOf("</application>");
  if (applicationClose < 0) throw new Error("AndroidManifest.xml has no application closing tag.");
  const metadata = `    <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="${testAppId}" />
`;
  manifest = manifest.slice(0, applicationClose) + metadata + manifest.slice(applicationClose);
  await writeFile(manifestPath, manifest);
}

console.log("Configured Google's official sample AdMob App ID for test builds only.");
