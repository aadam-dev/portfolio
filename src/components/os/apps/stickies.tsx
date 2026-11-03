"use client";

import { useOsText, useTextDir } from "../l10n";
import { useEffect, useState } from "react";
import { Sticky } from "../kit/parts";
import { visitSession } from "@/components/site/Tracker";

type Note = { id: number; name: string; body: string; rating: number | null };

let nowCache: Promise<string[]> | null = null;
let notesCache: Promise<Note[]> | null = null;

/** My stickies on the desktop, and the yellow one where visitors leave a note. */
export default function Stickies({ live }: { live: boolean }) {
  const t = useOsText().stickies;
  const dir = useTextDir();
  const [building, setBuilding] = useState<string[] | null>(null);
  useEffect(() => {
    nowCache ??= fetch("/api/now")
      .then((r) => r.json())
      .then((j) => (Array.isArray(j.building) ? j.building : []))
      .catch(() => []);
    let on = true;
    nowCache.then((b) => on && setBuilding(b));
    return () => {
      on = false;
    };
  }, []);
  return (
    <div className="absolute left-6 top-[200px] hidden w-[300px] md:block" dir={dir}>
      <div className="flex gap-3">
        <Sticky color="#fff2a8" tilt={-2} title={t.building} className="w-[140px]">
          {building && building.length ? (
            <ul className="space-y-0.5">
              {building.map((b) => (
                <li key={b}>· {b}</li>
              ))}
            </ul>
          ) : (
            <p>{t.buildingFallback}</p>
          )}
        </Sticky>
        <Sticky color="#ffc8d8" tilt={1.5} title={t.howTitle} className="w-[150px]">
          {t.how.map((x) => (
            <p key={x}>{x}</p>
          ))}
        </Sticky>
      </div>
      <GuestSticky live={live} />
    </div>
  );
}

export function GuestSticky({ live, className = "mt-4 w-[290px]" }: { live: boolean; className?: string }) {
  const t = useOsText().stickies;
  const [notes, setNotes] = useState<Note[]>([]);
  const [i, setI] = useState(0);
  const [mode, setMode] = useState<"read" | "write" | "sent" | "error">("read");
  const [rating, setRating] = useState(0);
  const tab = live ? 0 : -1;

  useEffect(() => {
    notesCache ??= fetch("/api/guest?kind=note")
      .then((r) => r.json())
      .then((j) => (Array.isArray(j.items) ? j.items : []))
      .catch(() => []);
    let on = true;
    notesCache.then((n) => on && setNotes(n));
    return () => {
      on = false;
    };
  }, []);
  // approved notes take turns, every few seconds
  useEffect(() => {
    if (mode !== "read" || notes.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % notes.length), 6000);
    return () => clearInterval(t);
  }, [mode, notes.length]);

  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const r = await fetch("/api/guest", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind: "note", name: f.get("name"), body: f.get("body"), rating: rating || undefined, website: f.get("website"), sid: visitSession() }),
    }).catch(() => null);
    setMode(r?.ok ? "sent" : "error");
  };

  const n = notes[i];
  return (
    <Sticky color="#fff7c2" tilt={-1} title={t.leave} className={className}>
      {mode === "read" && (
        <>
          {n ? (
            <figure>
              <blockquote>&ldquo;{n.body}&rdquo;</blockquote>
              <figcaption className="mt-1 text-[12px] text-black/55">
                {n.name || t.visitor} {n.rating ? <span className="text-[#c27c00]">{"★".repeat(n.rating)}</span> : null}
              </figcaption>
            </figure>
          ) : (
            <p>{t.first}</p>
          )}
          <button tabIndex={tab} onClick={() => setMode("write")} className="mt-2 rounded bg-black/80 px-2.5 py-1 font-sans text-[12px] text-white">
            {t.write}
          </button>
        </>
      )}
      {mode === "write" && (
        <form onSubmit={send} className="space-y-1.5 font-sans">
          <textarea name="body" required minLength={2} maxLength={600} rows={3} tabIndex={tab} placeholder={t.placeholder} className="w-full resize-none rounded border border-black/15 bg-white/70 p-1.5 text-[12.5px] outline-none" />
          <input name="name" maxLength={60} tabIndex={tab} placeholder={t.name} className="w-full rounded border border-black/15 bg-white/70 p-1.5 text-[12.5px] outline-none" />
          {/* bots fill this in; people never see it */}
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          <div className="flex items-center gap-1" role="radiogroup" aria-label={t.rating}>
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} type="button" tabIndex={tab} role="radio" aria-checked={rating === s} aria-label={t.stars(s)} onClick={() => setRating(rating === s ? 0 : s)} className={`text-[16px] ${s <= rating ? "text-[#c27c00]" : "text-black/25"}`}>
                ★
              </button>
            ))}
            <button type="submit" tabIndex={tab} className="ml-auto rounded bg-black/80 px-2.5 py-1 text-[12px] text-white">
              {t.pin}
            </button>
          </div>
          <p className="text-[10.5px] text-black/50">{t.shownAfter}</p>
        </form>
      )}
      {mode === "sent" && <p>{t.sent}</p>}
      {mode === "error" && (
        <p>
          {t.failed}{" "}
          <button tabIndex={tab} onClick={() => setMode("write")} className="underline">
            {t.retry}
          </button>
        </p>
      )}
    </Sticky>
  );
}
