import { redirect } from "next/navigation";
import { and, desc, eq, gte, inArray, isNotNull, sql } from "drizzle-orm";
import { db, dbUrl } from "@/db";
import { events, messages, sessions } from "@/db/schema";
import { officeConfigured, signedIn } from "@/lib/office/auth";
import { mailConfigured } from "@/lib/office/mail";
import { chatId, telegramConfigured } from "@/lib/office/telegram";
import { perDay, stats } from "@/lib/office/stats";
import { eventLabel, flagEmoji, place } from "@/lib/office/visits";
import { logout, setStatus, testTelegram } from "./actions";
import TelegramPanel, { OwnerMark } from "./TelegramPanel";
import OfficeMap from "./OfficeMap";

export const dynamic = "force-dynamic";

const region = new Intl.DisplayNames(["en"], { type: "region" });
const country = (cc: string | null) => (cc && cc.length === 2 ? `${flagEmoji(cc)} ${region.of(cc) ?? cc}` : "Unknown");
const host = (r: string | null) => (r ? r.replace(/^https?:\/\//, "").split("/")[0] : "Direct");
const ago = (d: Date) => {
  const s = Math.round((Date.now() - d.getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`card p-5 ${className}`}>
      <h2 className="label">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Breakdown({ rows, fmt = (k) => k ?? "Unknown" }: { rows: { key: string | null; n: number }[]; fmt?: (k: string | null) => string }) {
  const max = Math.max(1, ...rows.map((r) => r.n));
  if (!rows.length) return <p className="text-[13px] text-[var(--ink-4)]">Nothing yet.</p>;
  return (
    <ul className="space-y-1.5">
      {rows.map((r) => (
        <li key={r.key ?? "none"} className="relative text-[13px]">
          <span className="absolute inset-y-0 left-0 rounded bg-[var(--accent)]/15" style={{ width: `${(r.n / max) * 100}%` }} />
          <span className="relative flex justify-between gap-3 px-2 py-1">
            <span className="truncate text-white">{fmt(r.key)}</span>
            <span className="tabular-nums text-[var(--ink-2)]">{r.n}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function Setup({ tables = false, chat }: { tables?: boolean; chat: boolean }) {
  const items = [
    ["Supabase connection", !!dbUrl(), "Supabase → Connect → Transaction pooler URI, saved as DATABASE_URL in Vercel (the Supabase Vercel integration sets POSTGRES_URL, which also works)."],
    ["Tables", tables, "Created automatically the first time the site uses the database."],
    ["TELEGRAM_BOT_TOKEN", telegramConfigured(), "The token from @BotFather, in Vercel → Settings → Environment Variables. Never in the code."],
    ["Telegram chat", chat, "Send the bot a message, then use Find my chat below (or set TELEGRAM_CHAT_ID)."],
    ["OFFICE_PASSWORD, SESSION_SECRET", officeConfigured(), "Set both in Vercel → Settings → Environment Variables."],
    ["CRON_SECRET", !!process.env.CRON_SECRET, "Any long random string. Vercel sends it with the daily digest."],
    ["Confirmation emails (optional)", mailConfigured(), "RESEND_API_KEY and INQUIRY_FROM, to email senders a short confirmation."],
  ] as const;
  return (
    <Card title="Finish the setup">
      <ul className="space-y-2 text-[14px]">
        {items.map(([k, done, how]) => (
          <li key={k} className="flex gap-3">
            <span className={`mt-1 w-2.5 h-2.5 shrink-0 rounded-full ${done ? "bg-[var(--success)]" : "bg-[var(--accent)]"}`} />
            <span>
              <span className="text-white font-medium">{k}</span> <span className="text-[var(--ink-2)]">{how}</span>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default async function Office({ searchParams }: { searchParams: Promise<{ test?: string; chat?: string }> }) {
  if (!(await signedIn())) redirect("/office/login");
  const { test, chat: chatNote } = await searchParams;
  const store = await db();
  const chat = telegramConfigured() ? await chatId() : null;
  const fromEnv = !!process.env.TELEGRAM_CHAT_ID?.trim();
  const telegram = <TelegramPanel token={telegramConfigured()} chat={chat} fromEnv={fromEnv} />;

  const header = (
    <header className="flex flex-wrap items-center gap-3 justify-between">
      <div>
        <p className="font-display text-[20px] text-white">Aadam</p>
        <h1 className="font-display text-[34px] leading-none text-white">Back office</h1>
      </div>
      <div className="flex items-center gap-2">
        {test && <span className="text-[13px] text-[var(--ink-2)]">{test === "sent" ? "Test sent to Telegram." : `Telegram test failed: ${test}`}</span>}
        {chatNote && <span className="text-[13px] text-[var(--ink-2)]">{chatNote === "saved" ? "Chat saved." : `Chat not saved: ${chatNote}`}</span>}
        <form action={testTelegram}>
          <button className="btn btn-line">Send test to Telegram</button>
        </form>
        <form action={logout}>
          <button className="btn btn-line">Sign out</button>
        </form>
      </div>
      <OwnerMark />
    </header>
  );

  if (!store) {
    return (
      <main className="max-w-[1280px] mx-auto px-4 md:px-6 py-10 space-y-6">
        {header}
        <Setup chat={!!chat} />
        {telegram}
      </main>
    );
  }

  let data;
  try {
    const live = await store
      .select({ n: sql<number>`count(*)::int` })
      .from(sessions)
      .where(gte(sessions.lastSeen, new Date(Date.now() - 5 * 60e3)));
    const [day, week, days, recent, inbox, located, newCount] = await Promise.all([
      stats(store, 24),
      stats(store, 24 * 7),
      perDay(store, 30),
      store.select().from(sessions).orderBy(desc(sessions.startedAt)).limit(50),
      store.select().from(messages).orderBy(desc(messages.at)).limit(60),
      store
        .select({ lat: sessions.lat, lng: sessions.lng, city: sessions.city, country: sessions.country, n: sql<number>`count(*)::int` })
        .from(sessions)
        .where(and(isNotNull(sessions.lat), gte(sessions.startedAt, new Date(Date.now() - 30 * 864e5))))
        .groupBy(sessions.lat, sessions.lng, sessions.city, sessions.country),
      store.select({ n: sql<number>`count(*)::int` }).from(messages).where(eq(messages.status, "new")),
    ]);
    const ids = recent.map((r) => r.id);
    const trail = ids.length
      ? await store
          .select({ sessionId: events.sessionId, type: events.type, path: events.path, name: events.name })
          .from(events)
          .where(inArray(events.sessionId, ids))
          .orderBy(events.at)
      : [];
    data = { live: live[0]?.n ?? 0, day, week, days, recent, inbox, located, newCount: newCount[0]?.n ?? 0, trail };
  } catch (e) {
    console.error(e);
    return (
      <main className="max-w-[1280px] mx-auto px-4 md:px-6 py-10 space-y-6">
        {header}
        <Card title="The database is connected but could not be read">
          <p className="text-[14px] text-[var(--ink-2)]">The tables are created automatically on first use. Check the Supabase connection string and the server logs, then reload.</p>
        </Card>
        <Setup chat={!!chat} />
        {telegram}
      </main>
    );
  }

  const { live, day, week, days, recent, inbox, located, newCount, trail } = data;
  const maxDay = Math.max(1, ...days.map((d) => d.n));
  const byDay = new Map(days.map((d) => [d.day, d.n]));
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(Date.now() - (29 - i) * 864e5).toISOString().slice(0, 10);
    return { day: d, n: byDay.get(d) ?? 0 };
  });

  return (
    <main className="max-w-[1280px] mx-auto px-4 md:px-6 py-10 space-y-6">
      {header}
      {(!chat || !process.env.CRON_SECRET || !officeConfigured()) && <Setup tables chat={!!chat} />}
      {telegram}

      <dl className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          ["On the site now", live, live ? "live" : ""],
          ["Visits, 24 hours", day.totals.sessions, ""],
          ["Visits, 7 days", week.totals.sessions, ""],
          ["Average stay, 7 days", `${Math.round(week.totals.seconds)}s`, ""],
          ["New messages", newCount, ""],
        ].map(([k, v, tag]) => (
          <div key={String(k)} className="card p-5">
            <dt className="stat-label flex items-center gap-2">
              {tag && <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />}
              {k}
            </dt>
            <dd className="stat-value">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Visits per day, last 30 days" className="lg:col-span-2">
          <div className="flex items-end gap-1 h-[140px]">
            {last30.map((d) => (
              <div key={d.day} className="flex-1 h-full flex items-end" title={`${d.day}: ${d.n}`}>
                <div className="w-full rounded-t bg-[var(--accent)]" style={{ height: `${Math.max(d.n ? 4 : 1, (d.n / maxDay) * 100)}%`, opacity: d.n ? 1 : 0.2 }} />
              </div>
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[11px] text-[var(--ink-4)]">
            <span>{last30[0].day.slice(5)}</span>
            <span>today</span>
          </div>
        </Card>
        <Card title="Where visitors are, last 30 days">
          <div className="relative h-[180px] rounded-[var(--radius-field)] overflow-hidden">
            <OfficeMap points={located.filter((p) => p.lat != null && p.lng != null).map((p) => ({ lat: p.lat!, lng: p.lng!, n: p.n, label: `${p.city ? decodeURIComponent(p.city) : ""} ${p.country ?? ""}` }))} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Countries, 7 days">
          <Breakdown rows={week.countries} fmt={country} />
        </Card>
        <Card title="Devices, 7 days">
          <Breakdown rows={week.devices} />
        </Card>
        <Card title="Arrived from, 7 days">
          <Breakdown rows={week.referrers} fmt={host} />
        </Card>
        <Card title="Played with, 7 days">
          <Breakdown rows={week.played} fmt={eventLabel} />
        </Card>
      </div>

      <Card title={`Inbox (${inbox.length})`}>
        {inbox.length === 0 ? (
          <p className="text-[13px] text-[var(--ink-4)]">No messages yet.</p>
        ) : (
          <ul className="divide-y divide-[var(--line)]">
            {inbox.map((m) => {
              const email = m.contact.includes("@");
              const reply = email
                ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(m.contact)}&su=${encodeURIComponent(`Re: your ${m.kind === "contact" ? "message" : `${m.kind} brief`}`)}`
                : `https://wa.me/${m.contact.replace(/[^\d]/g, "")}`;
              return (
                <li key={m.id} className="py-3">
                  <details>
                    <summary className="cursor-pointer list-none flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${m.status === "new" ? "bg-[var(--accent)] text-[var(--on-accent)]" : "bg-[var(--surface-2)] text-[var(--ink-2)]"}`}>{m.status}</span>
                      <span className="text-white font-medium">{m.name}</span>
                      <span className="text-[13px] text-[var(--ink-3)]">{m.contact}</span>
                      <span className="text-[12px] text-[var(--ink-4)] uppercase tracking-wide">{m.kind}</span>
                      <span className="ml-auto text-[12px] text-[var(--ink-3)]">{ago(m.at)}</span>
                    </summary>
                    <pre className="mt-3 whitespace-pre-wrap text-[13px] leading-relaxed text-[var(--ink-2)] font-mono bg-[var(--surface-2)] rounded-[var(--radius-field)] p-3">{m.body}</pre>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <a href={reply} target="_blank" rel="noreferrer" className="pill" aria-pressed="true">
                        {email ? "Reply in Gmail" : "Reply on WhatsApp"}
                      </a>
                      {m.brief && (
                        <a href={m.brief} target="_blank" rel="noreferrer" className="pill">
                          Open brief
                        </a>
                      )}
                      {(["new", "replied", "archived"] as const)
                        .filter((s) => s !== m.status)
                        .map((s) => (
                          <form key={s} action={setStatus}>
                            <input type="hidden" name="id" value={m.id} />
                            <input type="hidden" name="status" value={s} />
                            <button className="pill">Mark {s}</button>
                          </form>
                        ))}
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card title="Last 50 visits">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-[13px]">
            <thead className="text-left text-[var(--ink-3)]">
              <tr>
                <th className="font-normal py-2 pr-3">When</th>
                <th className="font-normal py-2 pr-3">Where</th>
                <th className="font-normal py-2 pr-3">Device</th>
                <th className="font-normal py-2 pr-3">From</th>
                <th className="font-normal py-2 pr-3">Pages and actions</th>
                <th className="font-normal py-2 pr-3 text-right">Stay</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((s) => {
                const t = trail.filter((e) => e.sessionId === s.id);
                const path = t.map((e) => (e.type === "view" ? e.path : `· ${eventLabel(e.name)}`)).slice(0, 10).join("  ");
                return (
                  <tr key={s.id} className="border-t border-[var(--line)] align-top">
                    <td className="py-2 pr-3 whitespace-nowrap text-[var(--ink-2)]">
                      {ago(s.startedAt)}
                      {s.alerted && <span className="ml-1.5 text-[var(--accent)]" title="Sent an instant alert">●</span>}
                      {s.returning && <span className="ml-1.5 text-[11px] text-[var(--ink-3)]">again</span>}
                    </td>
                    <td className="py-2 pr-3 whitespace-nowrap text-white">{`${flagEmoji(s.country)} ${place(s)}`}</td>
                    <td className="py-2 pr-3 text-[var(--ink-2)]">{[s.device, s.browser, s.os].filter(Boolean).join(", ")}</td>
                    <td className="py-2 pr-3 text-[var(--ink-2)]">{host(s.referrer)}</td>
                    <td className="py-2 pr-3 text-[var(--ink-2)] font-mono text-[12px]">{path || s.landing}</td>
                    <td className="py-2 pr-3 text-right tabular-nums text-[var(--ink-2)]">{s.seconds}s</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}
