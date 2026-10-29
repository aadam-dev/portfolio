// Download the inputs for the Blender desk into .cache/desk/ (nothing here ships to the site):
//   hardwood2_diffuse.jpg          three.js examples floor texture (MIT)
//   DiffuseTransmissionPlant.glb   Khronos glTF sample asset (CC0)
//   hdri/apartment.exr, night.exr  Poly Haven HDRIs as packed by @pmndrs/assets (CC0)
//
//   node scripts/desk-blender/fetch.mjs
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const root = new URL("../../", import.meta.url).pathname;
const CACHE = `${root}.cache/desk/`;
mkdirSync(`${CACHE}hdri`, { recursive: true });

async function get(url, file) {
  const path = `${CACHE}${file}`;
  if (!existsSync(path)) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`${url}: ${r.status}`);
    writeFileSync(path, Buffer.from(await r.arrayBuffer()));
  }
  return path;
}

await get("https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/hardwood2_diffuse.jpg", "hardwood2_diffuse.jpg");
await get("https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DiffuseTransmissionPlant/glTF-Binary/DiffuseTransmissionPlant.glb", "DiffuseTransmissionPlant.glb");
const tgz = await get("https://registry.npmjs.org/@pmndrs/assets/-/assets-1.7.0.tgz", "pmndrs-assets-1.7.0.tgz");
execFileSync("tar", ["xzf", tgz, "-C", CACHE, "package/hdri/apartment.exr.js", "package/hdri/night.exr.js"]);
for (const n of ["apartment", "night"]) {
  const js = readFileSync(`${CACHE}package/hdri/${n}.exr.js`, "utf8");
  const b64 = js.slice(js.indexOf("base64,") + 7, js.lastIndexOf("'"));
  writeFileSync(`${CACHE}hdri/${n}.exr`, Buffer.from(b64, "base64"));
}
console.log("inputs ready in", CACHE);
