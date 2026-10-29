import { NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { OWNER, layout, mailConfigured, sendMail } from "@/lib/office/mail";
import { sessionRows, sessionStory } from "@/lib/office/visits";

export const runtime = "nodejs";

// a few messages per address per ten minutes is plenty for a person
const sends = new Map<string, number[]>();
function limited(key: string) {
  const now = Date.now();
  const list = (sends.get(key) ?? []).filter((t) => now - t < 600_000);
  list.push(now);
  sends.set(key, list);
  if (sends.size > 5000) sends.clear();
  return list.length > 5;
}

type Body = { name?: string; contact?: string; budget?: string; message?: string; brief?: string; kind?: string; sid?: string };

/**
 * Every form and Build desk ticket: stored (when the database is on),
 * emailed to the owner at once with the visit behind it, and confirmed
 * to the sender when they left an email address.
 */
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "too_many" }, { status: 429 });
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = body.name?.trim().slice(0, 200);
  const contact = body.contact?.trim().slice(0, 200);
  const budget = body.budget?.trim().slice(0, 80) || "unspecified";
  const message = body.message?.trim().slice(0, 5000);
  const brief = body.brief?.startsWith("http") ? body.brief.slice(0, 300) : undefined;
  const kind = body.kind === "build" || body.kind === "hire" ? body.kind : "contact";
  const sid = typeof body.sid === "string" && /^[\w-]{8,64}$/.test(body.sid) ? body.sid : undefined;
  if (!name || !contact || !message) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const store = await db();
  let id: number | undefined;
  if (store) {
    try {
      const [row] = await store.insert(messages).values({ kind, name, contact, budget, body: message, brief, sessionId: sid }).returning({ id: messages.id });
      id = row.id;
    } catch (e) {
      console.error("message store failed", e);
    }
  }

  // nowhere to put it at all: tell the client to use the WhatsApp fallback
  if (!mailConfigured() && id === undefined) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const origin = new URL(request.url).origin;
  const story = store && sid ? await sessionStory(store, sid).catch(() => null) : null;
  const label = kind === "build" ? "Build brief" : kind === "hire" ? "Hire brief" : "Message";
  const owner = layout({
    title: `${label} from ${name}`,
    intro: `Reply to this email to answer ${name} directly.`,
    rows: [["Name", name], ["Contact", contact], ["Budget or scope", budget], ["Brief", brief ?? ""], ...(story ? sessionRows(story.s, story) : [])],
    body: message,
    cta: { href: `${origin}/office`, label: "Open the inbox" },
  });
  const sent = await sendMail({
    to: OWNER,
    subject: `${label}: ${name} (${budget})`,
    replyTo: contact.includes("@") ? contact : undefined,
    ...owner,
  });
  if (sent.ok && store && id !== undefined) await store.update(messages).set({ notified: true }).where(eq(messages.id, id)).catch(() => {});

  // a copy for the sender
  if (sent.ok && contact.includes("@")) {
    const copy = layout({
      title: `Thanks. We have your ${label.toLowerCase()}.`,
      // fixed wording only: the form must not become a way to email someone else arbitrary text
      intro: "Aadam reads every message and replies within one business day. If this wasn't you, ignore this email.",
      cta: brief?.startsWith(origin) ? { href: brief, label: "Open your brief" } : undefined,
    });
    await sendMail({ to: contact, subject: `We have your ${label.toLowerCase()}`, replyTo: OWNER, ...copy });
  }

  if (!sent.ok && id === undefined) return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
