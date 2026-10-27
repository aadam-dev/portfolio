/**
 * The Build desk catalogue and the brief it produces. A brief is a pure
 * function of what the visitor picked, so it is encoded in its own URL
 * (/brief/b-pos.inventory) and can be shared without storing anything.
 */

export type Track = "Brand" | "Web" | "Ops" | "Data";
export const TRACKS: Track[] = ["Brand", "Web", "Ops", "Data"];
export const TRACK_TONE: Record<Track, string> = { Brand: "#e07a9a", Web: "#5fa8d3", Ops: "#ff5b1f", Data: "#a78bfa" };

export interface Service {
  id: string;
  label: string;
  weeks: number;
  track: Track;
  /** A capture of the same thing, shipped for a client. */
  thumb: string | "map";
  /** Where it was shipped. */
  proof: string;
}

export const SERVICES: Service[] = [
  { id: "storefront", label: "Storefront", weeks: 3, track: "Web", thumb: "/previews/alboyut/products.webp", proof: "Al Boyut" },
  { id: "whatsapp", label: "WhatsApp ordering", weeks: 1, track: "Web", thumb: "/previews/zainas/shop.webp", proof: "Zaina's Couture" },
  { id: "pos", label: "POS register", weeks: 3, track: "Ops", thumb: "/previews/jireh/pos.webp", proof: "Jireh, Al Boyut" },
  { id: "inventory", label: "Inventory and stock takes", weeks: 2, track: "Ops", thumb: "/previews/primehub/inventory.webp", proof: "PrimeTijara" },
  { id: "odoo", label: "Odoo ERP", weeks: 4, track: "Ops", thumb: "/images/projects/enterprise-erp.webp", proof: "Delish" },
  { id: "backoffice", label: "Back office and payroll", weeks: 3, track: "Data", thumb: "/previews/jireh/dashboard.webp", proof: "Jireh" },
  { id: "reporting", label: "Data and reporting", weeks: 2, track: "Data", thumb: "/previews/alboyut/sales.webp", proof: "Al Boyut" },
  { id: "model", label: "Financial model", weeks: 2, track: "Data", thumb: "/previews/ethika/tools.webp", proof: "Mirepa, Ethika" },
  { id: "brand", label: "Brand identity", weeks: 2, track: "Brand", thumb: "/previews/alboyut/landing.webp", proof: "Al Boyut, An-Nur" },
  { id: "listing", label: "Google listing and map", weeks: 1, track: "Brand", thumb: "map", proof: "Al Boyut" },
  { id: "i18n", label: "English, French, Arabic", weeks: 1, track: "Web", thumb: "/previews/koyi/madrasah.webp", proof: "Kōyi" },
];

/** Week one is always discovery: sit with the team and map the workflow. */
export const DISCOVERY = 1;

export const ROLES = ["Full-time", "Contract", "Embedded per project"] as const;
export const STARTS = ["Now", "In 2 to 4 weeks", "Next quarter"] as const;
export const STACK = ["TypeScript, Next.js", "Postgres, Drizzle", "Python", "Odoo", "SQL and analytics", "Finance models"] as const;

/** Aadam's working window, in hours GMT (Accra), wide enough to overlap Europe and US East. */
export const MY_HOURS: [number, number] = [8, 20];

export const fmtW = (w: number) => `${Number.isInteger(w) ? w : w.toFixed(1)} wk${w === 1 ? "" : "s"}`;

export interface Lane {
  track: Track;
  segs: (Service & { from: number })[];
  end: number;
}

/** Tracks run in parallel; items within a track run in sequence after discovery. */
export function plan(ids: string[]) {
  const chosen = SERVICES.filter((s) => ids.includes(s.id));
  const lanes: Lane[] = TRACKS.map((track) => {
    let at = DISCOVERY;
    const segs = chosen
      .filter((s) => s.track === track)
      .map((s) => {
        const seg = { ...s, from: at };
        at += s.weeks;
        return seg;
      });
    return { track, segs, end: at };
  });
  const weeks = chosen.length ? Math.max(...lanes.map((l) => l.end)) : 0;
  const serial = DISCOVERY + chosen.reduce((a, s) => a + s.weeks, 0);
  return { chosen, lanes, weeks, serial };
}

/** Overlap in hours between Aadam's window and a 9 to 5 in the visitor's offset. */
export function overlapHours(offset: number) {
  const start = (((9 - offset) % 24) + 24) % 24;
  const end = start + 8;
  const [a, b] = MY_HOURS;
  const one = Math.max(0, Math.min(b, end) - Math.max(a, start));
  const wrapped = Math.max(0, Math.min(b, end - 24) - Math.max(a, start - 24));
  return { start, end, hours: one + wrapped };
}

export type Brief =
  | { kind: "build"; ids: string[] }
  | { kind: "hire"; role: number; start: number; stack: number[] };

export function encodeBrief(b: Brief) {
  if (b.kind === "build") return `b-${b.ids.join(".")}`;
  return `h-${b.role}${b.start}-${b.stack.join("")}`;
}

export function decodeBrief(code: string): Brief | null {
  const c = decodeURIComponent(code);
  if (c.startsWith("b-")) {
    const ids = c.slice(2).split(".").filter((id) => SERVICES.some((s) => s.id === id));
    return ids.length ? { kind: "build", ids: [...new Set(ids)] } : null;
  }
  const m = /^h-(\d)(\d)-(\d*)$/.exec(c);
  if (!m) return null;
  const role = Number(m[1]);
  const start = Number(m[2]);
  if (role >= ROLES.length || start >= STARTS.length) return null;
  const stack = [...new Set(m[3].split("").map(Number))].filter((i) => i < STACK.length);
  return { kind: "hire", role, start, stack };
}
