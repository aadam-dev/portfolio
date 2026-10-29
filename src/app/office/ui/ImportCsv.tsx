"use client";

import { useState, useTransition } from "react";
import { Upload } from "lucide-react";
import { importOutreach } from "../actions";

/** Paste a list (or pick a .csv): name, sector, area, phone, email, person, notes. */
export default function ImportCsv() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const run = () =>
    start(async () => {
      const r = await importOutreach(text);
      setNote(`Added ${r.added} business${r.added === 1 ? "" : "es"}.`);
      setText("");
    });
  if (!open)
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn btn-line !h-10 !px-4 !text-[13px]">
        <Upload className="w-4 h-4" /> Import a list
      </button>
    );
  return (
    <div className="card p-4 w-full">
      <p className="text-[13px] text-[var(--ink-2)]">Paste rows from a sheet, or pick a CSV file. Columns: name, sector, area, phone, email, person, notes (a header row is fine).</p>
      <input
        type="file"
        accept=".csv,text/csv,text/plain"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) setText(await f.text());
        }}
        className="mt-3 block text-[13px] text-[var(--ink-3)]"
      />
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} className="field mt-3 !h-auto py-2.5 font-mono !text-[12.5px]" placeholder={"name,sector,area,phone\nKoflex Fitness,Fitness,East Legon,+233…"} />
      <div className="mt-3 flex items-center gap-2">
        <button type="button" onClick={run} disabled={pending || !text.trim()} className="btn btn-solid !h-10 !px-4 !text-[13px]">
          {pending ? "Adding…" : "Add to outreach"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="btn btn-line !h-10 !px-4 !text-[13px]">
          Close
        </button>
        {note && <span className="text-[12.5px] text-[var(--ink-3)]">{note}</span>}
      </div>
    </div>
  );
}
