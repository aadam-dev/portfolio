// Pack the baked desk for the site: meshopt-compressed glTF, and WebP textures
// at full size (desktop) and half size (phones).
//   node scripts/desk-blender/pack.mjs
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const bake = path.join(root, ".cache/desk-blender/bake");
const out = path.join(root, "public/desk/3d");
fs.mkdirSync(out, { recursive: true });

execFileSync("npx", ["gltf-transform", "meshopt", path.join(bake, "desk-raw.glb"), path.join(out, "desk.glb"), "--level", "medium"], { stdio: "inherit", cwd: root });

const meta = JSON.parse(fs.readFileSync(path.join(bake, "desk3d.json"), "utf8"));
let total = fs.statSync(path.join(out, "desk.glb")).size;
for (const g of meta.groups) {
  for (const kind of ["albedo", "day", "evening"]) {
    const src = path.join(bake, `${g}-${kind}.png`);
    const { width } = await sharp(src).metadata();
    for (const [suffix, w] of [["", width], ["-m", Math.max(64, Math.round(width / 2))]]) {
      const dst = path.join(out, `${g}-${kind}${suffix}.webp`);
      await sharp(src).resize({ width: w }).webp({ quality: kind === "albedo" ? 82 : 76, effort: 6 }).toFile(dst);
      if (!suffix) total += fs.statSync(dst).size;
    }
  }
}
// the phone's lock screen and the live screens' stand-ins before the apps mount
await sharp(path.join(root, ".cache/desk-blender/tex/lockscreen.png")).resize({ width: 360 }).webp({ quality: 80 }).toFile(path.join(out, "lockscreen.webp"));
for (const s of ["left", "center", "right"]) await sharp(path.join(root, `.cache/desk-blender/screens/${s}.png`)).resize({ width: 1024 }).webp({ quality: 78 }).toFile(path.join(out, `screen-${s}.webp`));
fs.writeFileSync(path.join(out, "desk3d.json"), JSON.stringify(meta, null, 1) + "\n");
console.log(`desktop payload ${(total / 1024 / 1024).toFixed(2)} MB`);
