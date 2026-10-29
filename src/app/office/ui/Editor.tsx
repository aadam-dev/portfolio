"use client";

import { useEffect, useState, useTransition } from "react";
import { Check, Plus, Trash2, X } from "lucide-react";
import { KINDS, type Field, type Kind } from "@/lib/office/kinds";
import { addNote, itemHistory, leadStage, removeItem, saveItem } from "../actions";

export interface Row {
  id: number;
  kind: string;
  title: string;
  status: string;
  priority: number;
  due: string | null;
  projectId: number | null;
  data: Record<string, unknown>;
  sort: number;
  createdAt: Date;
  updatedAt: Date;
}

type Check = { text: string; done: boolean };

/** Edit one item: title, stage, date, project and the kind's own fields; history and notes below. */
export default function Editor({ row, projects = [], onClose }: { row: Row; projects?: { id: number; title: string }[]; onClose: () => void }) {
  const kind = row.kind as Kind;
  const def = KINDS[kind];
  const [title, setTitle] = useState(row.title);
  const [status, setStatus] = useState(row.status);
  const [due, setDue] = useState(row.due ?? "");
  const [projectId, setProjectId] = useState<number | null>(row.projectId);
  const [data, setData] = useState<Record<string, unknown>>(row.data ?? {});
  const [note, setNote] = useState("");
  const [history, setHistory] = useState<{ at: string; text: string }[] | null>(null);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let live = true;
    itemHistory(row.id)
      .then((h) => live && setHistory(h))
      .catch(() => live && setHistory([]));
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => {
      live = false;
      window.removeEventListener("keydown", esc);
    };
  }, [row.id, onClose]);

  const set = (k: string, v: unknown) => setData((d) => ({ ...d, [k]: v }));
  const save = () =>
    start(async () => {
      if (kind === "lead" && status !== row.status) await leadStage(row.id, status);
      await saveItem({ id: row.id, kind, title, status, due, projectId, data });
      if (note.trim()) await addNote(row.id, note);
      setSaved(true);
      setTimeout(onClose, 250);
    });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/55" onClick={onClose}>
      <aside role="dialog" aria-label={`Edit ${row.title}`} className="h-full w-full max-w-[520px] overflow-y-auto border-l border-[var(--line)] bg-[var(--background)] p-5 md:p-6" onClick={(e) => e.stopPropagation()} data-lenis-prevent>
        <div className="flex items-center gap-2">
          <p className="text-[12.5px] text-[var(--ink-3)]">{def.label}</p>
          <button type="button" onClick={onClose} aria-label="Close" className="ml-auto grid place-items-center w-10 h-10 rounded-full border border-[var(--line)] hover:bg-[var(--tint)]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Title" className="mt-2 w-full bg-transparent text-[22px] font-semibold tracking-[-0.01em] outline-none border-b border-transparent focus:border-[var(--line-strong)] pb-1" />

        <div className="mt-4 grid grid-cols-2 gap-3">
          {def.stages.length > 1 && (
            <label className="block">
              <span className="label">Stage</span>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="field mt-1">
                {def.stages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          )}
          {def.due && (
            <label className="block">
              <span className="label">{def.due}</span>
              <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className="field mt-1" />
            </label>
          )}
          {def.project && (
            <label className="block col-span-2">
              <span className="label">Project</span>
              <select value={projectId ?? ""} onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : null)} className="field mt-1">
                <option value="">None</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <div className="mt-4 space-y-3">
          {def.fields.map((f) => (
            <FieldInput key={f.key} f={f} value={data[f.key]} onChange={(v) => set(f.key, v)} />
          ))}
        </div>

        {kind === "project" && typeof data.caseStudy === "string" && (
          <a href={data.caseStudy} target="_blank" rel="noreferrer" className="mt-3 inline-block text-[13px] text-[var(--ink-2)] underline underline-offset-4">
            Open the case study
          </a>
        )}

        <label className="block mt-5">
          <span className="label">Add a note to the history</span>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="field mt-1 !h-auto py-2.5" placeholder="Called, sent the proposal, met at the shop…" />
        </label>

        <div className="mt-5 flex items-center gap-2">
          <button type="button" onClick={save} disabled={pending} className="btn btn-solid !h-11 !px-5">
            {saved ? <Check className="w-4 h-4" /> : null} {pending ? "Saving…" : "Save"}
          </button>
          <button type="button" onClick={onClose} className="btn btn-line !h-11">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete “${row.title}”?`)) start(async () => {
                await removeItem(row.id);
                onClose();
              });
            }}
            className="ml-auto grid place-items-center w-11 h-11 rounded-full border border-[var(--line)] text-[var(--ink-3)] hover:text-[#f08a8a] hover:border-[#d03b3b]/50"
            aria-label="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <h3 className="mt-7 text-[12.5px] text-[var(--ink-3)]">History</h3>
        <ol className="mt-2 space-y-1.5 text-[12.5px]">
          {history === null ? (
            <li className="text-[var(--ink-4)]">Loading…</li>
          ) : history.length ? (
            history.map((h, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 w-[86px] text-[var(--ink-4)] tabular-nums">{new Date(h.at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                <span className="text-[var(--ink-2)]">{h.text}</span>
              </li>
            ))
          ) : (
            <li className="text-[var(--ink-4)]">Nothing yet.</li>
          )}
        </ol>
      </aside>
    </div>
  );
}

function FieldInput({ f, value, onChange }: { f: Field; value: unknown; onChange: (v: unknown) => void }) {
  if (f.type === "checklist") {
    const list = Array.isArray(value) ? (value as Check[]) : [];
    return (
      <div>
        <span className="label">{f.label}</span>
        <ul className="mt-1 space-y-1">
          {list.map((c, i) => (
            <li key={i} className="flex items-center gap-2">
              <button type="button" onClick={() => onChange(list.map((x, j) => (j === i ? { ...x, done: !x.done } : x)))} aria-pressed={c.done} aria-label={c.done ? "Mark not done" : "Mark done"} className={`grid place-items-center w-6 h-6 rounded-md border ${c.done ? "bg-[#0ca30c] border-[#0ca30c]" : "border-[var(--line-strong)]"}`}>
                {c.done && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
              <input value={c.text} onChange={(e) => onChange(list.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))} className={`flex-1 bg-transparent text-[13.5px] outline-none ${c.done ? "line-through text-[var(--ink-3)]" : ""}`} />
              <button type="button" onClick={() => onChange(list.filter((_, j) => j !== i))} aria-label="Remove" className="text-[var(--ink-4)] hover:text-[var(--foreground)]">
                <X className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => onChange([...list, { text: "", done: false }])} className="mt-1.5 inline-flex items-center gap-1 text-[12.5px] text-[var(--ink-3)] hover:text-[var(--foreground)]">
          <Plus className="w-3.5 h-3.5" /> Add a requirement
        </button>
      </div>
    );
  }
  const v = typeof value === "string" ? value : "";
  return (
    <label className="block">
      <span className="label">{f.label}</span>
      {f.type === "select" ? (
        <select value={v} onChange={(e) => onChange(e.target.value)} className="field mt-1">
          <option value="">Not set</option>
          {f.options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : f.type === "textarea" ? (
        <textarea value={v} onChange={(e) => onChange(e.target.value)} rows={4} className="field mt-1 !h-auto py-2.5 leading-relaxed" placeholder={f.placeholder} />
      ) : (
        <input type={f.type === "money" ? "text" : f.type} inputMode={f.type === "money" ? "decimal" : undefined} value={v} onChange={(e) => onChange(e.target.value)} className="field mt-1" placeholder={f.placeholder} />
      )}
    </label>
  );
}
