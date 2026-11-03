import { NextResponse } from "next/server";
import { db } from "@/db";
import { guestPosts } from "@/db/schema";
import { approvedGuests, type GuestKind } from "@/lib/guests";
import { esc, frame, line, send, telegramReady } from "@/lib/office/telegram";

export const runtime = "nodejs";

// a person leaves a note or two, not twenty: per address, per ten minutes
const recent = new Map<string, number[]>();
function limited(key: string, max: number) {
  const now = Date.now();
  const list = (recent.get(key) ?? []).filter((t) => now - t < 600_000);
  list.push(now);
  recent.set(key, list);
  if (recent.size > 5000) recent.clear();
  return list.length > max;
}

const MAX_IMAGE = 450_000; // bytes, after the browser has shrunk it to about 900 px

/** The image a visitor sent, checked by its first bytes rather than trusting the label. */
function decodeImage(dataUrl: unknown): { buf: Buffer; mime: string } | null {
  if (typeof dataUrl !== "string") return null;
  const m = /^data:(image\/(?:jpeg|webp|png));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!m) return null;
  const buf = Buffer.from(m[2], "base64");
  if (!buf.length || buf.length > MAX_IMAGE) return null;
  const jpeg = buf[0] === 0xff && buf[1] === 0xd8;
  const png = buf[0] === 0x89 && buf[1] === 0x50;
  const webp = buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP";
  return jpeg || png || webp ? { buf, mime: m[1] } : null;
}

/** Approved notes or photos, for the stickies and the gallery. */
export async function GET(request: Request) {
  const kind = new URL(request.url).searchParams.get("kind") === "photo" ? "photo" : "note";
  const headers = { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600" };
  try {
    const store = await db();
    if (!store) return NextResponse.json({ items: [] }, { headers });
    return NextResponse.json({ items: await approvedGuests(store, kind as GuestKind) }, { headers });
  } catch {
    return NextResponse.json({ items: [] }, { headers });
  }
}

type Body = { kind?: string; name?: string; body?: string; rating?: number; image?: string; sid?: string; website?: string };

/** A note or a selfie from a visitor: saved as pending, announced on Telegram, shown only after approval. */
export async function POST(request: Request) {
  const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const kind: GuestKind = body.kind === "photo" ? "photo" : "note";
  // a filled honeypot means a bot: say yes and keep nothing
  if (body.website) return NextResponse.json({ ok: true, status: "pending" });
  if (limited(`${kind}:${ip}`, kind === "photo" ? 3 : 5)) return NextResponse.json({ ok: false, error: "too_many" }, { status: 429 });

  const name = (body.name ?? "").trim().slice(0, 60);
  const text = (body.body ?? "").trim().slice(0, 600);
  const rating = Number.isInteger(body.rating) && body.rating! >= 1 && body.rating! <= 5 ? body.rating! : null;
  const image = kind === "photo" ? decodeImage(body.image) : null;
  if (kind === "note" && text.length < 2) return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });
  if (kind === "photo" && !image) return NextResponse.json({ ok: false, error: "bad_image" }, { status: 400 });
  const sid = typeof body.sid === "string" && /^[\w-]{8,64}$/.test(body.sid) ? body.sid : null;

  const store = await db().catch(() => null);
  if (!store) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  const [row] = await store
    .insert(guestPosts)
    .values({ kind, name, body: text, rating, image: image?.buf ?? null, mime: image?.mime ?? null, ip, sessionId: sid })
    .returning({ id: guestPosts.id });

  if (await telegramReady().catch(() => false)) {
    const origin = new URL(request.url).origin;
    await send(
      frame(
        "message",
        [
          `<b>${esc(name || "Someone")}</b>${rating ? ` · ${"★".repeat(rating)}` : ""}`,
          text ? `<blockquote>${esc(text)}</blockquote>` : null,
          kind === "photo" ? "A selfie from the phone's camera, waiting for you." : null,
          line("From", ip),
        ],
        kind === "photo" ? "📸 Visitor photo to approve" : "📝 Visitor note to approve",
      ),
      { buttons: [[{ text: "Review in the Office", url: `${origin}/office/guests` }]] },
    ).catch(() => {});
  }
  return NextResponse.json({ ok: true, id: row.id, status: "pending" });
}
