/**
 * Everything the Rockmotion lab and its "Try it" replica share. Ports,
 * destinations, port-to-port transit times, shipping methods, vehicle types,
 * insurance and terms are Rockmotion's own (from their site's source). The
 * money figures are examples a visitor edits: Rockmotion quotes prices one
 * by one, and duty is set by the destination, so nothing here states either.
 */
import { WORLD } from "./worldmap";
import { withCheckDigit } from "./vin";

export type Method = "roro" | "container";

/** Rockmotion's two methods, in their words. */
export const METHODS: Record<Method, { label: string; short: string; copy: string; best: string; tag: string; loading: number }> = {
  roro: {
    label: "RORO Shipping",
    short: "RoRo",
    copy: "Roll-on/Roll-off. The most common and cost-effective method. Your vehicle is driven onto a vessel and secured in the car deck.",
    best: "Standard vehicles & SUVs",
    tag: "Industry standard",
    loading: 0,
  },
  container: {
    label: "Container Shipping",
    short: "Container",
    copy: "Your vehicle is loaded inside a 20ft or 40ft steel container. Maximum protection, ideal for high-value and exotic vehicles.",
    best: "Exotic & luxury vehicles",
    tag: "+5 days loading",
    loading: 5,
  },
};

export const HQ = { name: "Atlanta, GA", lat: 33.75, lon: -84.39 };

export interface UsPort {
  id: string;
  name: string;
  short: string;
  lat: number;
  lon: number;
  /** Road distance from Atlanta, for the example trucking figure. */
  km: number;
}

/** The US ports Rockmotion's inventory ships from. */
export const US_PORTS: UsPort[] = [
  { id: "baltimore", name: "Port of Baltimore", short: "Baltimore", lat: 39.26, lon: -76.56, km: 1090 },
  { id: "newjersey", name: "Port of New Jersey", short: "New Jersey", lat: 40.68, lon: -74.15, km: 1390 },
  { id: "newyork", name: "Port of New York", short: "New York", lat: 40.64, lon: -74.02, km: 1400 },
  { id: "houston", name: "Port of Houston", short: "Houston", lat: 29.73, lon: -95.02, km: 1270 },
  { id: "losangeles", name: "Port of Los Angeles", short: "Los Angeles", lat: 33.73, lon: -118.26, km: 3500 },
];

export interface Destination {
  id: string;
  country: string;
  flag: string;
  port: string;
  lat: number;
  lon: number;
  /** Rockmotion's port-to-port transit time, in days. */
  days: [number, number];
  /** Example RoRo freight for a sedan, USD. Rockmotion quotes the real figure. */
  freight: number;
  currency: string;
  /** Example rate, local currency per USD. The visitor sets today's. */
  rate: number;
}

/** Rockmotion's destination list and transit times, as on their shipping page. */
export const DESTINATIONS: Destination[] = [
  { id: "tema", country: "Ghana", flag: "🇬🇭", port: "Tema Port", lat: 5.63, lon: 0.01, days: [30, 40], freight: 1600, currency: "GHS", rate: 11 },
  { id: "lagos", country: "Nigeria", flag: "🇳🇬", port: "Apapa Port, Lagos", lat: 6.44, lon: 3.37, days: [35, 45], freight: 1700, currency: "NGN", rate: 1550 },
  { id: "jebelali", country: "United Arab Emirates", flag: "🇦🇪", port: "Port of Jebel Ali", lat: 25.01, lon: 55.06, days: [20, 28], freight: 1900, currency: "AED", rate: 3.6725 },
  { id: "southampton", country: "United Kingdom", flag: "🇬🇧", port: "Port of Southampton", lat: 50.9, lon: -1.42, days: [12, 18], freight: 1300, currency: "GBP", rate: 0.76 },
  { id: "melbourne", country: "Australia", flag: "🇦🇺", port: "Port of Melbourne", lat: -37.84, lon: 144.92, days: [25, 35], freight: 2400, currency: "AUD", rate: 1.52 },
  { id: "jeddah", country: "Saudi Arabia", flag: "🇸🇦", port: "Port of Jeddah", lat: 21.47, lon: 39.17, days: [18, 25], freight: 1900, currency: "SAR", rate: 3.75 },
  { id: "yokohama", country: "Japan", flag: "🇯🇵", port: "Port of Yokohama", lat: 35.45, lon: 139.65, days: [22, 30], freight: 2200, currency: "JPY", rate: 150 },
  { id: "bremerhaven", country: "Germany", flag: "🇩🇪", port: "Port of Bremerhaven", lat: 53.55, lon: 8.58, days: [14, 20], freight: 1350, currency: "EUR", rate: 0.86 },
  { id: "halifax", country: "Canada", flag: "🇨🇦", port: "Port of Halifax", lat: 44.64, lon: -63.57, days: [8, 14], freight: 900, currency: "CAD", rate: 1.38 },
  { id: "durban", country: "South Africa", flag: "🇿🇦", port: "Port of Durban", lat: -29.87, lon: 31.03, days: [28, 38], freight: 2100, currency: "ZAR", rate: 18 },
  { id: "singapore", country: "Singapore", flag: "🇸🇬", port: "Port of Singapore", lat: 1.26, lon: 103.84, days: [22, 30], freight: 2200, currency: "SGD", rate: 1.3 },
  { id: "lehavre", country: "France", flag: "🇫🇷", port: "Port of Le Havre", lat: 49.48, lon: 0.11, days: [12, 18], freight: 1350, currency: "EUR", rate: 0.86 },
];

export type Vehicle = "sedan" | "suv" | "pickup" | "van" | "exotic" | "motorcycle";

/** Rockmotion's vehicle types, with an example freight factor against a sedan. */
export const VEHICLES: { id: Vehicle; label: string; factor: number }[] = [
  { id: "sedan", label: "Sedan / Coupe", factor: 1 },
  { id: "suv", label: "SUV / Crossover", factor: 1.2 },
  { id: "pickup", label: "Pickup Truck", factor: 1.35 },
  { id: "van", label: "Van / Minivan", factor: 1.35 },
  { id: "exotic", label: "Exotic / Supercar", factor: 1.1 },
  { id: "motorcycle", label: "Motorcycle", factor: 0.45 },
];

/** Rockmotion's marine cover, included in every shipment. */
export const INSURANCE = "All-risk marine cover (Institute Cargo Clauses A) for 100% of the invoice, port to port, included in every shipment";

/** Example shipping charge (freight with insurance included), USD. */
export const shippingFor = (d: Destination, m: Method, v: Vehicle) =>
  Math.round((d.freight * (m === "container" ? 1.4 : 1) * (VEHICLES.find((x) => x.id === v)?.factor ?? 1)) / 10) * 10;

/** Example trucking from Atlanta to the port: a dispatch fee plus a rate per km. */
export const truckingFor = (p: UsPort) => Math.round((150 + p.km * 0.55) / 10) * 10;

/** The stages from purchase to your port. "At sea" is Rockmotion's figure; the rest are typical ranges. */
export function timeline(d: Destination, p: UsPort, m: Method) {
  const road: [number, number] = p.km > 2000 ? [4, 8] : [2, 5];
  return [
    { id: "verified", label: "Sourced and verified", note: "VIN history, Carfax report and crash analysis before you commit", days: [2, 5] as [number, number] },
    { id: "trucked", label: `Trucked to ${p.short}`, note: `From the seller to the ${p.name}`, days: road },
    { id: "papers", label: "Export documents", note: "Title, bill of sale and the export declaration (EEI, filed through AES)", days: [3, 7] as [number, number] },
    { id: "loaded", label: m === "roro" ? "Driven on board" : "Loaded in a container", note: "Marine insurance included: all-risk, 100% of the invoice", days: [0 + METHODS[m].loading, 1 + METHODS[m].loading] as [number, number] },
    { id: "sea", label: "At sea", note: `${d.days[0]} to ${d.days[1]} days port to port, tracked`, days: d.days },
    { id: "landed", label: "At your port", note: "Customs, duties and port handling are yours; Rockmotion supplies the documents", days: [3, 10] as [number, number] },
  ];
}

export function totalDays(d: Destination, p: UsPort, m: Method): [number, number] {
  return timeline(d, p, m).reduce<[number, number]>((a, s) => [a[0] + s.days[0], a[1] + s.days[1]], [0, 0]);
}

// ---------- map ----------

export function project(lat: number, lon: number): [number, number] {
  const { box, w, h } = WORLD;
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

/**
 * A small network of sea lanes. Routes take the shortest way through it.
 * PACW and PACE are the two edges of the map: a Pacific crossing leaves on
 * the left and comes back in on the right.
 */
const NODES: Record<string, [number, number]> = {
  CHES: [36.9, -75.6], NYB: [40.2, -73.4], EAO: [37.5, -69], HFX: [43.9, -62.8],
  GUL: [26.5, -90], YUC: [21.8, -85.9], FLS: [24.0, -81.6], BAH: [27.2, -77.2],
  CAR: [15, -77], PANC: [9.6, -79.9], PANP: [8.4, -79.6], MEXP: [14.5, -96], BAJ: [22.6, -110.6], LAO: [32.9, -119.2],
  PACW_N: [33.5, -130], PACE_N: [34.0, 160], PACW_S: [5, -130], PACE_S: [-27, 160],
  NAT: [45, -40], ENG: [49.2, -6], CHN: [50.3, -0.8], DOV: [51.0, 1.6], NSE: [53.9, 6.8],
  MAT: [24, -45], CVE: [14, -24], GOG: [3.8, -2.5],
  SAT: [-10, -18], CAPE: [-35.4, 18.6], AGU: [-34.6, 26.5],
  GIB: [35.9, -6.2], MED: [37.2, 12], SUN: [31.4, 32.4], SUS: [29.6, 32.6], RED: [20.5, 38.4], BAB: [12.6, 43.5], ARB: [14, 56], HRM: [26.4, 56.6],
  IND: [5.8, 80.5], MAL: [4.2, 99.3], SCS: [11, 112], LUZ: [20.2, 121], JPS: [31, 136],
  SIO: [-25, 95], LEE: [-35.6, 114.5], BAS: [-39.4, 146],
};

const LANES: [string, string][] = [
  ["CHES", "EAO"], ["NYB", "EAO"], ["EAO", "HFX"], ["EAO", "BAH"], ["EAO", "NAT"], ["EAO", "MAT"], ["HFX", "NAT"],
  ["GUL", "FLS"], ["GUL", "YUC"], ["FLS", "BAH"], ["YUC", "CAR"], ["BAH", "CAR"], ["BAH", "MAT"], ["CAR", "PANC"], ["CAR", "MAT"], ["CAR", "SAT"],
  ["PANC", "PANP"], ["PANP", "MEXP"], ["MEXP", "BAJ"], ["BAJ", "LAO"], ["PANP", "PACW_S"],
  ["LAO", "PACW_N"], ["LAO", "PACW_S"], ["PACW_N", "PACE_N"], ["PACW_S", "PACE_S"], ["PACE_N", "JPS"], ["PACE_N", "LUZ"], ["PACE_S", "BAS"],
  ["NAT", "ENG"], ["ENG", "CHN"], ["CHN", "DOV"], ["DOV", "NSE"], ["NAT", "GIB"], ["MAT", "GIB"], ["MAT", "CVE"], ["CVE", "GOG"], ["CVE", "SAT"], ["GOG", "SAT"],
  ["SAT", "CAPE"], ["CAPE", "AGU"], ["AGU", "SIO"], ["SIO", "LEE"], ["SIO", "MAL"], ["LEE", "BAS"], ["AGU", "ARB"],
  ["GIB", "MED"], ["MED", "SUN"], ["SUN", "SUS"], ["SUS", "RED"], ["RED", "BAB"], ["BAB", "ARB"], ["ARB", "HRM"], ["ARB", "IND"], ["IND", "MAL"], ["MAL", "SCS"], ["SCS", "LUZ"], ["LUZ", "JPS"],
];

/** Where each port joins the lanes. */
const JOIN: Record<string, string[]> = {
  baltimore: ["CHES"], newjersey: ["NYB"], newyork: ["NYB"], houston: ["GUL"], losangeles: ["LAO"],
  tema: ["GOG"], lagos: ["GOG"], jebelali: ["HRM"], southampton: ["CHN"], melbourne: ["BAS"], jeddah: ["RED"],
  yokohama: ["JPS", "PACE_N"], bremerhaven: ["NSE"], halifax: ["HFX"], durban: ["AGU"], singapore: ["MAL"], lehavre: ["CHN"],
};

function km(a: [number, number], b: [number, number]) {
  const r = Math.PI / 180;
  const h = Math.sin(((b[0] - a[0]) * r) / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(((b[1] - a[1]) * r) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

/** The edge-to-edge Pacific hop is the open ocean between the map's two sides. */
const hop = (a: string, b: string) => {
  const pair = [a, b].sort().join("|");
  if (pair === "PACE_N|PACW_N") return 4200;
  if (pair === "PACE_S|PACW_S") return 6500;
  return km(NODES[a], NODES[b]);
};

/**
 * The sea route from a US port to a destination, as map segments: one
 * segment, or two when it crosses the Pacific off the edge of the map.
 */
export function seaRoute(from: UsPort, to: Destination): [number, number][][] {
  const graph = new Map<string, string[]>();
  for (const [a, b] of LANES) {
    graph.set(a, [...(graph.get(a) ?? []), b]);
    graph.set(b, [...(graph.get(b) ?? []), a]);
  }
  const dist = new Map<string, number>();
  const prev = new Map<string, string>();
  const todo = new Set(Object.keys(NODES));
  for (const s of JOIN[from.id]) dist.set(s, km([from.lat, from.lon], NODES[s]));
  while (todo.size) {
    let u: string | null = null;
    for (const n of todo) if (dist.has(n) && (u === null || dist.get(n)! < dist.get(u)!)) u = n;
    if (u === null) break;
    todo.delete(u);
    for (const v of graph.get(u) ?? []) {
      const alt = dist.get(u)! + hop(u, v);
      if (alt < (dist.get(v) ?? Infinity)) {
        dist.set(v, alt);
        prev.set(v, u);
      }
    }
  }
  const end = JOIN[to.id].reduce((best, n) => ((dist.get(n) ?? Infinity) + km(NODES[n], [to.lat, to.lon]) < (dist.get(best) ?? Infinity) + km(NODES[best], [to.lat, to.lon]) ? n : best));
  const names: string[] = [];
  for (let n: string | undefined = end; n; n = prev.get(n)) names.unshift(n);
  const segs: [number, number][][] = [[[from.lat, from.lon]]];
  names.forEach((n, i) => {
    const last = names[i - 1];
    if (last && /^PAC[WE]_/.test(last) && /^PAC[WE]_/.test(n)) segs.push([]);
    segs[segs.length - 1].push(NODES[n]);
  });
  segs[segs.length - 1].push([to.lat, to.lon]);
  return segs;
}

/** The road leg from Atlanta to the port (straight across the map). */
export const roadRoute = (p: UsPort): [number, number][] => [[HQ.lat, HQ.lon], [(HQ.lat + p.lat) / 2 + 0.6, (HQ.lon + p.lon) / 2], [p.lat, p.lon]];

// ---------- landed cost ----------

export interface CostInput {
  price: number;
  /** Trucking to the US port. */
  inland: number;
  /** Rockmotion's shipping charge, marine insurance included. */
  shipping: number;
  /** Duty and taxes, % of the CIF value. The visitor enters the rate. */
  duty: number;
  /** Destination port handling, agent and clearing. */
  port: number;
}

export function landedCost(c: CostInput) {
  // CIF: what the car cost to put on your quay (car, trucking, shipping with insurance)
  const cif = c.price + c.inland + c.shipping;
  const duty = (cif * c.duty) / 100;
  const parts = [
    { id: "car", label: "Car", usd: c.price },
    { id: "inland", label: "Truck to the US port", usd: c.inland },
    { id: "shipping", label: "Shipping, insurance included", usd: c.shipping },
    { id: "duty", label: "Duty and taxes", usd: duty },
    { id: "port", label: "Port handling and clearing", usd: c.port },
  ];
  return { parts, cif, total: parts.reduce((a, p) => a + p.usd, 0) };
}

export const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
export const money = (n: number, cur: string) => `${cur} ${Math.round(n).toLocaleString("en-US")}`;

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
