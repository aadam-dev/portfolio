"use client";

import { useState, type ReactNode } from "react";
import { KITS, PRESS_FILES, SHOTS, SNIPPETS, TEXTS, TRACKS, type FileKind } from "../content";

export type OpenFile = (app: "preview" | "code" | "text" | "numbers" | "doc" | "kits" | "music", file?: string) => void;

const BADGE: Record<FileKind, string> = { image: "PNG", code: "TS", text: "TXT", sheet: "XLSX", doc: "RTF", folder: "", pdf: "PDF", zip: "ZIP" };
const TINT: Partial<Record<FileKind, string>> = {
  sheet: "linear-gradient(160deg,#3ec46d,#0f7a3b)",
  doc: "linear-gradient(160deg,#f4f1ea,#d9d3c6)",
  text: "linear-gradient(160deg,#fbfaf7,#e5e1d8)",
  code: "linear-gradient(160deg,#2b2f36,#0e1116)",
  folder: "linear-gradient(180deg,#7cc4ff,#3b8ae6)",
  pdf: "linear-gradient(160deg,#ff6b5e,#c9302c)",
  zip: "linear-gradient(160deg,#b9b4a8,#7f7a70)",
};

export function FileGlyph({ kind, src, size = 44 }: { kind: FileKind; src?: string; size?: number }) {
  if (kind === "image" && src)
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" className="rounded-[6px] object-cover ring-1 ring-black/20" style={{ width: size, height: size * 0.72 }} />
    );
  return (
    <span className="relative grid place-items-center rounded-[8px] text-[11px] font-bold text-black/70 shadow" style={{ width: size * 0.82, height: size, background: TINT[kind] ?? "#ddd" }}>
      {kind === "folder" ? "" : BADGE[kind]}
      {kind === "code" && <span className="absolute inset-0 grid place-items-center font-mono text-[12px] text-[#9fe3a6]">{"{ }"}</span>}
    </span>
  );
}

type Folder = "desktop" | "screens" | "code" | "notes" | "music" | "press" | "kits";
const FOLDERS: [Folder, string][] = [
  ["desktop", "Desktop"],
  ["screens", "Screenshots"],
  ["code", "Code"],
  ["notes", "Notes"],
  ["music", "Music"],
  ["press", "Press kit"],
  ["kits", "Starter kits"],
];

/** Finder: every file on the desktop, by folder. Press kit files download. */
export default function FilesApp({ open, live, start = "desktop" }: { open: OpenFile; live: boolean; start?: Folder }) {
  const [at, setAt] = useState<Folder>(start);
  const tab = live ? 0 : -1;
  const item = (key: string, name: string, glyph: ReactNode, onOpen?: () => void, href?: string) => {
    const body = (
      <>
        <span className="grid h-14 place-items-center">{glyph}</span>
        <span className="mt-1 line-clamp-2 text-center text-[11.5px] leading-tight text-white/85">{name}</span>
      </>
    );
    return href ? (
      <a key={key} href={href} download tabIndex={tab} className="flex w-[96px] flex-col items-center rounded-lg p-2 hover:bg-white/[0.07]">
        {body}
      </a>
    ) : (
      <button key={key} onClick={onOpen} tabIndex={tab} className="flex w-[96px] flex-col items-center rounded-lg p-2 hover:bg-white/[0.07]">
        {body}
      </button>
    );
  };
  const shots = SHOTS.map((s) => item(s.id, s.name, <FileGlyph kind="image" src={s.src} />, () => open("preview", s.id)));
  const code = SNIPPETS.map((s) => item(s.id, s.name, <FileGlyph kind="code" />, () => open("code", s.id)));
  const notes = TEXTS.map((t) => item(t.id, t.name, <FileGlyph kind="text" />, () => open("text", t.id)));
  const docs = [item("doc", "About.rtf", <FileGlyph kind="doc" />, () => open("doc")), item("sheet", "harmattan-model.xlsx", <FileGlyph kind="sheet" />, () => open("numbers"))];
  const tracks = TRACKS.map((t) => item(t.id, `${t.title}.mp3`, <span className="grid h-11 w-11 place-items-center rounded-lg text-white" style={{ background: t.tone }}>♪</span>, () => open("music", t.id)));
  const press = PRESS_FILES.map((f) => item(f.name, f.name, <FileGlyph kind={f.kind} src={f.kind === "image" && f.name.endsWith(".png") ? f.href : undefined} />, undefined, f.href));
  const kits = KITS.map((k) => item(k.id, `${k.name}.kit`, <span className="grid h-11 w-11 place-items-center rounded-xl text-[18px] text-white" style={{ background: k.tone }}>◆</span>, () => open("kits", k.id)));
  const view: Record<Folder, ReactNode[]> = {
    desktop: [...docs, ...shots.slice(0, 2), ...code.slice(0, 1), ...notes],
    screens: shots,
    code,
    notes: [...notes, ...docs],
    music: tracks,
    press,
    kits,
  };
  return (
    <div className="flex h-full">
      <nav aria-label="Folders" className="w-[150px] shrink-0 space-y-0.5 border-r border-white/10 bg-white/[0.03] p-2 text-[12.5px]">
        <p className="px-2 pb-1 pt-1 text-[10.5px] uppercase tracking-[0.14em] text-white/40">Favourites</p>
        {FOLDERS.map(([id, label]) => (
          <button key={id} tabIndex={tab} onClick={() => setAt(id)} aria-current={at === id} className={`block w-full rounded-md px-2 py-1.5 text-left ${at === id ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/[0.06]"}`}>
            {label}
          </button>
        ))}
      </nav>
      <div className="min-w-0 flex-1 p-3">
        {at === "press" && <p className="mb-2 px-1 text-[12px] text-white/55">For anyone writing about my work. Click a file to download it.</p>}
        <div className="flex flex-wrap content-start gap-1">{view[at]}</div>
      </div>
    </div>
  );
}
