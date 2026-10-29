import Board from "../../ui/Board";
import { load } from "../../ui/load";
import { KINDS } from "@/lib/office/kinds";

export const dynamic = "force-dynamic";

const money = (n: number) => `GHS ${Math.round(n).toLocaleString("en-US")}`;
const num = (v: unknown) => Number(String(v ?? "").replace(/[^\d.]/g, "")) || 0;

export default async function Leads() {
  const d = await load(["lead"]);
  if (!d) return <p>The database is not connected yet.</p>;
  const rows = d.of("lead");
  return (
    <div>
      <h1 className="text-[26px] md:text-[30px] font-semibold tracking-[-0.02em]">Leads</h1>
      <p className="mt-1 mb-4 text-[13.5px] text-[var(--ink-3)]">Every website message and brief lands here. Add the ones from WhatsApp, calls and referrals too.</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {KINDS.lead.stages.map((s) => {
          const inStage = rows.filter((r) => r.status === s.id);
          return (
            <span key={s.id} className="rounded-xl border border-[var(--line)] px-3 py-2 text-[12.5px]">
              <span className="text-[var(--ink-3)]">{s.label}</span> <span className="tabular-nums">{inStage.length}</span>
              {inStage.some((r) => num(r.data.value)) && <span className="ml-1 text-[var(--ink-3)] tabular-nums">· {money(inStage.reduce((a, r) => a + num(r.data.value), 0))}</span>}
            </span>
          );
        })}
      </div>
      <Board kind="lead" rows={rows} />
    </div>
  );
}
