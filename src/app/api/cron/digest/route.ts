import { NextResponse } from "next/server";
import { db } from "@/db";
import { today } from "@/lib/office/items";
import { sql } from "drizzle-orm";
import { sessions } from "@/db/schema";
import { esc, frame, line, send } from "@/lib/office/telegram";
import { stats } from "@/lib/office/stats";
import { eventLabel } from "@/lib/office/visits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const list = (rows: { key: string | null; n: number }[], fmt = (k: string) => k) =>
  rows.length ? rows.map((r) => `${fmt(r.key ?? "Unknown")} ${r.n}`).join(", ") : "none";

/** The morning digest, run by Vercel Cron at 08:00 Accra (UTC). */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const store = await db();
  if (!store) return NextResponse.json({ ok: false, error: "no_database" }, { status: 503 });
  const s = await stats(store, 24);
  const region = new Intl.DisplayNames(["en"], { type: "region" });
  const country = (cc: string) => (cc.length === 2 ? (region.of(cc) ?? cc) : cc);
  const origin = new URL(request.url).origin;
  const [quiet] = await store
    .select({ n: sql<number>`count(*)::int` })
    .from(sessions)
    .where(sql`${sessions.startedAt} > now() - interval '24 hours' and ${sessions.tgMsgId} is null`);
  const n = s.totals.sessions;
  // what the Office says needs me today
  const plan = await today(store).catch(() => null);
  const sent = await send(
    frame(
      "digest",
      [
        `<b>Last 24 hours: ${n} visit${n === 1 ? "" : "s"}, ${s.inbox.length} message${s.inbox.length === 1 ? "" : "s"}</b>`,
        "",
        line("Visitors", `${s.totals.visitors} (${s.totals.returning} returning)`),
        line("Average stay", `${Math.round(s.totals.seconds)}s`),
        line("Countries", list(s.countries, country)),
        line("Cities", list(s.cities, (c) => decodeURIComponent(c))),
        line("Devices", list(s.devices)),
        line("From", list(s.referrers, (r) => (r === "Unknown" ? "Direct" : r.replace(/^https?:\/\//, "").split("/")[0]))),
        line("Top pages", list(s.pages)),
        line("Played with", list(s.played, (k) => eventLabel(k))),
        quiet?.n ? `<i>${quiet.n} visit${quiet.n === 1 ? " was" : "s were"} only counted here, not announced (busy hours, or Telegram not set yet).</i>` : null,
        ...(s.inbox.length ? ["", "<b>Messages</b>", ...s.inbox.map((m) => `• ${esc(m.name)} (${esc(m.contact)}): ${esc(m.body.slice(0, 120))}`)] : []),
        ...(plan && plan.due.length ? ["", `<b>Due today in the Office (${plan.due.length})</b>`, ...plan.due.slice(0, 10).map((d) => `• ${esc(d.title)}${d.due && d.due < plan.day ? " (late)" : ""}`)] : []),
      ],
      `📊 Daily digest`,
    ),
    { buttons: [[{ text: "Open the Office", url: `${origin}/office` }]] },
  );
  return NextResponse.json({ ok: sent.ok, visits: s.totals.sessions });
}
