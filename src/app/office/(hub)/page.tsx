import Link from "next/link";
import { ArrowUpRight, BookOpen, CalendarClock, CircleDot, Hammer, Rocket, UserRoundPlus } from "lucide-react";
import { db } from "@/db";
import { today } from "@/lib/office/items";
import { KINDS, type Kind } from "@/lib/office/kinds";
import { stats } from "@/lib/office/stats";
import { Panel } from "../ui/parts";

export const dynamic = "force-dynamic";

const HREF: Partial<Record<Kind, string>> = { outreach: "/office/outreach", lead: "/office/leads", task: "/office/projects?tab=tasks", grad: "/office/life?tab=grad", project: "/office/projects" };
const stage = (k: string, s: string) => KINDS[k as Kind]?.stages.find((x) => x.id === s)?.label ?? s;
const late = (d: string, day: string) => {
  const n = Math.round((new Date(d).getTime() - new Date(day).getTime()) / 864e5);
  return n === 0 ? "today" : `${-n} day${n === -1 ? "" : "s"} late`;
};
const money = (n: number) => `GHS ${Math.round(n).toLocaleString("en-US")}`;

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-4 text-[13px] text-[var(--ink-3)]">{children}</p>;
}

export default async function Today() {
  const store = await db();
  if (!store) return <Panel title="Today">The database is not connected yet. See Settings.</Panel>;
  const t = await today(store);
  const s = await stats(store, 24).catch(() => null);
  const open = t.pipeline.filter((p) => !["won", "lost"].includes(p.status));
  const openValue = open.reduce((a, p) => a + p.value, 0);
  const won = t.pipeline.find((p) => p.status === "won");
  const hello = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "Africa/Accra" });

  return (
    <div className="space-y-4 md:space-y-5">
      <div>
        <p className="text-[13px] text-[var(--ink-3)]">{hello}</p>
        <h1 className="mt-1 text-[28px] md:text-[34px] font-semibold tracking-[-0.02em]">
          {t.due.length ? `${t.due.length} thing${t.due.length === 1 ? "" : "s"} need you today` : "Nothing is overdue"}
        </h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Open pipeline", value: money(openValue), sub: `${open.reduce((a, p) => a + p.n, 0)} leads`, href: "/office/leads" },
          { label: "Won", value: money(won?.value ?? 0), sub: `${won?.n ?? 0} leads`, href: "/office/leads" },
          { label: "Outreach", value: String(t.outreach.reduce((a, o) => a + o.n, 0)), sub: `${t.outreach.find((o) => o.status === "to-contact")?.n ?? 0} to contact`, href: "/office/outreach" },
          { label: "Visits, 24 hours", value: String(s?.totals.sessions ?? 0), sub: `${s?.totals.visitors ?? 0} people`, href: "/office/site?range=24h" },
        ].map((x) => (
          <Link key={x.label} href={x.href} className="card p-4 md:p-5 hover:border-[var(--line-strong)]">
            <p className="text-[12.5px] text-[var(--ink-3)]">{x.label}</p>
            <p className="mt-2 text-[24px] md:text-[26px] font-semibold tracking-[-0.02em] tabular-nums">{x.value}</p>
            <p className="mt-1 text-[12px] text-[var(--ink-3)]">{x.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-start">
        <Panel title="Due and overdue" className="lg:col-span-7" action={<CalendarClock className="w-4 h-4 text-[var(--ink-3)]" />}>
          {t.due.length ? (
            <ul className="divide-y divide-[var(--line)]">
              {t.due.map((it) => (
                <li key={it.id}>
                  <Link href={HREF[it.kind as Kind] ?? "/office"} className="flex items-center gap-3 py-2.5 hover:text-[var(--foreground)]">
                    <span className="rounded-full border border-[var(--line)] px-2 py-0.5 text-[11px] text-[var(--ink-3)]">{KINDS[it.kind as Kind]?.label}</span>
                    <span className="min-w-0 flex-1 truncate text-[13.5px]">{it.title}</span>
                    <span className="text-[12px] text-[var(--ink-3)]">{stage(it.kind, it.status)}</span>
                    <span className={`text-[12px] tabular-nums ${it.due! < t.day ? "text-[#f08a8a]" : "text-[#fab219]"}`}>{late(it.due!, t.day)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No follow-ups or deadlines today. Add next steps to leads and outreach to see them here.</Empty>
          )}
        </Panel>
        <Panel title="New leads" className="lg:col-span-5" action={<UserRoundPlus className="w-4 h-4 text-[var(--ink-3)]" />}>
          {t.leads.length ? (
            <ul className="space-y-2">
              {t.leads.map((l) => (
                <li key={l.id}>
                  <Link href="/office/leads" className="block rounded-xl border border-[var(--line)] p-3 hover:border-[var(--line-strong)]">
                    <p className="text-[13.5px] font-medium">{l.title}</p>
                    <p className="text-[12px] text-[var(--ink-3)] truncate">{String((l.data as { contact?: string }).contact ?? "")}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No new leads. Website messages and briefs land here.</Empty>
          )}
        </Panel>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 items-start">
        <Panel title="Building" action={<Hammer className="w-4 h-4 text-[var(--ink-3)]" />}>
          {t.building.length ? (
            <ul className="space-y-1.5 text-[13.5px]">
              {t.building.map((p) => (
                <li key={p.id} className="flex items-center gap-2">
                  <CircleDot className="w-3.5 h-3.5 text-[#3987e5]" /> {p.title}
                </li>
              ))}
            </ul>
          ) : (
            <Empty>Nothing in progress.</Empty>
          )}
          {t.doing.length > 0 && (
            <>
              <p className="mt-4 text-[12px] text-[var(--ink-3)]">Tasks in progress</p>
              <ul className="mt-1 space-y-1 text-[13px] text-[var(--ink-2)]">
                {t.doing.map((d) => (
                  <li key={d.id}>· {d.title}</li>
                ))}
              </ul>
            </>
          )}
        </Panel>
        <Panel title="Shipped, last 30 days" action={<Rocket className="w-4 h-4 text-[var(--ink-3)]" />}>
          {t.shipped.length ? (
            <ul className="space-y-1.5 text-[13.5px]">
              {t.shipped.map((x) => (
                <li key={x.id}>{x.title}</li>
              ))}
            </ul>
          ) : (
            <Empty>Log what goes out under Projects → Shipped.</Empty>
          )}
        </Panel>
        <Panel title="Reading" action={<BookOpen className="w-4 h-4 text-[var(--ink-3)]" />}>
          {t.reading.length ? (
            <ul className="space-y-1.5 text-[13.5px]">
              {t.reading.map((b) => (
                <li key={b.id}>
                  {b.title} <span className="text-[var(--ink-3)]">· {String((b.data as { author?: string }).author ?? "")}</span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>Nothing on the go.</Empty>
          )}
          <Link href="/office/life" className="mt-3 inline-flex items-center gap-1 text-[12.5px] text-[var(--ink-3)] hover:text-[var(--foreground)]">
            Life <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </Panel>
      </div>
    </div>
  );
}
