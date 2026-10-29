import data from "../../../public/desk/plates/screens.json";

/** The desk is a Blender render; these are its screens and hotspots in render pixels. */
export type ScreenId = "left" | "center" | "right";
export type HotspotId = "lamp" | "books" | "coffee" | "phone" | "notebook";
export type View = "desktop" | "phone";
export type Pt = [number, number];
export interface PlateData {
  w: number;
  h: number;
  screens: Record<ScreenId, Pt[]>;
  hotspots: Record<HotspotId, Pt>;
}

export const PLATES = data as unknown as Record<View, PlateData>;

/** Where the crop sits when the plate is wider or taller than its box (object-position). */
export const FOCUS: Record<View, Pt> = { desktop: [0.9, 0.55], phone: [0.5, 0.62] };

const WIDTHS: Record<View, number[]> = { desktop: [1280, 1920, 2560], phone: [800, 1200] };
export const srcset = (view: View, phase: "day" | "night", ext: "avif" | "webp") =>
  WIDTHS[view].map((w) => `/desk/plates/${view}-${phase}-${w}.${ext} ${w}w`).join(", ");
export const fallback = (view: View, phase: "day" | "night") => `/desk/plates/${view}-${phase}-${WIDTHS[view][1] ?? WIDTHS[view][0]}.webp`;

/** The cover fit of the plate in a box: scale and offset, matching CSS object-fit: cover. */
export function coverFit(view: View, cw: number, ch: number) {
  const p = PLATES[view];
  const k = Math.max(cw / p.w, ch / p.h);
  const [fx, fy] = FOCUS[view];
  return { k, x: (cw - p.w * k) * fx, y: (ch - p.h * k) * fy };
}

export const toBox = (fit: { k: number; x: number; y: number }, [x, y]: Pt): Pt => [fit.x + x * fit.k, fit.y + y * fit.k];

/**
 * CSS matrix3d that maps a w x h element onto a quad (TL, TR, BR, BL),
 * so a live screen lands exactly on the rendered one.
 */
export function quadMatrix(w: number, h: number, q: Pt[]) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = den ? (dx3 * dy2 - dx2 * dy3) / den : 0;
  const hh = den ? (dx1 * dy3 - dx3 * dy1) / den : 0;
  const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, c = x0;
  const d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3, f = y0;
  // unit square -> quad, then scale the element's w x h down to the unit square
  const m = [a / w, d / w, 0, g / w, b / h, e / h, 0, hh / h, 0, 0, 1, 0, c, f, 0, 1];
  return `matrix3d(${m.map((v) => +v.toFixed(8)).join(",")})`;
}

export function bounds(q: Pt[]) {
  const xs = q.map((p) => p[0]), ys = q.map((p) => p[1]);
  const x = Math.min(...xs), y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y, cx: (Math.min(...xs) + Math.max(...xs)) / 2, cy: (Math.min(...ys) + Math.max(...ys)) / 2 };
}
