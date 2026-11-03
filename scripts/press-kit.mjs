// Build the press kit into public/press: logo (SVG and PNG), colours, bios, a one-page PDF and a zip.
//   1. run the site (npm run dev), 2. node scripts/press-kit.mjs [http://localhost:3100]
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const out = path.join(root, "public", "press");
const base = process.argv[2] ?? "http://localhost:3100";
const press = JSON.parse(fs.readFileSync(path.join(root, "src/lib/press.json"), "utf8"));
fs.mkdirSync(out, { recursive: true });

fs.writeFileSync(
  path.join(out, "aadam-logo.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="180" viewBox="0 0 720 180"><circle cx="60" cy="96" r="22" fill="#22c55e"/><text x="110" y="132" font-family="Archivo, Inter, Helvetica, Arial, sans-serif" font-size="128" letter-spacing="-4" fill="#121110">Aadam</text></svg>\n`,
);
fs.writeFileSync(path.join(out, "bio-short.txt"), press.short + "\n");
fs.writeFileSync(path.join(out, "bio-long.txt"), press.long + "\n");
fs.writeFileSync(path.join(out, "colours.txt"), press.colours.map(([n, c]) => `${c}  ${n}`).join("\n") + "\n");

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  ({ chromium } = require(path.join(execFileSync("npm", ["root", "-g"]).toString().trim(), "playwright")));
}
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 600 }, deviceScaleFactor: 2 });
await page.goto(`${base}/press/logo`, { waitUntil: "networkidle" });
await page.evaluate(() => (document.body.style.background = "transparent"));
await page.locator("#logo").screenshot({ path: path.join(out, "aadam-logo.png"), omitBackground: true });
const doc = await browser.newPage();
await doc.goto(`${base}/press/one-pager`, { waitUntil: "networkidle" });
await doc.pdf({ path: path.join(out, "aadam-one-pager.pdf"), format: "A4", printBackground: true, margin: { top: "0", bottom: "0", left: "0", right: "0" } });
await browser.close();

const zip = path.join(out, "aadam-press-kit.zip");
fs.rmSync(zip, { force: true });
execFileSync("zip", ["-j", "-q", zip, ...["aadam-logo.svg", "aadam-logo.png", "aadam-one-pager.pdf", "bio-short.txt", "bio-long.txt", "colours.txt"].map((f) => path.join(out, f))]);
for (const f of fs.readdirSync(out)) console.log(f, (fs.statSync(path.join(out, f)).size / 1024).toFixed(0), "KB");
