import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell, CheckCircle2, CircleDashed, Inbox as InboxIcon, LogOut, Monitor, RotateCcw, Send, Smartphone, Tablet } from "lucide-react";
import { db, dbUrl } from "@/db";
import { officeConfigured, signedIn } from "@/lib/office/auth";
import { mailConfigured } from "@/lib/office/mail";
import { chatId, telegramConfigured } from "@/lib/office/telegram";
import { dashboard, RANGES, rangeOf, type Dashboard } from "@/lib/office/dash";
import { eventLabel, flagEmoji, place } from "@/lib/office/visits";
import { logout, setStatus, testTelegram } from "./actions";
import TelegramPanel, { OwnerMark, ThisBrowser } from "./TelegramPanel";
import OfficeMap from "./OfficeMap";
import VisitsChart from "./ui/VisitsChart";
import { BarList, Delta, Panel, Spark, STATUS } from "./ui/parts";

export const dynamic = "force-dynamic";

const region = new Intl.DisplayNames(["en"], { type: "region" });
const country = (cc: string | null) => (cc && cc.length === 2 ? `${flagEmoji(cc)}  ${region.of(cc) ?? cc}` : "Unknown");
const host = (r: string | null) => (r ? r.replace(/^https?:\/\/(www\.)?/, "").split("/")[0] : "Direct");
const ago = (d: Date) => {
  const s = Math.round((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};
const dur = (s: number) => {
  const v = Math.round(s);
  if (v < 60) return `${v}s`;
  if (v < 3600) return `${Math.floor(v / 60)}m ${String(v % 60).padStart(2, "0")}s`;
  return `${Math.floor(v / 3600)}h ${Math.round((v % 3600) / 60)}m`;
};
const fmtN = (n: number) => n.toLocaleString("en-US");

function Setup({ tables, chat }: { tables: boolean; chat: boolean }) {
  const items: [string, boolean, string, boolean?][] = [
    ["Supabase", !!dbUrl(), "Connect → Transaction pooler URI, as DATABASE_URL in Vercel (or POSTGRES_URL from the Supabase integration)."],
    ["Tables", tables, "Created automatically the first time the site uses the database."],
    ["Telegram bot", telegramConfigured(), "TELEGRAM_BOT_TOKEN from @BotFather, in Vercel only."],
    ["Telegram chat", chat, "Message the bot, then use Find my chat, or set TELEGRAM_CHAT_ID."],
    ["Office sign-in", officeConfigured(), "OFFICE_PASSWORD and SESSION_SECRET in Vercel."],
    ["Daily digest", !!process.env.CRON_SECRET, "CRON_SECRET: any long random string."],
    ["Visitor confirmations", mailConfigured(), "Optional: RESEND_API_KEY and INQUIRY_FROM.", true],
  ];
  const list = (
    <ul className="divide-y divide-[var(--line)]">
      {items.map(([k, ok, how, optional]) => (
        <li key={k} className="flex gap-3 py-2.5 first:pt-0 last:pb-0">
          {ok ? (
            <CheckCircle2 className="mt-0.5 w-4 h-4 shrink-0" style={{ color: STATUS.good }} aria-hidden />
          ) : (
            <CircleDashed className="mt-0.5 w-4 h-4 shrink-0" style={{ color: optional ? "var(--ink-4)" : STATUS.warning }} aria-hidden />
          )}
          <div className="min-w-0">
            <p className="text-[13px] text-[var(--foreground)]">
              {k} <span className="text-[var(--ink-3)]">{ok ? "Ready" : optional ? "Optional" : "To do"}</span>
            </p>
            {!ok && <p className="mt-0.5 text-[12px] leading-snug text-[var(--ink-3)]">{how}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
  const missing = items.filter(([, ok, , optional]) => !ok && !optional).length;
  if (missing) return list;
  return (
    <details className="group">
      <summary className="cursor-pointer list-none flex items-center gap-2 text-[13.5px]">
        <CheckCircle2 className="w-4 h-4" style={{ color: STATUS.good }} aria-hidden />
        Everything is connected
        <span className="ml-auto text-[12px] text-[var(--ink-3)] group-open:hidden">Details</span>
      </summary>
      <div className="mt-4">{list}</div>
    </details>
  );
}

function DeviceIcon({ d }: { d: string | null }) {
  const I = d === "mobile" ? Smartphone : d === "tablet" ? Tablet : Monitor;
  return <I className="w-3.5 h-3.5" aria-label={d ?? "desktop"} />;
}

function Overview({ d }: { d: Dashboard }) {
  const period = d.range.label;
  const share = (t: { visits: number; returning: number }) => (t.visits ? (t.returning / t.visits) * 100 : 0);
  const tiles: { label: string; value: string; now: number; before: number; spark: number[]; fmt?: (x: number) => string }[] = [
    { label: "Unique visitors", value: fmtN(d.cur.visitors), now: d.cur.visitors, before: d.prev.visitors, spark: d.points.map((p) => p.visitors) },
    { label: "Average stay", value: dur(d.cur.seconds), now: d.cur.seconds, before: d.prev.seconds, spark: d.points.map((p) => p.seconds) },
    { label: "Returning", value: `${Math.round(share(d.cur))}%`, now: share(d.cur), before: share(d.prev), spark: [], fmt: (x) => `${x > 0 ? "+" : ""}${Math.round(x)} pts` },
    { label: "Messages", value: fmtN(d.cur.messages), now: d.cur.messages, before: d.prev.messages, spark: d.points.map((p) => p.messages) },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-12 gap-3 md:gap-4">
      <div className="card col-span-2 lg:col-span-4 p-5 md:p-6 justify-between">
        <p className="text-[13px] text-[var(--ink-2)]">Visits, last {period}</p>
        <div>
          <p className="mt-4 text-[56px] md:text-[64px] font-semibold leading-none tracking-[-0.03em]">{fmtN(d.cur.visits)}</p>
          <Delta now={d.cur.visits} before={d.prev.visits} period={period} />
        </div>
      </div>
      {tiles.map((t) => (
        <div key={t.label} className="card col-span-1 lg:col-span-2 p-4 md:p-5">
          <p className="text-[12.5px] text-[var(--ink-3)]">{t.label}</p>
          <p className="mt-2 text-[26px] font-semibold leading-tight tracking-[-0.02em]">{t.value}</p>
          <Delta now={t.now} before={t.before} period={period} fmt={t.fmt} short={d.range.id} />
          <div className="mt-auto pt-3">{t.spark.length > 1 && <Spark values={t.spark} />}</div>
        </div>
      ))}
    </div>
  );
}

function Journey({ items }: { items: { type: string; path: string | null; name: string | null }[] }) {
  const shown = items.slice(0, 7);
  return (
    <p className="mt-1.5 flex flex-wrap gap-1">
      {shown.map((e, i) =>
        e.type === "view" ? (
          <span key={i} className="rounded-md bg-[rgba(242,238,230,0.05)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--ink-2)]">
            {e.path}
          </span>
        ) : (
          <span key={i} className="rounded-md bg-[#3987e5]/15 px-1.5 py-0.5 text-[11px] text-[#9cc2f2]">
            {eventLabel(e.name)}
          </span>
        ),
      )}
      {items.length > shown.length && <span className="px-1 py-0.5 text-[11px] text-[var(--ink-4)]">+{items.length - shown.length}</span>}
    </p>
  );
}

function Inbox({ d }: { d: Dashboard }) {
  if (d.inbox.length === 0)
    return (
      <div className="py-10 text-center">
        <InboxIcon className="mx-auto w-6 h-6 text-[var(--ink-4)]" />
        <p className="mt-2 text-[13px] text-[var(--ink-3)]">No messages yet. They also arrive on Telegram.</p>
      </div>
    );
  return (
    <ul className="space-y-2">
      {d.inbox.map((m) => {
        const email = m.contact.includes("@");
        const reply = email
          ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(m.contact)}&su=${encodeURIComponent(`Re: your ${m.kind === "contact" ? "message" : `${m.kind} brief`}`)}`
          : `https://wa.me/${m.contact.replace(/[^\d]/g, "")}`;
        const initials = m.name
          .split(/\s+/)
          .slice(0, 2)
          .map((w) => w[0]?.toUpperCase() ?? "")
          .join("");
        return (
          <li key={m.id}>
            <details className={`group rounded-xl border transition-colors ${m.status === "new" ? "border-[var(--line-strong)] bg-[var(--surface-2)]" : "border-[var(--line)]"} open:bg-[var(--surface-2)]`}>
              <summary className="cursor-pointer list-none flex items-start gap-3 p-3.5">
                <span className="grid place-items-center w-9 h-9 shrink-0 rounded-full bg-[var(--surface-3)] text-[12px] font-semibold text-[var(--ink-2)]">{initials || "?"}</span>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[13.5px]">
                    <span className="font-medium text-[var(--foreground)]">{m.name}</span>
                    <span className="rounded-full border border-[var(--line)] px-2 py-px text-[11px] text-[var(--ink-3)]">{m.kind === "contact" ? "Message" : m.kind === "build" ? "Build brief" : "Hire brief"}</span>
                    {m.status === "new" && (
                      <span className="inline-flex items-center gap-1 text-[11.5px] text-[var(--foreground)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" /> New
                      </span>
                    )}
                    {m.status === "archived" && <span className="text-[11.5px] text-[var(--ink-4)]">Archived</span>}
                    <span className="ml-auto text-[12px] text-[var(--ink-3)]">{ago(m.at)}</span>
                  </p>
                  <p className="mt-0.5 truncate text-[13px] text-[var(--ink-3)] group-open:hidden">{m.body}</p>
                </div>
              </summary>
              <div className="px-3.5 pb-4 md:pl-[60px]">
                <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-[var(--ink-2)]">{m.body}</p>
                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[12.5px]">
                  <dt className="text-[var(--ink-3)]">Contact</dt>
                  <dd className="text-[var(--foreground)] break-all">{m.contact}</dd>
                  {m.budget && (
                    <>
                      <dt className="text-[var(--ink-3)]">Budget</dt>
                      <dd>{m.budget}</dd>
                    </>
                  )}
                  <dt className="text-[var(--ink-3)]">Received</dt>
                  <dd>{m.at.toUTCString().replace(" GMT", "")}</dd>
                </dl>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <a href={reply} target="_blank" rel="noreferrer" className="btn btn-solid !h-9 !px-4 !text-[13px]">
                    {email ? "Reply in Gmail" : "Reply on WhatsApp"}
                  </a>
                  {m.brief && (
                    <a href={m.brief} target="_blank" rel="noreferrer" className="btn btn-line !h-9 !px-4 !text-[13px]">
                      Open the brief
                    </a>
                  )}
                  <span className="mx-1 h-5 w-px bg-[var(--line)]" />
                  {(["replied", "archived", "new"] as const)
                    .filter((s) => s !== m.status)
                    .map((s) => (
                      <form key={s} action={setStatus}>
                        <input type="hidden" name="id" value={m.id} />
                        <input type="hidden" name="status" value={s} />
                        <button className="pill !h-8 !text-[12.5px]">
                          {s === "new" ? (
                            <>
                              <RotateCcw className="w-3 h-3" /> Mark unread
                            </>
                          ) : s === "replied" ? (
                            "Mark replied"
                          ) : (
                            "Archive"
                          )}
                        </button>
                      </form>
                    ))}
                </div>
              </div>
            </details>
          </li>
        );
      })}
    </ul>
  );
}

function Visits({ d }: { d: Dashboard }) {
  if (d.recent.length === 0) return <p className="py-8 text-center text-[13px] text-[var(--ink-3)]">No visits yet. The first one also lands on Telegram.</p>;
  const first = d.recent.slice(0, 12);
  const rest = d.recent.slice(12);
  return (
    <>
      <VisitRows d={d} rows={first} />
      {rest.length > 0 && (
        <details className="group mt-2">
          <summary className="cursor-pointer list-none py-2 text-center text-[12.5px] text-[var(--ink-3)] hover:text-[var(--foreground)] group-open:hidden">Show {rest.length} more</summary>
          <VisitRows d={d} rows={rest} />
        </details>
      )}
    </>
  );
}

function VisitRows({ d, rows }: { d: Dashboard; rows: Dashboard["recent"] }) {
  return (
    <ul className="divide-y divide-[var(--line)]">
      {rows.map((s) => {
        const t = d.trail.filter((e) => e.sessionId === s.id);
        return (
          <li key={s.id} className="grid grid-cols-[28px_1fr_auto] gap-3 py-3 first:pt-0">
            <span className="text-[18px] leading-6" aria-hidden>
              {flagEmoji(s.country) || "🌐"}
            </span>
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[13.5px]">
                <span className="font-medium text-[var(--foreground)]">{place(s)}</span>
                <span className="text-[12px] text-[var(--ink-3)]">{ago(s.startedAt)}</span>
                {s.returning && <span className="rounded-full border border-[var(--line)] px-1.5 py-px text-[11px] text-[var(--ink-2)]">Returning</span>}
                {s.alerted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#3987e5]/15 px-1.5 py-px text-[11px] text-[#9cc2f2]" title="Sent a notable-visit update to Telegram">
                    <Bell className="w-3 h-3" /> Notable
                  </span>
                )}
              </p>
              {t.length ? <Journey items={t} /> : <p className="mt-1 font-mono text-[11px] text-[var(--ink-3)]">{s.landing}</p>}
            </div>
            <div className="text-right text-[12px] leading-5 text-[var(--ink-3)] md:flex md:items-center md:gap-4">
              <p className="inline-flex items-center gap-1.5 text-[var(--ink-2)]">
                <DeviceIcon d={s.device} /> {s.browser?.split(" ")[0] ?? ""}
              </p>
              <p className="md:w-[110px] truncate">{host(s.referrer)}</p>
              <p className="md:w-[56px] tabular-nums text-[var(--ink-2)]">{dur(s.seconds)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default async function Office({ searchParams }: { searchParams: Promise<{ test?: string; chat?: string; range?: string }> }) {
  if (!(await signedIn())) redirect("/office/login");
  const { test, chat: chatNote, range } = await searchParams;
  const r = rangeOf(range);
  const store = await db();
  const chat = telegramConfigured() ? await chatId() : null;
  const fromEnv = !!process.env.TELEGRAM_CHAT_ID?.trim();

  let d: Dashboard | null = null;
  let failed = false;
  if (store) {
    try {
      d = await dashboard(store, r.id);
    } catch (e) {
      console.error("[office]", e);
      failed = true;
    }
  }

  const note = test ? (test === "sent" ? "Test sent to Telegram." : `Telegram test failed: ${test}`) : chatNote ? (chatNote === "saved" ? "Chat saved. Updates will go there." : `Chat not saved: ${chatNote}`) : null;
  const system = (
    <div id="system" className="space-y-4 md:space-y-5 scroll-mt-20">
      <TelegramPanel token={telegramConfigured()} chat={chat} fromEnv={fromEnv} />
      <ThisBrowser />
      <Panel title="Setup">
        <Setup tables={!!d} chat={!!chat} />
      </Panel>
    </div>
  );

  return (
    <div className="theme-fixed min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <OwnerMark />
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[#0b0a08]/80 backdrop-blur-xl">
        <div className="max-w-[1320px] mx-auto px-4 md:px-6 h-14 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-[15px] font-semibold whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" /> Aadam
            <span className="text-[var(--ink-4)] font-normal">/</span>
            <span className="font-normal text-[var(--ink-2)]">Back office</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 ml-4 text-[13px] text-[var(--ink-3)]">
            {[
              ["#overview", "Overview"],
              ["#inbox", "Inbox"],
              ["#visits", "Visits"],
              ["#system", "System"],
            ].map(([h, l]) => (
              <a key={h} href={h} className="px-3 h-8 inline-flex items-center gap-1.5 rounded-full hover:bg-[var(--tint)] hover:text-[var(--foreground)]">
                {l}
                {l === "Inbox" && d && d.unread > 0 && <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--accent)] text-[10.5px] font-semibold text-[var(--on-accent)] grid place-items-center">{d.unread}</span>}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {d && (
              <span className="hidden sm:inline-flex items-center gap-2 h-8 px-3 rounded-full border border-[var(--line)] text-[12.5px] text-[var(--ink-2)]">
                <span className="relative flex w-2 h-2">
                  {d.live > 0 && <span className="absolute inset-0 rounded-full animate-ping" style={{ background: STATUS.good, opacity: 0.6 }} />}
                  <span className="relative w-2 h-2 rounded-full" style={{ background: d.live ? STATUS.good : "var(--ink-4)" }} />
                </span>
                {d.live} on the site now
              </span>
            )}
            <form action={testTelegram}>
              <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-[var(--line)] text-[12.5px] text-[var(--ink-2)] hover:border-[var(--line-strong)] hover:text-[var(--foreground)]" title="Send a test update to Telegram">
                <Send className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Test Telegram</span>
              </button>
            </form>
            <form action={logout}>
              <button className="grid place-items-center w-8 h-8 rounded-full border border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--foreground)]" aria-label="Sign out" title="Sign out">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-[1320px] mx-auto px-4 md:px-6 pt-6 md:pt-8 pb-24 space-y-4 md:space-y-5">
        {note && <p className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-[13px] text-[var(--ink-2)]">{note}</p>}

        {/* one filter row above everything it scopes */}
        <div id="overview" className="flex flex-wrap items-center justify-between gap-3 scroll-mt-20">
          <div className="seg" role="tablist" aria-label="Date range">
            {RANGES.map((x) => (
              <Link key={x.id} href={`/office?range=${x.id}`} role="tab" aria-selected={x.id === r.id} className="seg-item inline-flex items-center">
                {x.label}
              </Link>
            ))}
          </div>
          <p className="text-[12px] text-[var(--ink-3)]">Times in UTC, the same as Accra</p>
        </div>

        {d ? (
          <>
            <Overview d={d} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
              <Panel title={`Visits per ${d.range.bucket}`} className="lg:col-span-8">
                <VisitsChart points={d.points} unit={d.range.bucket} />
              </Panel>
              <Panel title="Where visitors are" className="lg:col-span-4">
                <div className="relative h-[300px] rounded-xl overflow-hidden border border-[var(--line)]">
                  <OfficeMap points={d.located.filter((p) => p.lat != null && p.lng != null).map((p) => ({ lat: p.lat!, lng: p.lng!, n: p.n, label: `${p.city ? decodeURIComponent(p.city) : ""} ${p.country ?? ""}`.trim() }))} />
                </div>
              </Panel>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              <Panel title="Countries">
                <BarList rows={d.countries} fmt={country} />
              </Panel>
              <Panel title="Arrived from">
                <BarList rows={d.referrers} fmt={host} />
              </Panel>
              <Panel title="Top pages">
                <BarList rows={d.pages} fmt={(k) => k ?? "/"} />
              </Panel>
              <Panel title="Devices">
                <BarList rows={d.devices} fmt={(k) => (k ? k[0].toUpperCase() + k.slice(1) : "Unknown")} />
              </Panel>
              <Panel title="Played with" className="md:col-span-2 lg:col-span-2">
                <BarList rows={d.played} fmt={(k) => eventLabel(k)} empty="Nobody has played with the desk or the Lab in this range" />
              </Panel>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-start">
              <Panel id="inbox" title={`Inbox${d.unread ? `, ${d.unread} new` : ""}`} className="lg:col-span-7 scroll-mt-20">
                <Inbox d={d} />
              </Panel>
              <div className="lg:col-span-5">{system}</div>
            </div>

            <Panel id="visits" title="Latest visits" className="scroll-mt-20" action={<span className="text-[12px] text-[var(--ink-3)]">{d.recent.length} most recent</span>}>
              <Visits d={d} />
            </Panel>
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-start">
            <div className="card lg:col-span-7 p-8 md:p-10">
              <p className="text-[13px] text-[var(--ink-3)]">{failed ? "The database is connected but could not be read" : "Not connected yet"}</p>
              <p className="mt-3 text-[28px] md:text-[34px] font-semibold leading-tight tracking-[-0.02em]">{failed ? "Check the Supabase connection string" : "Connect Supabase to start counting visits"}</p>
              <p className="mt-3 max-w-[520px] text-[14px] leading-relaxed text-[var(--ink-2)]">
                {failed
                  ? "Tables are created automatically, so this is usually the connection string or the pooler. The server logs say which."
                  : "Add the Supabase connection string in Vercel and redeploy. Visits, messages and the daily digest start straight away, and the tables are created for you."}
              </p>
            </div>
            <div className="lg:col-span-5">{system}</div>
          </div>
        )}
      </main>
    </div>
  );
}
