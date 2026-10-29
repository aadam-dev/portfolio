"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import { CalendarClock, ExternalLink, GitBranch, Mail, MessageCircle, Plus, Search } from "lucide-react";
import { fillTemplate, KINDS, mailLink, waLink, type Kind } from "@/lib/office/kinds";
import { moveCard, saveItem, touched } from "../actions";
import Editor, { type Row } from "./Editor";

const TONE: Record<string, string> = { good: "#0ca30c", warn: "#fab219", accent: "#3987e5", muted: "rgba(242,238,230,0.35)" };
const today = () => new Date().toISOString().slice(0, 10);
const days = (d: string) => Math.round((new Date(d).getTime() - new Date(today()).getTime()) / 864e5);
const when = (d: string) => {
  const n = days(d);
  return n === 0 ? "today" : n === 1 ? "tomorrow" : n === -1 ? "yesterday" : n < 0 ? `${-n} days late` : n < 7 ? `in ${n} days` : new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};
const s = (v: unknown) => (typeof v === "string" ? v : "");

type Op = { type: "move"; id: number; status: string; sort: number } | { type: "add"; row: Row };

/** A kanban board for one kind: drag between stages, quick-add, open a card to edit. */
export default function Board({
  kind,
  rows,
  projects = [],
  templates = [],
  stages,
  compact = false,
}: {
  kind: Kind;
  rows: Row[];
  projects?: { id: number; title: string }[];
  templates?: Row[];
  stages?: string[];
  compact?: boolean;
}) {
  const def = KINDS[kind];
  const cols = def.stages.filter((st) => !stages || stages.includes(st.id));
  const [, start] = useTransition();
  const [list, apply] = useOptimistic(rows, (cur: Row[], op: Op) =>
    op.type === "move" ? cur.map((r) => (r.id === op.id ? { ...r, status: op.status, sort: op.sort } : r)) : [...cur, op.row],
  );
  const [open, setOpen] = useState<Row | null>(null);
  const [q, setQ] = useState("");
  const [drag, setDrag] = useState<number | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [adding, setAdding] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [msg, setMsg] = useState<Row | null>(null);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return list.filter((r) => !needle || `${r.title} ${Object.values(r.data ?? {}).join(" ")}`.toLowerCase().includes(needle));
  }, [list, q]);
  const byStage = (id: string) => shown.filter((r) => r.status === id).sort((a, b) => a.sort - b.sort);
  const projectName = (id: number | null) => projects.find((p) => p.id === id)?.title;

  const drop = (status: string, beforeId: number | null) => {
    if (drag == null) return;
    const colRows = byStage(status).filter((r) => r.id !== drag);
    const idx = beforeId == null ? colRows.length : colRows.findIndex((r) => r.id === beforeId);
    const prev = colRows[idx - 1]?.sort ?? null;
    const next = colRows[idx]?.sort ?? null;
    const sort = prev != null && next != null ? (prev + next) / 2 : prev != null ? prev + 1 : next != null ? next - 1 : 0;
    const id = drag;
    setDrag(null);
    setOver(null);
    start(async () => {
      apply({ type: "move", id, status, sort });
      await moveCard(id, status, prev, next);
    });
  };

  const add = (status: string) => {
    const title = draft.trim();
    if (!title) return setAdding(null);
    setDraft("");
    start(async () => {
      apply({ type: "add", row: { id: -Date.now(), kind, title, status, priority: 0, due: null, projectId: null, data: {}, sort: 1e9, createdAt: new Date(), updatedAt: new Date() } });
      await saveItem({ kind, title, status });
    });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <label className="flex items-center gap-2 h-10 px-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[13px] w-full max-w-[320px]">
          <Search className="w-4 h-4 text-[var(--ink-3)]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${def.plural.toLowerCase()}`} className="flex-1 bg-transparent outline-none placeholder:text-[var(--ink-4)]" />
        </label>
        <span className="text-[12px] text-[var(--ink-3)] tabular-nums">{shown.length}</span>
      </div>
      <div className="-mx-4 md:mx-0 px-4 md:px-0 overflow-x-auto pb-2 snap-x md:snap-none" data-lenis-prevent>
        <div className="flex gap-3" style={{ minWidth: cols.length > 1 ? cols.length * (compact ? 220 : 260) : undefined }}>
          {cols.map((col) => {
            const cards = byStage(col.id);
            return (
              <section
                key={col.id}
                aria-label={col.label}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOver(col.id);
                }}
                onDragLeave={() => setOver((o) => (o === col.id ? null : o))}
                onDrop={() => drop(col.id, null)}
                className={`snap-start flex-1 min-w-[220px] rounded-2xl border p-2 transition-colors ${over === col.id ? "border-[var(--accent)] bg-[var(--tint)]" : "border-[var(--line)] bg-[var(--surface)]/40"}`}
              >
                <h3 className="flex items-center gap-2 px-1.5 pt-1 pb-2 text-[12.5px] font-medium text-[var(--ink-2)]">
                  <span className="w-2 h-2 rounded-full" style={{ background: TONE[col.tone ?? ""] ?? "rgba(242,238,230,0.5)" }} />
                  {col.label}
                  <span className="ml-auto text-[var(--ink-4)] tabular-nums">{cards.length}</span>
                </h3>
                <ul className="space-y-2 min-h-[40px]">
                  {cards.map((r) => (
                    <li
                      key={r.id}
                      draggable={r.id > 0}
                      onDragStart={() => setDrag(r.id)}
                      onDragEnd={() => setDrag(null)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.stopPropagation();
                        drop(col.id, r.id);
                      }}
                      className={`group rounded-xl border border-[var(--line)] bg-[var(--surface-2)] hover:border-[var(--line-strong)] transition ${drag === r.id ? "opacity-40" : ""}`}
                    >
                      <button type="button" onClick={() => r.id > 0 && setOpen(r)} className="block w-full text-left p-3">
                        <Card kind={kind} r={r} project={projectName(r.projectId)} />
                      </button>
                      {kind === "outreach" && (
                        <div className="flex gap-1.5 px-3 pb-3 -mt-1">
                          <button type="button" onClick={() => setMsg(r)} className="pill !h-8 !px-3 !text-[12px]">
                            <MessageCircle className="w-3.5 h-3.5" /> Message
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                {def.stages.length > 0 &&
                  (adding === col.id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        add(col.id);
                      }}
                      className="mt-2"
                    >
                      <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={() => add(col.id)} placeholder={`New ${def.label.toLowerCase()}`} className="field !h-10 !text-[13.5px]" />
                    </form>
                  ) : (
                    <button type="button" onClick={() => setAdding(col.id)} className="mt-2 w-full flex items-center gap-1.5 h-10 px-2 rounded-xl text-[12.5px] text-[var(--ink-3)] hover:text-[var(--foreground)] hover:bg-[var(--tint)]">
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  ))}
              </section>
            );
          })}
        </div>
      </div>
      {open && <Editor row={open} projects={projects} onClose={() => setOpen(null)} />}
      {msg && <Composer row={msg} templates={templates} onClose={() => setMsg(null)} />}
    </div>
  );
}

function Card({ kind, r, project }: { kind: Kind; r: Row; project?: string }) {
  const d = r.data ?? {};
  const late = r.due && days(r.due) < 0;
  const due = r.due && (
    <span className={`inline-flex items-center gap-1 text-[11.5px] ${late ? "text-[#f08a8a]" : days(r.due) <= 1 ? "text-[#fab219]" : "text-[var(--ink-3)]"}`}>
      <CalendarClock className="w-3 h-3" /> {KINDS[kind].due ? `${KINDS[kind].due}: ` : ""}
      {when(r.due)}
    </span>
  );
  const sub =
    kind === "project"
      ? [s(d.client) !== r.title ? s(d.client) : "", s(d.stack)].filter(Boolean).join(" · ")
      : kind === "lead"
        ? [s(d.contact), s(d.value) && `GHS ${s(d.value)}`].filter(Boolean).join(" · ")
        : kind === "outreach"
          ? [s(d.sector), s(d.area), s(d.channel)].filter(Boolean).join(" · ")
          : kind === "book"
            ? s(d.author)
            : kind === "grad"
              ? [s(d.school), s(d.country)].filter(Boolean).join(" · ")
              : kind === "task"
                ? project ?? ""
                : "";
  const check = Array.isArray(d.checklist) ? (d.checklist as { done: boolean }[]) : null;
  return (
    <>
      <p className="text-[13.5px] font-medium leading-snug text-[var(--foreground)]">{r.title}</p>
      {sub && <p className="mt-0.5 text-[12px] text-[var(--ink-3)] truncate">{sub}</p>}
      {kind === "lead" && s(d.next) && <p className="mt-1 text-[12px] text-[var(--ink-2)]">Next: {s(d.next)}</p>}
      {kind === "workout" && s(d.exercises) && <p className="mt-1 whitespace-pre-line text-[12px] leading-relaxed text-[var(--ink-2)] line-clamp-4">{s(d.exercises)}</p>}
      {check && (
        <div className="mt-2">
          <div className="h-1.5 rounded-full bg-[rgba(242,238,230,0.06)]">
            <div className="h-full rounded-full bg-[#3987e5]" style={{ width: `${(check.filter((c) => c.done).length / Math.max(1, check.length)) * 100}%` }} />
          </div>
          <p className="mt-1 text-[11px] text-[var(--ink-3)] tabular-nums">
            {check.filter((c) => c.done).length}/{check.length} requirements
          </p>
        </div>
      )}
      {(due || (kind === "project" && (s(d.url) || s(d.repo)))) && (
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          {due}
          {kind === "project" && s(d.url) && (
            <span className="inline-flex min-w-0 max-w-full items-center gap-1 text-[11.5px] text-[var(--ink-3)]">
              <ExternalLink className="w-3 h-3 shrink-0" /> <span className="truncate">{s(d.url).replace(/^https?:\/\//, "").split("/")[0]}</span>
            </span>
          )}
          {kind === "project" && s(d.pushed) && (
            <span className="inline-flex items-center gap-1 text-[11.5px] text-[var(--ink-4)]">
              <GitBranch className="w-3 h-3" /> {new Date(s(d.pushed)).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </span>
          )}
        </div>
      )}
    </>
  );
}

/** Pick a template, see the filled message, open WhatsApp or email, and log the touch. */
function Composer({ row, templates, onClose }: { row: Row; templates: Row[]; onClose: () => void }) {
  const d = row.data ?? {};
  const [t, setT] = useState(templates[0]?.id ?? 0);
  const tpl = templates.find((x) => x.id === t);
  const [text, setText] = useState(() => (tpl ? fillTemplate(s(tpl.data.body), row) : ""));
  const [subject, setSubject] = useState(() => (tpl ? fillTemplate(s(tpl.data.subject), row) : ""));
  const [, start] = useTransition();
  const phone = s(d.phone);
  const email = s(d.email);
  const pick = (id: number) => {
    setT(id);
    const x = templates.find((y) => y.id === id);
    if (x) {
      setText(fillTemplate(s(x.data.body), row));
      setSubject(fillTemplate(s(x.data.subject), row));
    }
  };
  const log = (channel: string) => start(async () => void (await touched(row.id, channel)));
  return (
    <div className="fixed inset-0 z-50 grid place-items-end md:place-items-center bg-black/60 p-0 md:p-6" onClick={onClose}>
      <div role="dialog" aria-label={`Message ${row.title}`} className="card w-full md:max-w-[560px] rounded-b-none md:rounded-2xl p-5 max-h-[90svh] overflow-y-auto" onClick={(e) => e.stopPropagation()} data-lenis-prevent>
        <p className="text-[12.5px] text-[var(--ink-3)]">Message</p>
        <p className="text-[18px] font-semibold">{row.title}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {templates.map((x) => (
            <button key={x.id} type="button" onClick={() => pick(x.id)} aria-pressed={t === x.id} className="pill !h-8 !text-[12px]">
              {x.title}
            </button>
          ))}
        </div>
        {tpl?.data.channel === "Email" && <input value={subject} onChange={(e) => setSubject(e.target.value)} className="field mt-3" aria-label="Subject" />}
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} className="field mt-3 !h-auto py-3 leading-relaxed" aria-label="Message" />
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={phone ? waLink(phone, text) : undefined} target="_blank" rel="noreferrer" onClick={() => phone && log("WhatsApp")} aria-disabled={!phone} className={`btn btn-solid !h-11 ${phone ? "" : "pointer-events-none opacity-40"}`}>
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
          <a href={email ? mailLink(email, subject || row.title, text) : undefined} onClick={() => email && log("Email")} aria-disabled={!email} className={`btn btn-line !h-11 ${email ? "" : "pointer-events-none opacity-40"}`}>
            <Mail className="w-4 h-4" /> Email
          </a>
          <button type="button" onClick={() => navigator.clipboard?.writeText(text)} className="btn btn-line !h-11">
            Copy
          </button>
          <button type="button" onClick={onClose} className="btn btn-line !h-11 ml-auto">
            Close
          </button>
        </div>
        {!phone && !email && <p className="mt-3 text-[12.5px] text-[var(--ink-3)]">Add a phone number or an email to this business to send from here.</p>}
        <p className="mt-3 text-[12px] text-[var(--ink-4)]">Sending logs a touch, moves “To contact” to “Contacted” and sets a follow-up in 3 days.</p>
      </div>
    </div>
  );
}
