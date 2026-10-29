import Board from "../../ui/Board";
import Tabs from "../../ui/Tabs";
import WorkoutStart from "../../ui/WorkoutStart";
import { load } from "../../ui/load";

export const dynamic = "force-dynamic";

export default async function Life({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab = "reading" } = await searchParams;
  const d = await load(["book", "workout", "grad", "note"]);
  if (!d) return <p>The database is not connected yet.</p>;
  return (
    <div>
      <h1 className="text-[26px] md:text-[30px] font-semibold tracking-[-0.02em] mb-4">Life</h1>
      <Tabs
        base="/office/life"
        on={tab}
        tabs={[
          ["reading", `Reading · ${d.of("book").length}`],
          ["workout", "Workout"],
          ["grad", `Grad school · ${d.of("grad").length}`],
          ["notes", `Notes · ${d.of("note").length}`],
        ]}
      />
      {tab === "workout" ? (
        <>
          <p className="mb-3 text-[13px] text-[var(--ink-3)]">The week at a glance. Drag a session to another day; open it to change the exercises.</p>
          {d.of("workout").length === 0 && (
            <div className="mb-4">
              <WorkoutStart />
            </div>
          )}
          <Board kind="workout" rows={d.of("workout")} compact />
        </>
      ) : tab === "grad" ? (
        <>
          <p className="mb-3 text-[13px] text-[var(--ink-3)]">Programmes, deadlines and what each application still needs. A new programme starts with a standard requirements list.</p>
          <Board kind="grad" rows={d.of("grad")} />
        </>
      ) : tab === "notes" ? (
        <Board kind="note" rows={d.of("note")} />
      ) : (
        <Board kind="book" rows={d.of("book")} />
      )}
    </div>
  );
}
