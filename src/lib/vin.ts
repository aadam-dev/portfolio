/**
 * Vehicle identification numbers (ISO 3779, as used in North America).
 * Decodes the parts that follow the published rules: the check digit,
 * the maker from the first three characters, the model year and the
 * plant code. Everything else needs the maker's own tables, so it is left
 * to a full decoder (NHTSA's vPIC, which the page calls when it can).
 */

const VALUE: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
};
const WEIGHT = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

const value = (c: string) => (/\d/.test(c) ? Number(c) : VALUE[c]);

export function clean(vin: string) {
  return vin.toUpperCase().replace(/[\s-]/g, "");
}

/** The check digit position 9 should hold, or null if a character is not allowed. */
export function checkDigit(vin: string) {
  const v = clean(vin);
  if (v.length !== 17) return null;
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const n = value(v[i]);
    if (n === undefined) return null;
    sum += n * WEIGHT[i];
  }
  const r = sum % 11;
  return r === 10 ? "X" : String(r);
}

/** Who built it: the most common makers whose cars Rockmotion ships, by WMI. */
const WMI: Record<string, string> = {
  "1FA": "Ford", "1FT": "Ford (truck)", "1FM": "Ford (SUV)", "1FD": "Ford (commercial)",
  "1G1": "Chevrolet", "1GC": "Chevrolet (truck)", "1GN": "Chevrolet (SUV)", "1GT": "GMC (truck)", "1GK": "GMC (SUV)", "1G6": "Cadillac", "1GY": "Cadillac (SUV)",
  "1C3": "Chrysler", "1C4": "Chrysler, Dodge or Jeep (SUV)", "1C6": "Ram (truck)", "2C3": "Chrysler (Canada)", "2C4": "Chrysler (Canada)",
  "1J4": "Jeep", "1J8": "Jeep", "1D7": "Dodge (truck)", "2D3": "Dodge (Canada)",
  "4T1": "Toyota (USA)", "4T3": "Toyota (USA)", "5TD": "Toyota (USA, SUV)", "5TF": "Toyota (USA, truck)", "2T1": "Toyota (Canada)", "2T3": "Toyota (Canada)", "JTD": "Toyota (Japan)", "JTE": "Toyota (Japan, SUV)", "JTM": "Toyota (Japan, SUV)",
  "1HG": "Honda (USA)", "5FN": "Honda (USA, SUV)", "5J6": "Honda (USA)", "19X": "Honda (USA)", "2HG": "Honda (Canada)", "JHM": "Honda (Japan)",
  "1N4": "Nissan (USA)", "5N1": "Nissan (USA, SUV)", "1N6": "Nissan (USA, truck)", "JN1": "Nissan (Japan)", "JN8": "Nissan (Japan, SUV)",
  "5YJ": "Tesla", "7SA": "Tesla", "1VW": "Volkswagen (USA)", "3VW": "Volkswagen (Mexico)", "4S4": "Subaru (USA)", "JF1": "Subaru (Japan)",
  "5UX": "BMW (USA, SUV)", "WBA": "BMW (Germany)", "4JG": "Mercedes-Benz (USA, SUV)", "WDD": "Mercedes-Benz (Germany)", "W1K": "Mercedes-Benz (Germany)",
  "5NP": "Hyundai (USA)", "KM8": "Hyundai (Korea, SUV)", "5XY": "Kia (USA)", "KNA": "Kia (Korea)", "KND": "Kia (Korea, SUV)",
  "1LN": "Lincoln", "5LM": "Lincoln (SUV)", "2LM": "Lincoln (Canada)", "JTH": "Lexus (Japan)", "2T2": "Lexus (Canada)", "58A": "Lexus (USA)",
};

const REGION: [RegExp, string][] = [
  [/^(1|4|5|7S)/, "United States"],
  [/^2/, "Canada"],
  [/^3/, "Mexico"],
  [/^J/, "Japan"],
  [/^K[L-R]/, "South Korea"],
  [/^L/, "China"],
  [/^S[A-M]/, "United Kingdom"],
  [/^W/, "Germany"],
  [/^Z/, "Italy"],
  [/^V[F-R]/, "France"],
  [/^Y[S-W]/, "Sweden"],
  [/^9[A-E]/, "Brazil"],
];

function country(vin: string) {
  return REGION.find(([r]) => r.test(vin))?.[1] ?? "Unknown";
}

const YEAR_CODES = "ABCDEFGHJKLMNPRSTVWXY123456789";

/**
 * Model year from position 10. The code repeats every 30 years; for cars
 * and light trucks built for North America from 2010, a letter in
 * position 7 means the later cycle.
 */
export function modelYear(vin: string) {
  const v = clean(vin);
  const i = YEAR_CODES.indexOf(v[9]);
  if (i < 0) return null;
  const early = 1980 + i;
  const late = early + 30;
  return /[A-Z]/.test(v[6]) ? late : early;
}

export type VinResult =
  | { ok: false; vin: string; error: string }
  | { ok: true; vin: string; valid: boolean; expected: string; found: string; maker: string; country: string; year: number | null; plant: string; serial: string };

export function decode(input: string): VinResult {
  const vin = clean(input);
  if (vin.length !== 17) return { ok: false, vin, error: `A VIN has 17 characters; this has ${vin.length}.` };
  const bad = vin.match(/[IOQ]/);
  if (bad) return { ok: false, vin, error: `VINs never use I, O or Q (they look like 1 and 0). Found "${bad[0]}".` };
  if (/[^A-Z0-9]/.test(vin)) return { ok: false, vin, error: "Only letters and numbers." };
  const expected = checkDigit(vin) ?? "?";
  return {
    ok: true,
    vin,
    valid: expected === vin[8],
    expected,
    found: vin[8],
    maker: WMI[vin.slice(0, 3)] ?? "Maker not in our short list",
    country: country(vin),
    year: modelYear(vin),
    plant: vin[10],
    serial: vin.slice(11),
  };
}

/** Make a sample VIN valid by writing its correct check digit. */
export function withCheckDigit(vin: string) {
  const v = clean(vin);
  const d = checkDigit(`${v.slice(0, 8)}0${v.slice(9)}`);
  return d ? `${v.slice(0, 8)}${d}${v.slice(9)}` : v;
}

/** The working behind the check digit, for showing it step by step. */
export function checkWorking(vin: string) {
  const v = clean(vin).padEnd(17, " ").slice(0, 17);
  const cells = v.split("").map((c, i) => {
    const n = c === " " ? undefined : value(c);
    return { c, value: n ?? null, weight: WEIGHT[i], product: n == null ? null : n * WEIGHT[i] };
  });
  const sum = cells.reduce((a, x) => a + (x.product ?? 0), 0);
  return { cells, sum, remainder: sum % 11 };
}
