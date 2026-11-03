"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { projectSlug, visibleProjects } from "@/lib/projects";
import { SERVICES } from "@/lib/services";

/** A small shell: who I am, what I've built, and a way in to each project. */
export default function TerminalApp({ openProject }: { openProject: (slug: string) => void }) {
  const [lines, setLines] = useState<string[]>(["Aadam OS terminal. Type help."]);
  const [cmd, setCmd] = useState("");
  const box = useRef<HTMLDivElement>(null);
  // keep the newest line in view, inside the terminal only (never scroll the page)
  useEffect(() => {
    const el = box.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);
  const projects = useMemo(() => visibleProjects(), []);
  const run = (raw: string) => {
    const [c, ...rest] = raw.trim().split(/\s+/);
    const arg = rest.join(" ").toLowerCase();
    const out: string[] = [];
    if (!c) return;
    if (c === "help") out.push("whoami · ls projects · open <name> · services · contact · clear");
    else if (c === "whoami") out.push("Aadam. Forward deployed engineer in Accra, GMT+0. I embed with your team and ship the system you run on.");
    else if (c === "ls") out.push(...projects.map((p) => `${projectSlug(p).padEnd(22)} ${p.categoryLabel}`));
    else if (c === "services") out.push(...SERVICES.map((s) => `${s.n} ${s.title}`));
    else if (c === "contact") out.push("adam@aadambuilds.dev · WhatsApp +233 55 960 2056 · or open Mail on the desktop");
    else if (c === "open") {
      const p = projects.find((x) => projectSlug(x) === arg || x.name.toLowerCase().includes(arg));
      if (p && arg) {
        openProject(projectSlug(p));
        out.push(`opening ${p.name}`);
      } else out.push(`no project called "${arg}". Try ls.`);
    } else if (c === "clear") {
      setLines([]);
      return;
    } else out.push(`${c}: not found. Try help.`);
    setLines((l) => [...l, `$ ${raw}`, ...out].slice(-200));
  };
  return (
    <div className="flex h-full flex-col bg-black/60 p-4 font-mono text-[12.5px] leading-relaxed text-[#d7e1cf]" onClick={(e) => (e.currentTarget.querySelector("input") as HTMLInputElement | null)?.focus()}>
      <div ref={box} className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap" data-lenis-prevent>
        {lines.map((l, i) => (
          <div key={i} className={l.startsWith("$ ") ? "text-white" : ""}>
            {l}
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(cmd);
          setCmd("");
        }}
        className="flex items-center gap-2"
      >
        <span className="text-[var(--accent-2)]">$</span>
        <input value={cmd} onChange={(e) => setCmd(e.target.value)} aria-label="Command" autoComplete="off" spellCheck={false} className="flex-1 bg-transparent text-white outline-none" />
      </form>
    </div>
  );
}
