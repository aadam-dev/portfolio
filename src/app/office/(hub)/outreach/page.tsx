import { Download } from "lucide-react";
import Board from "../../ui/Board";
import ImportCsv from "../../ui/ImportCsv";
import Tabs from "../../ui/Tabs";
import { load } from "../../ui/load";

export const dynamic = "force-dynamic";

export default async function Outreach({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab = "tracker" } = await searchParams;
  const d = await load(["outreach", "template"]);
  if (!d) return <p>The database is not connected yet.</p>;
  const rows = d.of("outreach");
  const due = rows.filter((r) => r.due && r.due <= new Date().toISOString().slice(0, 10) && !["won", "lost", "not-now"].includes(r.status)).length;
  return (
    <div>
      <h1 className="text-[26px] md:text-[30px] font-semibold tracking-[-0.02em]">Outreach</h1>
      <p className="mt-1 mb-4 text-[13.5px] text-[var(--ink-3)]">
        Businesses to reach, what I could build them, and when to follow up. {due ? `${due} follow-up${due === 1 ? "" : "s"} due.` : ""}
      </p>
      <Tabs
        base="/office/outreach"
        on={tab}
        tabs={[
          ["tracker", `Tracker · ${rows.length}`],
          ["templates", `Messages · ${d.of("template").length}`],
        ]}
      />
      {tab === "templates" ? (
        <>
          <p className="mb-3 text-[13px] text-[var(--ink-3)]">Templates fill in {"{name}"}, {"{business}"} and {"{pitch}"} from each business.</p>
          <Board kind="template" rows={d.of("template")} />
        </>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-start gap-2">
            <ImportCsv />
            <a href="/office/outreach/export" className="btn btn-line !h-10 !px-4 !text-[13px]">
              <Download className="w-4 h-4" /> Export CSV
            </a>
          </div>
          <Board kind="outreach" rows={rows} templates={d.of("template")} compact />
        </>
      )}
    </div>
  );
}
