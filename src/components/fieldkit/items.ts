/**
 * Real items, names and prices as they appear in the shipped systems
 * (captures in /public/previews and the walkthrough recordings).
 * Images are cropped by scripts/fieldkit-assets.mjs into /public/fieldkit.
 * Stock levels in the demo register are sample numbers; everything else is real.
 */

const img = (name: string) => `/fieldkit/${name}.webp`;

/* Al Boyut POS register, rebuilt on the current light register. Public catalogue names, prices and units only;
   the salesperson and session are sample values, never a real member of staff. */
export const ALBOYUT = {
  logo: img("logo-alboyut"),
  session: "Demo/00001",
  salesperson: "Ama",
  /** Category counts from the live catalogue. */
  categories: [
    { id: "all", label: "All", count: 1087 },
    { id: "cement", label: "Cement & Concrete", count: 12 },
    { id: "pipes", label: "Plumbing Pipes", count: 40 },
    { id: "fittings", label: "Plumbing Fittings", count: 287 },
    { id: "hardware", label: "Hardware & Fasteners", count: 131 },
  ],
  /** Below this the card shows "Low stock", as on the register. */
  alertAt: 10,
  items: [
    { id: "empire325", name: "Empire Cement 32.5R", price: 84, unit: "bag", cat: "cement", img: img("pos-empire-325"), stock: 14 },
    { id: "dzata", name: "Dzata Cement", price: 106, unit: "bag", cat: "cement", img: img("pos-dzata"), stock: 11 },
    { id: "bend34", name: '3/4" PVC Bend', price: 3, unit: "pc", cat: "fittings", img: img("pos-pvc-bend-34"), stock: 96 },
    { id: "dovepop", name: "Dove POP", price: 78, unit: "bag", cat: "cement", img: img("pos-dove-pop"), stock: 8 },
    { id: "nail3", name: 'Wall Nail 3" (box)', price: 20, unit: "box", cat: "hardware", img: img("pos-wall-nail"), stock: 40 },
    { id: "pipe12", name: 'Interplast 1/2" Pipe', price: 39, unit: "length", cat: "pipes", img: img("pos-interplast-12"), stock: 31 },
    { id: "empire425", name: "Empire Cement 42.5R", price: 106, unit: "bag", cat: "cement", img: img("pos-empire-425"), stock: 12 },
    { id: "bend12", name: '1/2" PVC Bend', price: 2, unit: "pc", cat: "fittings", img: img("pos-pvc-bend-12"), stock: 120 },
  ],
} as const;

/* An-Nur Royal Laundry counter (an-nur-laundry.mp4) */
export const ANNUR = {
  logo: img("logo-annur"),
  services: ["Wash + iron", "Wash only", "Iron only", "Dry cleaning"],
  /** Wash + iron prices from the counter catalogue. `from` marks "from GHS" prices. */
  garments: [
    { id: "tshirt", name: "T-shirt", price: 10, img: img("wash-tshirt") },
    { id: "shirt", name: "Shirt", price: 12, img: img("wash-shirt") },
    { id: "trouser", name: "Trouser", price: 12, img: img("wash-trouser") },
    { id: "jalbab", name: "Jalbab", price: 15, from: true, img: img("wash-jalbab") },
    { id: "smock", name: "Smock", price: 20, img: img("wash-smock") },
    { id: "agbada", name: "Three piece (agbada)", price: 40, img: img("wash-agbada") },
    { id: "suit", name: "Suit", price: 30, img: img("wash-suit") },
    { id: "bedsheet", name: "Bed sheet", price: 15, img: img("wash-bedsheet") },
  ],
  /** Workstation board columns, in order, with their real icons. */
  stages: [
    { id: "received", name: "Received", img: img("stage-received") },
    { id: "washing", name: "Washing", img: img("stage-washing") },
    { id: "drying", name: "Drying", img: img("stage-drying") },
    { id: "ironing", name: "Ironing", img: img("stage-ironing") },
    { id: "quality", name: "Quality check", img: img("stage-quality") },
    { id: "ready", name: "Ready", img: img("stage-ready") },
  ],
} as const;

/* Zaina's Couture shop (zainas-ops.mp4) */
export const ZAINAS = {
  items: [
    { id: "amara", name: "Amara Satin Slip", price: 340, note: "Blush satin, floral print, side cutouts.", img: img("zainas-amara") },
    { id: "naa", name: "Naa Corset Midi", price: 395, was: 460, note: "Boned bodice, walkable skirt.", low: true, img: img("zainas-naa") },
    { id: "sika", name: "Sika Mesh Maxi", price: 310, note: "Black maxi, spaghetti straps, high slit.", low: true, img: img("zainas-sika") },
    { id: "efe", name: "Efe Linen Shirt Dress", price: 285, note: "The one you'll wear to everything.", img: img("zainas-efe") },
  ],
  sizes: ["S", "M", "L", "XL", "XXL"],
} as const;

/* Muna Muse product page (munamuse/product.webp) */
export const MUNAMUSE = {
  product: {
    name: "Emerald Feather Kaftan",
    /** Set per market on the live site, not converted. */
    price: { GHS: 1220, USD: 98 },
    note: "A feather-frond print in teal on near-black, set so the pattern chevrons out from the centre seam. Dropped waist, gathered skirt, sleeves that blouson into a tie.",
    sizes: ["6", "8", "10", "12", "14", "16", "18", "20", "22", "24"],
    img: img("munamuse-emerald"),
  },
} as const;

/* Delish on Odoo 19 (delish/menu.webp + enterprise-erp.webp) */
export const DELISH = {
  launcher: "/images/projects/enterprise-erp.webp",
  dish: { name: "Jollof rice with chicken", img: img("delish-jollof") },
} as const;

export const MADINA = { court: img("madina-court") } as const;
