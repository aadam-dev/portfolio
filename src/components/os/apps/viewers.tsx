"use client";

import { useOsText } from "../l10n";
import { useState } from "react";
import { SHOTS, SNIPPETS, TEXTS, type Annotation } from "../content";

/* ------------------------------------------------------------------ Preview: screenshots with my markup */

export function PreviewApp({ file, live }: { file?: string; live: boolean }) {
  const [id, setId] = useState(file ?? SHOTS[0].id);
  const [markup, setMarkup] = useState(true);
  const t = useOsText().preview;
  const shot = SHOTS.find((s) => s.id === id) ?? SHOTS[0];
  const tab = live ? 0 : -1;
  return (
    <div className="flex h-full bg-[#1b1a19]">
      <aside className="hidden w-[120px] shrink-0 space-y-2 overflow-y-auto border-r border-white/10 p-2 sm:block" data-lenis-prevent>
        {SHOTS.map((s) => (
          <button key={s.id} tabIndex={tab} onClick={() => setId(s.id)} className={`block w-full rounded-md p-1 ${s.id === id ? "bg-[#2463eb]" : "hover:bg-white/10"}`} aria-label={s.name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt="" className="aspect-[16/10] w-full rounded object-cover" />
          </button>
        ))}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-1.5 text-[12px] text-white/70">
          <span className="truncate">{shot.name}</span>
          <button tabIndex={tab} onClick={() => setMarkup((m) => !m)} aria-pressed={markup} className={`ml-auto rounded-md px-2 py-0.5 ${markup ? "bg-[#ff5b1f]/25 text-[#ffb48f]" : "hover:bg-white/10"}`}>
            ✎ {t.markup}
          </button>
        </div>
        <div className="relative grid min-h-0 flex-1 place-items-center p-3">
          <figure className="relative max-h-full w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shot.src} alt={shot.caption} className="w-full rounded shadow-2xl" />
            {markup && <Marks marks={shot.marks} />}
          </figure>
        </div>
        <p className="border-t border-white/10 px-3 py-1.5 text-[11.5px] text-white/50">{shot.caption}</p>
      </div>
    </div>
  );
}

/** Hand-drawn style rings, arrows and notes over a screenshot, in the site's orange. */
function Marks({ marks }: { marks: Annotation[] }) {
  return (
    <>
      <svg viewBox="0 0 100 62.5" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <defs>
          <marker id="tip" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#ff5b1f" />
          </marker>
        </defs>
        {marks.map((m, i) => {
          const X = m.x * 100;
          const Y = m.y * 62.5;
          if (m.kind === "ring") {
            const w = (m.w ?? 0.1) * 100;
            const h = (m.h ?? 0.1) * 62.5;
            // two slightly offset ellipses read as a quick pen loop
            return (
              <g key={i} fill="none" stroke="#ff5b1f" strokeLinecap="round" vectorEffect="non-scaling-stroke">
                <ellipse cx={X + w / 2} cy={Y + h / 2} rx={w / 2 + 1} ry={h / 2 + 1} strokeWidth={2.6} vectorEffect="non-scaling-stroke" />
                <ellipse cx={X + w / 2 + 0.4} cy={Y + h / 2 - 0.3} rx={w / 2 + 1.6} ry={h / 2 + 0.6} strokeWidth={1.2} opacity={0.7} vectorEffect="non-scaling-stroke" />
              </g>
            );
          }
          if (m.kind === "arrow") {
            const tx = (m.tx ?? m.x) * 100;
            const ty = (m.ty ?? m.y) * 62.5;
            const mx = (X + tx) / 2 + (ty - Y) * 0.15;
            const my = (Y + ty) / 2 - (tx - X) * 0.15;
            return <path key={i} d={`M${X},${Y} Q${mx},${my} ${tx},${ty}`} fill="none" stroke="#ff5b1f" strokeWidth={2.6} markerEnd="url(#tip)" strokeLinecap="round" vectorEffect="non-scaling-stroke" />;
          }
          return null;
        })}
      </svg>
      {marks.map(
        (m, i) =>
          m.text && (
            <span
              key={i}
              className="pointer-events-none absolute max-w-[46%] -translate-y-full rounded bg-[#fff2a8] px-1.5 py-0.5 text-[11px] leading-tight text-[#3a2a00] shadow"
              style={{
                left: `${Math.min(m.x * 100, 70)}%`,
                top: `${m.kind === "arrow" ? m.y * 100 : m.y * 100 - 1}%`,
                fontFamily: "'Marker Felt','Segoe Print','Bradley Hand',cursive",
                transform: `translateY(-100%) rotate(${i % 2 ? 1.5 : -1.5}deg)`,
              }}
            >
              {m.text}
            </span>
          ),
      )}
    </>
  );
}

/* ------------------------------------------------------------------ Code: snippets with light highlighting */

const KEYWORDS = /\b(export|function|const|let|return|await|async|import|from|type|select|from|join|on|where|order|by|limit|as|desc|round|nullif|abs)\b/g;

function highlight(line: string, lang: string) {
  const parts: { t: string; c?: string }[] = [];
  const comment = lang === "sql" ? line.indexOf("--") : line.indexOf("//");
  const code = comment >= 0 ? line.slice(0, comment) : line;
  const rest = comment >= 0 ? line.slice(comment) : "";
  const re = /(`[^`]*`?|"[^"]*"|'[^']*')|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)/g;
  let last = 0;
  for (const m of code.matchAll(re)) {
    if (m.index! > last) parts.push({ t: code.slice(last, m.index) });
    const tok = m[0];
    const c = m[1] ? "#f4c389" : m[2] ? "#b5a2ff" : new RegExp(`^${KEYWORDS.source}$`, "i").test(tok) ? "#ff8a5c" : undefined;
    parts.push({ t: tok, c });
    last = m.index! + tok.length;
  }
  parts.push({ t: code.slice(last) });
  if (rest) parts.push({ t: rest, c: "#7d8590" });
  return parts;
}

export function CodeApp({ file }: { file?: string }) {
  const s = SNIPPETS.find((x) => x.id === file) ?? SNIPPETS[0];
  return (
    <div className="h-full overflow-auto bg-[#0e1116] p-4 font-mono text-[12.5px] leading-[1.7] text-[#c9d1d9]" data-lenis-prevent>
      {s.code.split("\n").map((l, i) => (
        <div key={i} className="whitespace-pre">
          <span className="mr-4 inline-block w-6 select-none text-right text-white/25">{i + 1}</span>
          {highlight(l, s.lang).map((p, k) => (
            <span key={k} style={p.c ? { color: p.c } : undefined}>
              {p.t}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ TextEdit for plain notes */

export function TextApp({ file }: { file?: string }) {
  const t = TEXTS.find((x) => x.id === file) ?? TEXTS[0];
  return <pre className="h-full overflow-auto whitespace-pre-wrap bg-[#fbfaf7] p-5 font-mono text-[12.5px] leading-relaxed text-[#2a2620]" data-lenis-prevent>{t.body}</pre>;
}
