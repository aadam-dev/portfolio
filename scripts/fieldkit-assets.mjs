#!/usr/bin/env node
/**
 * Builds the Field Kit's real-item images from the project captures and
 * walkthrough recordings already in /public. Re-run after captures change:
 *
 *   node scripts/fieldkit-assets.mjs
 *
 * Every crop box is [left, top, width, height] in the source's pixels.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";

const PUB = new URL("../public/", import.meta.url).pathname;
const OUT = join(PUB, "fieldkit");
const TMP = join(tmpdir(), "fieldkit-frames");
mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });

/** Grab one full-resolution frame from a walkthrough recording. */
function frame(video, seconds) {
  const out = join(TMP, `${video.replace(/\W/g, "_")}-${seconds}.png`);
  if (!existsSync(out)) {
    execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(seconds), "-i", join(PUB, "walkthroughs", video), "-frames:v", "1", out]);
  }
  return out;
}

const LAUNDRY = frame("an-nur-laundry.mp4", 20); // counter: garment catalogue
const WORKSTATION = frame("an-nur-laundry.mp4", 65); // workstation board
const ZAINAS = frame("zainas-ops.mp4", 92); // shop grid with names and prices

const garment = (col, row) => [25 + Math.round(col * 160.5), 207 + row * 223, 146, 143];
const stage = (x) => [x - 6, 140, 48, 48];

const JOBS = [
  // Al Boyut POS register (alboyut/pos.webp)
  ["previews/alboyut/pos.webp", [285, 258, 230, 234], "pos-empire-325", 240, 240],
  ["previews/alboyut/pos.webp", [585, 258, 230, 234], "pos-dzata", 240, 240],
  ["previews/alboyut/pos.webp", [860, 214, 265, 278], "pos-pvc-bend-34", 240, 240],
  ["previews/alboyut/pos.webp", [1160, 214, 265, 278], "pos-dove-pop", 240, 240],
  ["previews/alboyut/pos.webp", [270, 610, 265, 278], "pos-wall-nail", 240, 240],
  ["previews/alboyut/pos.webp", [555, 610, 279, 278], "pos-interplast-12", 240, 240],
  ["previews/alboyut/pos.webp", [912, 656, 196, 232], "pos-empire-425", 240, 240],
  ["previews/alboyut/pos.webp", [1150, 610, 278, 278], "pos-pvc-bend-12", 240, 240],
  ["previews/alboyut/pos.webp", [10, 5, 70, 65], "logo-alboyut", 96, 96],

  // An-Nur laundry counter (walkthrough frame)
  [LAUNDRY, garment(0, 0), "wash-tshirt", 200, 196],
  [LAUNDRY, garment(1, 0), "wash-shirt", 200, 196],
  [LAUNDRY, garment(2, 0), "wash-trouser", 200, 196],
  [LAUNDRY, garment(3, 1), "wash-smock", 200, 196],
  [LAUNDRY, garment(4, 1), "wash-jalbab", 200, 196],
  [LAUNDRY, garment(6, 1), "wash-agbada", 200, 196],
  [LAUNDRY, garment(0, 1), "wash-suit", 200, 196],
  [LAUNDRY, garment(6, 3), "wash-bedsheet", 200, 196],
  [WORKSTATION, [10, 8, 56, 56], "logo-annur", 96, 96],
  [WORKSTATION, stage(304), "stage-received", 96, 96],
  [WORKSTATION, stage(604), "stage-washing", 96, 96],
  [WORKSTATION, stage(900), "stage-drying", 96, 96],
  [WORKSTATION, stage(1194), "stage-ironing", 96, 96],
  [WORKSTATION, stage(1492), "stage-quality", 96, 96],
  [WORKSTATION, stage(1784), "stage-ready", 96, 96],

  // Zaina's Couture shop grid (walkthrough frame)
  [ZAINAS, [296, 574, 314, 416], "zainas-amara", 300, 398],
  [ZAINAS, [634, 574, 314, 416], "zainas-naa", 300, 398],
  [ZAINAS, [972, 574, 314, 416], "zainas-sika", 300, 398],
  [ZAINAS, [1310, 574, 314, 416], "zainas-efe", 300, 398],

  // Muna Muse: Emerald Feather Kaftan fabric (munamuse/product.webp)
  ["previews/munamuse/product.webp", [150, 240, 720, 960], "munamuse-emerald", 330, 440],

  // Delish: signature dish photo (delish/menu.webp)
  ["previews/delish/menu.webp", [140, 800, 790, 400], "delish-jollof", 480, 243],

  // Madina: the real court (madinabasketball/landing.webp)
  ["previews/madinabasketball/landing.webp", [1270, 200, 650, 760], "madina-court", 520, 608],
];

for (const [src, [left, top, width, height], name, w, h] of JOBS) {
  const input = src.startsWith("/") ? src : join(PUB, src);
  await sharp(input)
    .extract({ left, top, width, height })
    .resize(w, h, { fit: "cover", position: "centre" })
    .webp({ quality: 80 })
    .toFile(join(OUT, `${name}.webp`));
  console.log("✓", name);
}

rmSync(TMP, { recursive: true, force: true });
