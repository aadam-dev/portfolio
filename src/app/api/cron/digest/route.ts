import { NextResponse } from "next/server";
import { db } from "@/db";
import { OWNER, layout, sendMail } from "@/lib/office/mail";
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
  const mail = layout({
    title: `Yesterday on aadambuilds.dev: ${s.totals.sessions} visit${s.totals.sessions === 1 ? "" : "s"}`,
    intro: s.inbox.length ? `${s.inbox.length} new message${s.inbox.length === 1 ? "" : "s"} came in. Each one was also emailed to you when it arrived.` : "No new messages.",
    rows: [
      ["Visitors", `${s.totals.visitors} (${s.totals.returning} returning)`],
      ["Average stay", `${Math.round(s.totals.seconds)}s`],
      ["Countries", list(s.countries, country)],
      ["Cities", list(s.cities, (c) => decodeURIComponent(c))],
      ["Devices", list(s.devices)],
      ["From", list(s.referrers, (r) => (r === "Unknown" ? "Direct" : r.replace(/^https?:\/\//, "").split("/")[0]))],
      ["Top pages", list(s.pages)],
      ["Played with", list(s.played, (k) => eventLabel(k))],
      ...s.inbox.map((m): [string, string] => [`Message`, `${m.name} (${m.contact}): ${m.body.slice(0, 120)}`]),
    ],
    cta: { href: `${origin}/office`, label: "Open the back office" },
  });
  const sent = await sendMail({ to: OWNER, subject: `Daily digest: ${s.totals.sessions} visits, ${s.inbox.length} messages`, ...mail });
  return NextResponse.json({ ok: sent.ok, visits: s.totals.sessions });
}
