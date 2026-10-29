import { NextResponse } from "next/server";
import { geolocation, ipAddress, waitUntil } from "@vercel/functions";
import { isbot } from "isbot";
import { db } from "@/db";
import { record, type TrackInput } from "@/lib/office/visits";

export const runtime = "nodejs";

// a small per-instance limiter: 120 beacons a minute per address
const hits = new Map<string, { n: number; t: number }>();
function limited(key: string) {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || now - h.t > 60_000) {
    hits.set(key, { n: 1, t: now });
    if (hits.size > 5000) hits.clear();
    return false;
  }
  h.n += 1;
  return h.n > 120;
}

const ok = () => new NextResponse(null, { status: 204 });

/** Visitor beacons. Stored only on Vercel deployments (or with TRACK_LOCAL=1 for testing). */
export async function POST(request: Request) {
  if (!process.env.VERCEL && process.env.TRACK_LOCAL !== "1") return ok();
  const store = await db();
  if (!store) return ok();
  const ua = request.headers.get("user-agent") ?? "";
  if (!ua || isbot(ua)) return ok();
  const ip = ipAddress(request) ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (limited(ip ?? ua)) return ok();

  let body: TrackInput;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return ok();
  }
  if (typeof body?.sid !== "string" || !/^[\w-]{8,64}$/.test(body.sid) || !Array.isArray(body.items)) return ok();
  if (body.vid && !/^[\w-]{8,64}$/.test(body.vid)) body.vid = undefined;
  body.items = body.items
    .filter((i) => i && (i.type === "view" || i.type === "kit"))
    .map((i) => ({ type: i.type, path: typeof i.path === "string" ? i.path : undefined, name: typeof i.name === "string" ? i.name : undefined, detail: typeof i.detail === "string" ? i.detail : undefined }));

  const origin = new URL(request.url).origin;
  const work = record(store, body, { ip, ua, geo: geolocation(request), origin }).catch((e) => console.error("track failed", e));
  // answer the beacon now; finish the write (and any alert email) in the background
  waitUntil(work);
  if (!process.env.VERCEL) await work;
  return ok();
}
