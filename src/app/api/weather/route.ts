import { NextResponse } from "next/server";

export const revalidate = 900;

/** Accra's weather for the phone's widget, fetched here so visitors' browsers never call a third party. */
export async function GET() {
  const headers = { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" };
  try {
    const r = await fetch("https://api.open-meteo.com/v1/forecast?latitude=5.6037&longitude=-0.187&current=temperature_2m,apparent_temperature,weather_code&timezone=Africa%2FAccra", {
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(4000),
    });
    if (!r.ok) throw new Error(String(r.status));
    const j = await r.json();
    const c = j.current ?? {};
    const code = Number(c.weather_code);
    const kind = code <= 1 ? "clear" : code <= 3 ? "cloudy" : code <= 48 ? "fog" : code >= 95 ? "storm" : "rain";
    return NextResponse.json({ ok: true, temp: Math.round(c.temperature_2m), feels: Math.round(c.apparent_temperature), kind }, { headers });
  } catch {
    return NextResponse.json({ ok: false }, { headers: { "Cache-Control": "public, s-maxage=120" } });
  }
}
