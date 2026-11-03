/** One source for services: the Services section, Aadam OS (Services.notes) and the phone's Notes app. */

export interface Service {
  n: string;
  key: "strategy" | "build" | "data" | "brand" | "growth" | "erp";
  title: string;
  short: string;
  body: string;
  meta: string;
  proof?: { label: string; href: string };
}

export const SERVICES: Service[] = [
  {
    n: "01",
    key: "strategy",
    title: "Product strategy & architecture",
    short: "From a vague brief to a plan you can ship.",
    body: "I start by sitting in: how the work really happens, where money and stock leak, what the team actually needs. Then a concrete product plan: business model, information architecture and the shortest path to something shippable.",
    meta: "Discovery · IA · Technical planning",
  },
  {
    n: "02",
    key: "build",
    title: "Design & engineering",
    short: "Editorial interfaces, production code, shipped weekly.",
    body: "Editorial-grade interfaces and production-grade code from the same hands. Web and mobile in Next.js, TypeScript and Postgres. Shipped weekly, accessible by default, documented so your team can carry it.",
    meta: "Web · Mobile · Interface systems",
    proof: { label: "PrimeTijara", href: "/work/primetijara" },
  },
  {
    n: "03",
    key: "data",
    title: "Data & business analysis",
    short: "Turning spreadsheets and gut-feel into decisions.",
    body: "Cash flow, cohort behaviour, funnel diagnostics, P&L reconstruction. Dashboards that answer the question the owner keeps asking, and numbers you can defend in a board room.",
    meta: "Modelling · Dashboards · Diligence",
  },
  {
    n: "04",
    key: "brand",
    title: "Brand, content & motion",
    short: "Art direction, copy, packaging and motion films.",
    body: "Identity, copywriting, packaging and art-directed photography, plus motion: scroll films, product videos and launch reels. Bloom Boba is the proof on the shelf; Yeskoko packaging is on the bench.",
    meta: "Identity · Copy · Packaging · Motion video",
    proof: { label: "Bloom Boba", href: "/work/bloom-boba" },
  },
  {
    n: "05",
    key: "growth",
    title: "Digital marketing & growth",
    short: "Launches, SEO, paid and email, built into the product.",
    body: "Positioning, launch campaigns, SEO, paid acquisition, email and content loops. Treated as part of the product from day one, not bolted on after launch.",
    meta: "SEO · Paid · Email · Content",
  },
  {
    n: "06",
    key: "erp",
    title: "ERP & operations: Odoo or custom",
    short: "One source of truth for stock, sales and cash.",
    body: "Replace disconnected spreadsheets and failing POS systems with one source of truth. Odoo configuration and custom modules, data migration and staff training, or a custom system built from scratch.",
    meta: "Odoo · Custom ERP · Migration",
    proof: { label: "Al Boyut", href: "/work/al-boyut" },
  },
];

/** The forward-deployed method: how an engagement actually runs. */
export const METHOD = [
  { step: "Sit in", line: "Shadow the floor, the counter, the finance desk." },
  { step: "Study", line: "Map how money, stock and people really move." },
  { step: "Document", line: "Write it down: flows, specs, decisions." },
  { step: "Build", line: "Ship weekly, in front of the people who use it." },
  { step: "Monitor", line: "Watch the numbers and the floor after launch." },
  { step: "Hand over", line: "Runbooks and training so your team owns it." },
];

/** How remote work runs, for clients outside Ghana. */
export const REMOTE = [
  { k: "GMT+0", v: "Full European workday overlap, US East mornings" },
  { k: "Weekly", v: "Live demo every week, written update every Friday" },
  { k: "Written", v: "Specs, decisions and runbooks your team keeps" },
  { k: "On site", v: "Embedded in person for launches when it matters" },
];
