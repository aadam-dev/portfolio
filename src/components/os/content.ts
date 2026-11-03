/**
 * What lives on the Aadam OS desktop: screenshots I marked up, code I keep reaching for, notes,
 * music, the press kit and the starter kits. Plain data, so the laptop OS and the phone share it.
 */

export type FileKind = "image" | "code" | "text" | "sheet" | "doc" | "folder" | "pdf" | "zip";

export interface Annotation {
  /** a box (circle drawn round it), an arrow from note to point, or a loose note; coordinates are 0..1 of the image */
  kind: "ring" | "arrow" | "note";
  x: number;
  y: number;
  w?: number;
  h?: number;
  /** arrow tip */
  tx?: number;
  ty?: number;
  text?: string;
}

export interface Shot {
  id: string;
  name: string;
  src: string;
  caption: string;
  marks: Annotation[];
}

export const SHOTS: Shot[] = [
  {
    id: "shot-register",
    name: "Screenshot 2026-10-12 at 09.41.png",
    src: "/previews/alboyut/pos.webp",
    caption: "Al Boyut register, the week we moved the cart to the right",
    marks: [
      { kind: "ring", x: 0.755, y: 0.08, w: 0.235, h: 0.88, text: "cart stays in view: no lost sales" },
      { kind: "ring", x: 0.13, y: 0.085, w: 0.6, h: 0.07, text: "search + barcode in one field" },
      { kind: "arrow", x: 0.33, y: 0.62, tx: 0.165, ty: 0.19, text: "badges come from the real stock count" },
    ],
  },
  {
    id: "shot-pnl",
    name: "Screenshot 2026-07-30 at 18.02.png",
    src: "/previews/primehub/reports.webp",
    caption: "PrimeTijara reports: P&L straight from the ledger",
    marks: [
      { kind: "ring", x: 0.19, y: 0.385, w: 0.8, h: 0.12, text: "live from the ledger, no spreadsheet" },
      { kind: "arrow", x: 0.62, y: 0.2, tx: 0.68, ty: 0.115, text: "trial balance + cash flow = the accountant's month" },
    ],
  },
  {
    id: "shot-menu",
    name: "Screenshot 2026-05-03 at 14.20.png",
    src: "/previews/jireh/menu.webp",
    caption: "Jireh menu manager: dishes deduct their recipes",
    marks: [
      { kind: "ring", x: 0.005, y: 0.395, w: 0.175, h: 0.17, text: "recipes / BOMs drive stock" },
      { kind: "arrow", x: 0.3, y: 0.08, tx: 0.13, ty: 0.12, text: "one click to the till" },
    ],
  },
  {
    id: "shot-koyi",
    name: "Screenshot 2026-08-29 at 11.07.png",
    src: "/previews/koyi/pathway.webp",
    caption: "Kōyi pathway page, the day before ICIS",
    marks: [
      { kind: "ring", x: 0.69, y: 0.02, w: 0.07, h: 0.06, text: "EN · FR · AR" },
      { kind: "ring", x: 0.24, y: 0.44, w: 0.52, h: 0.12, text: "honest disclaimers, kindly" },
    ],
  },
];

export interface Snippet {
  id: string;
  name: string;
  lang: "ts" | "sql" | "sh";
  code: string;
}

export const SNIPPETS: Snippet[] = [
  {
    id: "code-quad",
    name: "quad.ts",
    lang: "ts",
    code: `// Put any element on a photographed screen: solve the homography
// that maps a w×h box onto the four corners, then hand CSS a matrix3d.
export function quadMatrix(w: number, h: number, dst: Quad): string {
  const src: Quad = [[0, 0], [w, 0], [w, h], [0, h]];
  const H = solve(src, dst); // 8 unknowns, 8 equations
  return \`matrix3d(\${H[0]},\${H[3]},0,\${H[6]},\${H[1]},\${H[4]},0,\${H[7]},0,0,1,0,\${H[2]},\${H[5]},0,1)\`;
}`,
  },
  {
    id: "code-recount",
    name: "stock-recount.sql",
    lang: "sql",
    code: `-- Delish: where did the shrimp go? Compare the count with what sales should have used.
select p.name,
       c.counted_qty,
       c.expected_qty,
       c.counted_qty - c.expected_qty            as variance,
       round(100.0 * (c.counted_qty - c.expected_qty) / nullif(c.expected_qty, 0), 1) as pct
from   stock_counts c
join   products p on p.id = c.product_id
where  c.session = '2026-W41'
order  by abs(c.counted_qty - c.expected_qty) desc
limit  15;`,
  },
  {
    id: "code-alert",
    name: "telegram-alert.ts",
    lang: "ts",
    code: `// Every message from the site reaches my phone in seconds, with the visit behind it.
await send(
  frame("message", [
    \`<b>\${esc(name)}</b> · \${esc(contact)}\`,
    \`<blockquote>\${esc(message)}</blockquote>\`,
    line("Visit", \`\${flag(country)} \${city}, \${pages} pages, \${seconds}s\`),
  ]),
  { buttons: [[{ text: "Open the inbox", url: \`\${origin}/office\` }]] },
);`,
  },
];

export interface TextFile {
  id: string;
  name: string;
  body: string;
}

export const TEXTS: TextFile[] = [
  {
    id: "txt-standup",
    name: "standup-notes.md",
    body: `# standup, Tuesday

done
- cashier queue now speaks the total ("Sale ticket from Ama, 168 cedis")
- PrimeShift fits phones without scrolling

doing
- Aadam OS: stickies, the spreadsheet, rain in the Music app
- reading the model's DSCR line again; it should never hide below 1.2

blocked
- nothing. coffee is fine.`,
  },
  {
    id: "txt-ideas",
    name: "ideas.txt",
    body: `ideas, unsorted
- a POS that prints the receipt AND sends it on WhatsApp
- stock counts as a game: fastest accurate shelf wins
- "what changed since yesterday" page for every owner
- laundry: SMS when it's ready, a second one if it's still there on day 5
- court: a live scoreboard on the TV at the side of the court
- portfolio: let visitors leave a note on the desktop (done!)`,
  },
  {
    id: "txt-deploy",
    name: "deploy.log",
    body: `▲ vercel deploy --prod (preview first, always)
  ✓ lint            0 errors
  ✓ typecheck       done
  ✓ build           38 routes
  ✓ health          db ok · 9 tables
  ✓ smoke test      /, /work, /office/login
  → ready           https://aadambuilds.dev`,
  },
];

export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  tone: string;
}

export const TRACKS: Track[] = [
  { id: "rain", title: "Rain on the zinc roof", artist: "Adenta, July", src: "/os/music/rain.mp3", tone: "linear-gradient(160deg,#30475e,#16202c)" },
  { id: "harmattan", title: "Harmattan wind", artist: "December, Accra", src: "/os/music/harmattan.mp3", tone: "linear-gradient(160deg,#b8864f,#5a3a1c)" },
  { id: "fan", title: "Ceiling fan, 2 a.m.", artist: "Deploy night", src: "/os/music/fan.mp3", tone: "linear-gradient(160deg,#4b4f58,#1d1f24)" },
];

export interface Kit {
  id: string;
  name: string;
  line: string;
  includes: string[];
  weeks: string;
  proof: { label: string; href: string }[];
  tone: string;
}

/** Packaged starting points for clients. No prices: every business is scoped on a call. */
export const KITS: Kit[] = [
  {
    id: "pos",
    name: "POS kit",
    line: "A register your staff learn in a morning, stock that matches the shelf.",
    includes: ["Point of sale with a cashier queue", "Products, stock and counts", "Receipts printed and on WhatsApp", "Owner dashboard", "Staff training day"],
    weeks: "3 to 5 weeks",
    proof: [{ label: "Al Boyut", href: "/work/al-boyut" }, { label: "Jireh", href: "/work/jireh" }],
    tone: "linear-gradient(160deg,#ff8a3c,#e2480f)",
  },
  {
    id: "storefront",
    name: "Storefront kit",
    line: "A shop that sells in two markets and closes on WhatsApp.",
    includes: ["Catalogue and product pages", "Prices per market, not converted", "Bag to WhatsApp order", "Google Business Profile", "Launch photography direction"],
    weeks: "2 to 4 weeks",
    proof: [{ label: "Zaina's Couture", href: "/work/zainas" }, { label: "Muna Muse", href: "/work/munamuse" }],
    tone: "linear-gradient(160deg,#c084fc,#7c3aed)",
  },
  {
    id: "erp",
    name: "Odoo / ERP kit",
    line: "Recipes, purchasing and stock that reconcile, with workings an auditor can follow.",
    includes: ["Process mapping on site", "Odoo setup or a custom build", "Bills of materials and unit conversions", "Data migration", "Count sessions and reconciliation"],
    weeks: "4 to 8 weeks",
    proof: [{ label: "Delish", href: "/work/enterprise-erp" }],
    tone: "linear-gradient(160deg,#34d399,#047857)",
  },
  {
    id: "analyst",
    name: "Analyst kit",
    line: "A model that shows the downside first, and a deck an investment committee reads.",
    includes: ["Three-statement model", "Scenario and shock testing", "Covenant and DSCR checks", "Due diligence pack", "Board-ready summary"],
    weeks: "1 to 3 weeks",
    proof: [{ label: "Ethika", href: "/work/ethika" }, { label: "The model in the Lab", href: "/lab/model" }],
    tone: "linear-gradient(160deg,#60a5fa,#1d4ed8)",
  },
  {
    id: "brand",
    name: "Brand launch kit",
    line: "A name, a look and a launch film people want to share.",
    includes: ["Positioning and naming", "Identity and packaging", "Art-directed photography", "Scroll film and social cuts", "Launch copy"],
    weeks: "3 to 6 weeks",
    proof: [{ label: "Bloom Boba", href: "/work/bloom-boba" }],
    tone: "linear-gradient(160deg,#fb7185,#be123c)",
  },
];

export const PRESS_FILES = [
  { name: "aadam-press-kit.zip", href: "/press/aadam-press-kit.zip", kind: "zip" as FileKind, note: "Everything below in one file" },
  { name: "aadam-one-pager.pdf", href: "/press/aadam-one-pager.pdf", kind: "pdf" as FileKind, note: "Bio, work, facts, colours" },
  { name: "aadam-logo.svg", href: "/press/aadam-logo.svg", kind: "image" as FileKind, note: "Wordmark, vector" },
  { name: "aadam-logo.png", href: "/press/aadam-logo.png", kind: "image" as FileKind, note: "Wordmark, transparent PNG" },
  { name: "bio-short.txt", href: "/press/bio-short.txt", kind: "text" as FileKind, note: "One paragraph" },
  { name: "bio-long.txt", href: "/press/bio-long.txt", kind: "text" as FileKind, note: "The full story" },
  { name: "colours.txt", href: "/press/colours.txt", kind: "text" as FileKind, note: "Hex values" },
];
