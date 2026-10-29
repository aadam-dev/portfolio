import Board from "../../ui/Board";
import Tabs from "../../ui/Tabs";
import { load } from "../../ui/load";

export const dynamic = "force-dynamic";

export default async function Projects({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab = "projects" } = await searchParams;
  const d = await load(["project", "task", "ship"]);
  if (!d) return <p>The database is not connected yet.</p>;
  const projects = d.of("project").map((p) => ({ id: p.id, title: p.title }));
  return (
    <div>
      <h1 className="text-[26px] md:text-[30px] font-semibold tracking-[-0.02em] mb-4">Projects</h1>
      <Tabs
        base="/office/projects"
        on={tab}
        tabs={[
          ["projects", `Projects · ${d.of("project").length}`],
          ["tasks", `Tasks · ${d.of("task").filter((t) => t.status !== "done").length}`],
          ["shipped", `Shipped · ${d.of("ship").length}`],
        ]}
      />
      {tab === "tasks" ? <Board kind="task" rows={d.of("task")} projects={projects} /> : tab === "shipped" ? <Board kind="ship" rows={d.of("ship")} projects={projects} /> : <Board kind="project" rows={d.of("project")} />}
    </div>
  );
}
