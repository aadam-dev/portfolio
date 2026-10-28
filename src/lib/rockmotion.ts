/**
 * Everything the Rockmotion lab and its "Try it" replica share: where a car
 * leaves from, where it lands, what an inspector checks, and how the landed
 * cost adds up. Times and prices are examples for a direct sailing, to be
 * replaced by a real quote; nothing here states duty law.
 */
import { ATLANTIC } from "./atlantic";
import { withCheckDigit } from "./vin";

export type Shipping = "roro" | "container";
export type Body = "sedan" | "suv" | "pickup";

export const LOT = { name: "Atlanta, GA", lat: 33.75, lon: -84.39 };

/** RoRo cars roll on at Brunswick (Colonel's Island); containers load at Savannah (Garden City). */
export const US_PORT: Record<Shipping, { name: string; lat: number; lon: number; inlandKm: number }> = {
  roro: { name: "Brunswick, GA", lat: 31.15, lon: -81.49, inlandKm: 450 },
  container: { name: "Savannah, GA", lat: 32.08, lon: -81.09, inlandKm: 400 },
};

export interface Destination {
  id: string;
  port: string;
  country: string;
  lat: number;
  lon: number;
  /** Typical days at sea on a direct sailing. */
  sea: [number, number];
  /** Example ocean freight in USD for a sedan. */
  freight: Record<Shipping, number>;
  currency: string;
  /** Example rate, units of local currency per USD. Edit to today's. */
  rate: number;
  /** Ocean waypoints after leaving the US coast, [lat, lon]. */
  via: [number, number][];
}

const WEST_AFRICA: [number, number][] = [
  [29, -72],
  [21, -48],
  [12, -26],
  [5.5, -12],
];

export const DESTINATIONS: Destination[] = [
  { id: "tema", port: "Tema", country: "Ghana", lat: 5.63, lon: 0.01, sea: [25, 40], freight: { roro: 1550, container: 2150 }, currency: "GHS", rate: 11, via: WEST_AFRICA },
  { id: "lagos", port: "Lagos", country: "Nigeria", lat: 6.43, lon: 3.37, sea: [28, 45], freight: { roro: 1650, container: 2300 }, currency: "NGN", rate: 1550, via: WEST_AFRICA },
  { id: "cotonou", port: "Cotonou", country: "Benin", lat: 6.35, lon: 2.43, sea: [28, 42], freight: { roro: 1500, container: 2100 }, currency: "XOF", rate: 565, via: WEST_AFRICA },
  { id: "lome", port: "Lomé", country: "Togo", lat: 6.13, lon: 1.28, sea: [25, 40], freight: { roro: 1500, container: 2100 }, currency: "XOF", rate: 565, via: WEST_AFRICA },
  { id: "abidjan", port: "Abidjan", country: "Côte d'Ivoire", lat: 5.29, lon: -4.01, sea: [22, 35], freight: { roro: 1500, container: 2100 }, currency: "XOF", rate: 565, via: WEST_AFRICA.slice(0, 3) },
  { id: "rotterdam", port: "Rotterdam", country: "Netherlands", lat: 51.95, lon: 4.14, sea: [12, 20], freight: { roro: 1250, container: 1700 }, currency: "EUR", rate: 0.86, via: [[34, -66], [43, -38], [48.6, -8], [50.1, -1.5]] },
];

export const BODIES: { id: Body; label: string; roro: number; container: number }[] = [
  { id: "sedan", label: "Sedan", roro: 1, container: 1 },
  { id: "suv", label: "SUV", roro: 1.25, container: 1.1 },
  { id: "pickup", label: "Pickup", roro: 1.4, container: 1.2 },
];

export const freightFor = (d: Destination, s: Shipping, b: Body) =>
  Math.round((d.freight[s] * (BODIES.find((x) => x.id === b)?.[s] ?? 1)) / 10) * 10;

/** The stages after purchase, with typical days for each. */
export function timeline(d: Destination) {
  return [
    { id: "verified", label: "Verified", note: "VIN, history and inspection done", days: [1, 3] as [number, number] },
    { id: "trucked", label: "Trucked to port", note: "Carrier from the lot to the terminal", days: [1, 4] as [number, number] },
    { id: "cleared", label: "US export clearance", note: "Title and documents filed with US Customs at least 72 hours before loading", days: [3, 10] as [number, number] },
    { id: "loaded", label: "Loaded and insured", note: "Marine insurance starts as the car goes on board", days: [0, 1] as [number, number] },
    { id: "sea", label: "At sea", note: "Tracked to the destination port", days: d.sea },
    { id: "landed", label: "Landed and cleared", note: "Port handling, duty and release", days: [3, 10] as [number, number] },
  ];
}

export function totalDays(d: Destination): [number, number] {
  return timeline(d).reduce<[number, number]>((a, s) => [a[0] + s.days[0], a[1] + s.days[1]], [0, 0]);
}

// ---------- map ----------

export function project(lat: number, lon: number): [number, number] {
  const { box, w, h } = ATLANTIC;
  return [((lon - box.west) / (box.east - box.west)) * w, ((box.north - lat) / (box.north - box.south)) * h];
}

/** A smooth path (Catmull-Rom as cubic Béziers) through the route's points. */
export function routePath(points: [number, number][]) {
  const p = points.map(([la, lo]) => project(la, lo));
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] ?? p[i];
    const b = p[i];
    const c = p[i + 1];
    const e = p[i + 2] ?? c;
    const c1 = [b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6];
    const c2 = [c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${c[0].toFixed(1)} ${c[1].toFixed(1)}`;
  }
  return d;
}

export function seaRoute(d: Destination, s: Shipping): [number, number][] {
  const from = US_PORT[s];
  return [[from.lat, from.lon], [from.lat - 0.4, from.lon + 2.2], ...d.via, [d.lat - (d.lat > 20 ? 0 : 0.6), d.lon - (d.lat > 20 ? 1 : 0)], [d.lat, d.lon]];
}

// ---------- landed cost ----------

export interface CostInput {
  price: number;
  inland: number;
  freight: number;
  /** Marine insurance, % of car plus freight. */
  insurance: number;
  /** Duty and taxes, % of CIF value. The visitor enters the rate. */
  duty: number;
  /** Destination port handling, agent and clearing. */
  port: number;
}

export function landedCost(c: CostInput) {
  const insurance = ((c.price + c.freight) * c.insurance) / 100;
  const cif = c.price + c.inland + c.freight + insurance;
  const duty = (cif * c.duty) / 100;
  const parts = [
    { id: "car", label: "Car", usd: c.price },
    { id: "inland", label: "Truck to port", usd: c.inland },
    { id: "freight", label: "Ocean freight", usd: c.freight },
    { id: "insurance", label: "Marine insurance", usd: insurance },
    { id: "duty", label: "Duty and taxes", usd: duty },
    { id: "port", label: "Port and clearing", usd: c.port },
  ];
  return { parts, cif, total: parts.reduce((a, p) => a + p.usd, 0) };
}

/** Example inland trucking: a flat dispatch fee plus a rate per km. */
export const inlandFor = (s: Shipping) => Math.round((150 + US_PORT[s].inlandKm * 0.75) / 10) * 10;

export const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
export const money = (n: number, cur: string) =>
  `${cur} ${Math.round(n).toLocaleString("en-US")}`;

// ---------- VIN samples ----------

/**
 * Sample VINs for cars commonly exported from the US. The first 8
 * characters follow each maker's real pattern; the serials are made up
 * and the check digit is computed, so they decode but belong to no car.
 */
export const SAMPLE_VINS = [
  { label: "Toyota Camry", vin: withCheckDigit("4T1B11HK0KU123456") },
  { label: "Honda Accord", vin: withCheckDigit("1HGCV1F30LA012345") },
  { label: "Ford F-150", vin: withCheckDigit("1FTEW1EP0MFA54321") },
  { label: "Jeep Grand Cherokee", vin: withCheckDigit("1C4RJFBG0LC298765") },
];

// ---------- inspection ----------

export type AreaId = "body" | "engine" | "wheels" | "cabin" | "under";

export interface Area {
  id: AreaId;
  label: string;
  why: string;
  checks: string[];
  /** Where the hotspot sits on the car, in metres. */
  at: [number, number, number];
}

export const AREAS: Area[] = [
  {
    id: "body",
    label: "Body and paint",
    why: "Uneven gaps and fresh paint are the first signs of a repaired crash. Tap a panel to mark it.",
    checks: ["Panel gaps even all round", "Paint depth reads the same on every panel", "No overspray on rubber trim or glass", "All glass carries the same maker stamp"],
    at: [1.16, 0.62, 0.15],
  },
  {
    id: "engine",
    label: "Under the bonnet",
    why: "Leaks and flood damage show here first, and the stamped VIN has to match the title.",
    checks: ["No fluid leaks or fresh wet patches", "Belts and hoses free of cracks", "No silt, mud line or rusted bolts (flood signs)", "Engine-bay VIN matches the title"],
    at: [0, 0.95, 1.95],
  },
  {
    id: "wheels",
    label: "Wheels and brakes",
    why: "Tyres and brakes are cheap to judge from photos and expensive to replace at the other end.",
    checks: ["Tread above 3 mm and even across the tyre", "All four tyres the same make and size", "Discs without a deep lip or scoring", "Pads with life left"],
    at: [1.22, 0.4, 1.48],
  },
  {
    id: "cabin",
    label: "Cabin",
    why: "Wear has to match the mileage, and warning lights tell you what the seller didn't.",
    checks: ["Airbag, ABS and engine lights go out after start", "Pedal, wheel and seat wear match the mileage", "No damp carpet, musty smell or water line", "Windows, locks, AC and screens all work"],
    at: [0.3, 0.95, -0.15],
  },
  {
    id: "under",
    label: "Underneath",
    why: "A bent or welded frame means a serious crash, whatever the paint says.",
    checks: ["Frame rails straight, no kinks or fresh welds", "Rust on the surface only, none through", "Nothing dripping: oil, coolant, fuel", "Exhaust and suspension mounts intact"],
    at: [0, 0.12, 0.2],
  },
];

/** Paintable panels, by the node they hang from in the model. */
export const PANELS: Record<string, string> = {
  BodyHood: "Bonnet",
  BodyDoorLColor1: "Left door",
  BodyDoorRColor1: "Right door",
  BodyRearPanelsColor1: "Rear and tailgate",
  BodyRoofPanel: "Roof",
  BodyPillars: "Pillars and wings",
  BodyPanelsColor2: "Bumpers and sills",
};
