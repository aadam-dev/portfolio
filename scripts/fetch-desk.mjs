// Fetch and compress the desk hero's assets into public/desk/:
//   tex/wood-*.webp   three.js "hardwood2" maps (three.js examples, MIT)
//   plant.glb         Khronos "Diffuse Transmission Plant" (CC-BY 4.0 / CC0)
//   cup.glb           Khronos "Diffuse Transmission Teacup" (CC0)
//   hdri/*.exr        Poly Haven HDRIs as packed by @pmndrs/assets (CC0)
//
//   node scripts/fetch-desk.mjs
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { dedup, meshopt, prune, textureCompress, weld } from "@gltf-transform/functions";
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer";
import sharp from "sharp";

const root = new URL("../", import.meta.url).pathname;
const CACHE = `${root}.cache/desk/`;
const OUT = `${root}public/desk/`;
for (const d of [CACHE, `${OUT}tex`, `${OUT}hdri`]) mkdirSync(d, { recursive: true });

async function get(url, file) {
  const path = `${CACHE}${file}`;
  if (!existsSync(path)) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`${url}: ${r.status}`);
    writeFileSync(path, Buffer.from(await r.arrayBuffer()));
  }
  return path;
}
const kb = (p) => `${(readFileSync(p).length / 1024).toFixed(0)} KB`;

// 1. wood
const THREE_TEX = "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/";
for (const [src, out] of [["hardwood2_diffuse.jpg", "wood-color"], ["hardwood2_bump.jpg", "wood-bump"], ["hardwood2_roughness.jpg", "wood-rough"]]) {
  const p = await get(THREE_TEX + src, src);
  const dst = `${OUT}tex/${out}.webp`;
  await sharp(p).resize(1024, 1024, { fit: "inside" }).webp({ quality: out === "wood-color" ? 84 : 78 }).toFile(dst);
  console.log(dst, kb(dst));
}

// 2. plant and cup
await MeshoptEncoder.ready;
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ "meshopt.encoder": MeshoptEncoder, "meshopt.decoder": MeshoptDecoder });
const KHR = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/";
for (const [name, out, size] of [["DiffuseTransmissionPlant", "plant", 1024], ["DiffuseTransmissionTeacup", "cup", 512]]) {
  const p = await get(`${KHR}${name}/glTF-Binary/${name}.glb`, `${name}.glb`);
  const doc = await io.readBinary(readFileSync(p));
  await doc.transform(dedup(), prune(), weld(), textureCompress({ encoder: sharp, targetFormat: "webp", resize: [size, size] }), meshopt({ encoder: MeshoptEncoder, level: "medium" }));
  const dst = `${OUT}${out}.glb`;
  writeFileSync(dst, await io.writeBinary(doc));
  console.log(dst, kb(dst));
}

// 3. HDRIs from the @pmndrs/assets tarball (base64 modules -> .exr files)
const tgz = await get("https://registry.npmjs.org/@pmndrs/assets/-/assets-1.7.0.tgz", "pmndrs-assets-1.7.0.tgz");
execFileSync("tar", ["xzf", tgz, "-C", CACHE, "package/hdri/apartment.exr.js", "package/hdri/night.exr.js"]);
for (const n of ["apartment", "night"]) {
  const js = readFileSync(`${CACHE}package/hdri/${n}.exr.js`, "utf8");
  const b64 = js.slice(js.indexOf("base64,") + 7, js.lastIndexOf("'"));
  const dst = `${OUT}hdri/${n}.exr`;
  writeFileSync(dst, Buffer.from(b64, "base64"));
  console.log(dst, kb(dst));
}
