// Encode the rendered desk plates for the web: AVIF and WebP at a few widths.
// node scripts/desk-blender/encode.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const src = path.join(root, ".cache/desk-blender/out");
const dst = path.join(root, "public/desk/plates");
fs.mkdirSync(dst, { recursive: true });

const WIDTHS = { desktop: [1280, 1920, 2560], phone: [800, 1200] };
const lqip = {};

for (const view of ["desktop", "phone"]) {
  for (const phase of ["day", "night"]) {
    const file = path.join(src, `${view}-${phase}.png`);
    if (!fs.existsSync(file)) {
      console.log("missing", file);
      continue;
    }
    for (const w of WIDTHS[view]) {
      const base = sharp(file).resize({ width: w });
      const avif = path.join(dst, `${view}-${phase}-${w}.avif`);
      const webp = path.join(dst, `${view}-${phase}-${w}.webp`);
      await base.clone().avif({ quality: 66, effort: 6 }).toFile(avif);
      await base.clone().webp({ quality: 80, effort: 6 }).toFile(webp);
      console.log(view, phase, w, `${(fs.statSync(avif).size / 1024).toFixed(0)}KB avif`, `${(fs.statSync(webp).size / 1024).toFixed(0)}KB webp`);
    }
    // a tiny blurred placeholder, inlined as the background while the plate loads
    const tiny = await sharp(file).resize({ width: 32 }).webp({ quality: 50 }).toBuffer();
    lqip[`${view}-${phase}`] = `data:image/webp;base64,${tiny.toString("base64")}`;
  }
}
fs.writeFileSync(path.join(dst, "lqip.json"), JSON.stringify(lqip, null, 1) + "\n");
