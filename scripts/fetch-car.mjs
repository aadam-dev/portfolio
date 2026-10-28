// Build public/lab/car.glb from the Khronos "Car Concept" sample (CC-BY 4.0,
// Eric Chadwick / Darmstadt Graphics Group, from a CC0 model by Unity Fan).
// The Khronos and 3D Commerce logos are excluded from that licence, so this
// script removes every one of them before the car ships:
//   - the plate texture becomes our own export plate
//   - the logo texture is unhooked from every other material
//   - the logos on the tyre sidewall (colour and normal map) are painted out
//   - the steering wheel emblem is removed
// Then it compresses: meshopt geometry, WebP textures at most 2K.
//
//   node scripts/fetch-car.mjs
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { dedup, meshopt, prune, textureCompress, weld } from "@gltf-transform/functions";
import { MeshoptEncoder, MeshoptDecoder } from "meshoptimizer";
import sharp from "sharp";

const SRC = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CarConcept/glTF-Binary/CarConcept.glb";
const CACHE = new URL("../.cache/car/", import.meta.url).pathname;
const OUT = new URL("../public/lab/car.glb", import.meta.url).pathname;

mkdirSync(CACHE, { recursive: true });
mkdirSync(new URL("../public/lab/", import.meta.url).pathname, { recursive: true });
const raw = `${CACHE}CarConcept.glb`;
if (!existsSync(raw)) {
  const res = await fetch(SRC);
  if (!res.ok) throw new Error(`download failed: ${res.status}`);
  writeFileSync(raw, Buffer.from(await res.arrayBuffer()));
}

await MeshoptEncoder.ready;
await MeshoptDecoder.ready;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ "meshopt.encoder": MeshoptEncoder, "meshopt.decoder": MeshoptDecoder });
const doc = await io.readBinary(readFileSync(raw));
const root = doc.getRoot();

// 1. our plate, drawn as SVG, same 4:1 shape as the original
const plateSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="128">
  <rect width="512" height="128" fill="#f2f1ec"/>
  <rect x="6" y="6" width="500" height="116" rx="10" fill="none" stroke="#1f2a44" stroke-width="5"/>
  <text x="256" y="34" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="6" fill="#1f2a44">EXPORT</text>
  <text x="256" y="104" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="68" font-weight="800" letter-spacing="6" fill="#1f2a44">RM 0042</text>
</svg>`;
const plate = await sharp(Buffer.from(plateSvg)).png().toBuffer();

const license = root.listMaterials().find((m) => m.getName() === "License");
const logoTex = license?.getBaseColorTexture();
if (!license || !logoTex) throw new Error("plate material not found");
for (const m of root.listMaterials()) {
  if (m !== license && m.getEmissiveTexture() === logoTex) m.setEmissiveTexture(null).setEmissiveFactor([0, 0, 0]);
  if (m !== license && m.getBaseColorTexture() === logoTex) m.setBaseColorTexture(null);
}
logoTex.setImage(plate).setMimeType("image/png");

// 2. tyre sidewall: copy clean ring from another angle over the logo bands
async function paintOut(tex) {
  const { data, info } = await sharp(Buffer.from(tex.getImage())).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const src = Buffer.from(data);
  const k = W / 1024;
  const bands = [
    [152, 208, 400 * k, 512 * k, -62],
    [0, 20, 420 * k, 512 * k, 40],
    [340, 360, 420 * k, 512 * k, -40],
  ];
  const cx = W / 2;
  const cy = H / 2;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const dx = x - cx;
      const dy = cy - y;
      const r = Math.hypot(dx, dy);
      const a = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
      const band = bands.find(([a0, a1, r0, r1]) => r >= r0 && r <= r1 && a >= a0 && a <= a1);
      if (!band) continue;
      const b = ((a + band[4]) * Math.PI) / 180;
      const sx = Math.min(W - 1, Math.max(0, Math.round(cx + r * Math.cos(b))));
      const sy = Math.min(H - 1, Math.max(0, Math.round(cy - r * Math.sin(b))));
      for (let c = 0; c < C; c++) data[(y * W + x) * C + c] = src[(sy * W + sx) * C + c];
    }
  tex.setImage(await sharp(data, { raw: { width: W, height: H, channels: C } }).png().toBuffer()).setMimeType("image/png");
}
const tire = root.listMaterials().find((m) => m.getName() === "Tireside");
if (!tire) throw new Error("tyre material not found");
await paintOut(tire.getBaseColorTexture());
await paintOut(tire.getNormalTexture());

// 3. no emblem on the steering wheel
for (const n of root.listNodes()) if (n.getName() === "InteriorSteeringEmblem") n.dispose();

// 4. compress
await doc.transform(
  dedup(),
  prune(),
  weld(),
  textureCompress({ encoder: sharp, targetFormat: "webp", resize: [2048, 2048] }),
  meshopt({ encoder: MeshoptEncoder, level: "medium" }),
);
writeFileSync(OUT, await io.writeBinary(doc));
console.log("wrote", OUT, (readFileSync(OUT).length / 1e6).toFixed(2), "MB");
