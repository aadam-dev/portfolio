import { NextResponse } from "next/server";
import { db } from "@/db";
import { leadFromMessage } from "@/lib/office/seed";
import { messages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { OWNER, layout, mailConfigured, sendMail } from "@/lib/office/mail";
import { esc, frame, line, send, telegramReady } from "@/lib/office/telegram";
import { flagEmoji, place, sessionStory } from "@/lib/office/visits";

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
 * Every form and Build desk ticket: stored (when the database is on), sent
 * to the owner's Telegram at once with the visit behind it, and confirmed
 * by email to the sender when they left an address and Resend is set up.
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
      // straight into the Office's Leads board
      await leadFromMessage(store, { id: row.id, name, contact, kind, brief, body: message, budget }).catch((e) => console.error("lead create failed", e));
    } catch (e) {
      console.error("message store failed", e);
    }
  }

  // nowhere to put it at all: tell the client to use the WhatsApp fallback
  const ready = await telegramReady();
  if (!ready && id === undefined) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const origin = new URL(request.url).origin;
  const story = store && sid ? await sessionStory(store, sid).catch(() => null) : null;
  const label = kind === "build" ? "Build brief" : kind === "hire" ? "Hire brief" : "Message";
  const digits = contact.replace(/[^\d+]/g, "");
  const phone = !contact.includes("@") && digits.replace(/\D/g, "").length >= 8 ? digits.replace(/\D/g, "") : null;
  const visit = story
    ? `${flagEmoji(story.s.country)} ${place(story.s)}, ${story.pages.length} page${story.pages.length === 1 ? "" : "s"}, ${Math.round(story.s.seconds)}s on site${story.did.length ? `; ${story.did.slice(0, 4).join("; ")}` : ""}`
    : "";
  const sent = ready
    ? await send(
        frame(
          "message",
          [
            `<b>${esc(name)}</b> · ${esc(contact)}`,
            line("Budget or scope", budget),
            line("Brief", brief),
            "",
            `<blockquote>${esc(message)}</blockquote>`,
            "",
            line("Visit", visit),
          ],
          `📩 ${label}`,
        ),
        {
          buttons: [
            [{ text: "Open the inbox", url: `${origin}/office` }, ...(brief ? [{ text: "Open the brief", url: brief }] : [])],
            ...(phone ? [[{ text: `WhatsApp ${name.split(" ")[0]}`, url: `https://wa.me/${phone}` }]] : []),
          ],
        },
      )
    : ({ ok: false } as const);
  if (sent.ok && store && id !== undefined) await store.update(messages).set({ notified: true }).where(eq(messages.id, id)).catch(() => {});

  // a copy for the sender, only when email is set up (optional)
  if (mailConfigured() && contact.includes("@")) {
    const copy = layout({
      title: `Thanks. I have your ${label.toLowerCase()}.`,
      // fixed wording only: the form must not become a way to email someone else arbitrary text
      intro: "Aadam reads every message and replies within one business day. If this wasn't you, ignore this email.",
      cta: brief?.startsWith(origin) ? { href: brief, label: "Open your brief" } : undefined,
    });
    await sendMail({ to: contact, subject: `I have your ${label.toLowerCase()}`, replyTo: OWNER, ...copy });
  }

  if (!sent.ok && id === undefined) return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
