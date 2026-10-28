import { NextResponse } from "next/server";
import { decode } from "@/lib/vin";

/**
 * Full decode from NHTSA's public vPIC service, plus the model-wide recalls
 * NHTSA holds for that make, model and year. Proxied so the browser does
 * not depend on NHTSA's CORS, and cached for a day.
 */
export async function GET(req: Request) {
  const d = decode(new URL(req.url).searchParams.get("vin") ?? "");
  if (!d.ok) return NextResponse.json({ error: d.error }, { status: 400 });
  const opts = { next: { revalidate: 86400 }, signal: AbortSignal.timeout(8000) };
  try {
    const r = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${d.vin}?format=json`, opts);
    if (!r.ok) throw new Error(String(r.status));
    const v: Record<string, string> = (await r.json()).Results?.[0] ?? {};
    const s = (k: string) => (v[k] && v[k] !== "Not Applicable" ? v[k].trim() : "");
    const litres = Number(s("DisplacementL"));
    const out = {
      make: s("Make"),
      model: s("Model"),
      year: s("ModelYear"),
      trim: s("Trim"),
      body: s("BodyClass"),
      engine: [litres ? `${litres.toFixed(1)} L` : "", s("EngineCylinders") && `${s("EngineCylinders")} cylinders`, s("FuelTypePrimary")].filter(Boolean).join(", "),
      drive: s("DriveType"),
      plant: [s("PlantCity"), s("PlantState"), s("PlantCountry")].filter(Boolean).map((x) => x.replace(/\s*\(.*\)$/, "")).join(", "),
      recalls: null as null | { count: number; items: { id: string; component: string }[] },
    };
    if (out.make && out.model && out.year) {
      const q = new URLSearchParams({ make: out.make, model: out.model, modelYear: out.year });
      const rr = await fetch(`https://api.nhtsa.gov/recalls/recallsByVehicle?${q}`, opts).catch(() => null);
      const rj = rr?.ok ? await rr.json() : null;
      if (rj)
        out.recalls = {
          count: rj.Count ?? rj.results?.length ?? 0,
          items: (rj.results ?? []).slice(0, 3).map((x: Record<string, string>) => ({ id: x.NHTSACampaignNumber, component: x.Component })),
        };
    }
    return NextResponse.json(out, { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } });
  } catch {
    return NextResponse.json({ error: "NHTSA did not answer. The decode above still stands." }, { status: 502 });
  }
}
