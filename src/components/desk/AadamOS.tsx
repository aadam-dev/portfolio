"use client";

import { useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";
import { projectSlug, type Project } from "@/lib/projects";
import { Window, nextZ, type WinFrame } from "@/components/os/kit/Window";
import { Dock, type DockItem } from "@/components/os/kit/Dock";
import { DesktopIcon, MenuBar } from "@/components/os/kit/parts";
import ProjectApp, { dockProjects, findBySlug, thumb, type Tab } from "@/components/os/apps/project";
import ServicesNotes from "@/components/os/apps/services";
import MailApp from "@/components/os/apps/mail";
import DeployApp from "@/components/os/apps/deploy";
import TerminalApp from "@/components/os/apps/terminal";
import NumbersApp from "@/components/os/apps/numbers";
import AboutDoc from "@/components/os/apps/document";
import KitsApp from "@/components/os/apps/kits";
import FilesApp, { FileGlyph } from "@/components/os/apps/files";
import MusicApp, { NowPlaying, music } from "@/components/os/apps/music";
import Stickies from "@/components/os/apps/stickies";
import { CodeApp, PreviewApp, TextApp } from "@/components/os/apps/viewers";
import { SHOTS, SNIPPETS, TEXTS, type FileKind } from "@/components/os/content";

/* ------------------------------------------------------------------ apps */

export type AppId = "project" | "notes" | "mail" | "about" | "deploy" | "terminal" | "numbers" | "preview" | "code" | "text" | "music" | "files" | "kits";

export interface Win extends WinFrame {
  kind: AppId;
  slug?: string;
  tab: Tab;
  /** which file or item the app opened (a screenshot, a snippet, a kit, a mail subject) */
  file?: string;
}

export interface OSProps {
  /** "projected": decorative, rendered at a fixed size on the laptop. "flat": full-screen and interactive. */
  mode: "projected" | "flat";
  windows: Win[];
  setWindows: (fn: (w: Win[]) => Win[]) => void;
  onExit?: () => void;
}

interface AppMeta {
  title: string;
  glyph: ReactNode;
  tint: string;
  size?: [number, number];
  tone?: "dark" | "light";
}

const APPS: Record<Exclude<AppId, "project">, AppMeta> = {
  about: { title: "About.rtf", glyph: "Aa", tint: "linear-gradient(160deg,#f4f1ea,#d9d3c6)", size: [700, 600], tone: "light" },
  notes: { title: "Services.notes", glyph: "✎", tint: "linear-gradient(180deg,#ffd60a 0 26%,#fffdf5 26%)", size: [560, 560] },
  mail: { title: "Mail", glyph: "✉", tint: "linear-gradient(160deg,#4fc3ff,#1a73e8)", size: [560, 520] },
  deploy: { title: "Deployments", glyph: "▶", tint: "linear-gradient(160deg,#ff8a3c,#e2480f)", size: [900, 560] },
  terminal: { title: "Terminal", glyph: ">_", tint: "linear-gradient(160deg,#2b2f36,#0e1116)", size: [640, 420] },
  numbers: { title: "harmattan-model.xlsx", glyph: "▦", tint: "linear-gradient(160deg,#3ec46d,#0f7a3b)", size: [940, 580], tone: "light" },
  preview: { title: "Preview", glyph: "◩", tint: "linear-gradient(160deg,#7cc4ff,#2463eb)", size: [900, 600] },
  code: { title: "Code", glyph: "{ }", tint: "linear-gradient(160deg,#2b2f36,#0e1116)", size: [720, 420] },
  text: { title: "TextEdit", glyph: "¶", tint: "linear-gradient(160deg,#fbfaf7,#e5e1d8)", size: [560, 460], tone: "light" },
  music: { title: "Music", glyph: "♪", tint: "linear-gradient(160deg,#ff5f7e,#c3184a)", size: [520, 460] },
  files: { title: "Files", glyph: "▤", tint: "linear-gradient(180deg,#7cc4ff,#3b8ae6)", size: [760, 480] },
  kits: { title: "Starter kits", glyph: "◆", tint: "linear-gradient(160deg,#c084fc,#7c3aed)", size: [800, 560] },
};

/** Where each file sits on the desktop (% of the desktop), like someone who never tidies. */
const SCATTER: { id: string; app: AppId; file?: string; name: string; kind: FileKind; src?: string; x: number; y: number }[] = [
  { id: "f-about", app: "about", name: "About.rtf", kind: "doc", x: 30, y: 6 },
  { id: "f-model", app: "numbers", name: "harmattan-model.xlsx", kind: "sheet", x: 37, y: 6 },
  { id: "f-press", app: "files", file: "press", name: "Press kit", kind: "folder", x: 44, y: 6 },
  { id: "f-kits", app: "kits", name: "Starter kits", kind: "folder", x: 51, y: 6 },
  ...SHOTS.map((s, i) => ({ id: `f-${s.id}`, app: "preview" as AppId, file: s.id, name: s.name, kind: "image" as FileKind, src: s.src, x: 28 + i * 7.5, y: 66 + (i % 2) * 8 })),
  ...SNIPPETS.map((s, i) => ({ id: `f-${s.id}`, app: "code" as AppId, file: s.id, name: s.name, kind: "code" as FileKind, x: 60 + i * 7.5, y: 46 + (i % 2) * 4 })),
  ...TEXTS.map((t, i) => ({ id: `f-${t.id}`, app: "text" as AppId, file: t.id, name: t.name, kind: "text" as FileKind, x: 60 + i * 7.5, y: 70 + (i % 2) * 4 })),
];

export function openWindow(setWindows: OSProps["setWindows"], kind: AppId, slug?: string, tab: Tab = "overview", file?: string) {
  setWindows((ws) => {
    const id = kind === "project" ? `p:${slug}` : kind;
    const found = ws.find((w) => w.id === id);
    const z = nextZ();
    if (found) return ws.map((w) => (w.id === id ? { ...w, z, min: false, file: file ?? w.file, tab: kind === "project" && tab !== "overview" ? tab : w.tab } : w));
    const n = ws.length;
    const size = kind === "project" ? undefined : APPS[kind].size;
    return [...ws, { id, kind, slug, tab, file, x: 10 + ((n * 5) % 26), y: 6 + ((n * 4) % 16), z, w: size?.[0], h: size?.[1] }];
  });
}

/* ------------------------------------------------------------------ OS */

export default function AadamOS({ mode, windows, setWindows, onExit }: OSProps) {
  const live = mode === "flat";
  const projects = useMemo(() => dockProjects(), []);
  const desk = useRef<HTMLDivElement>(null);
  const top = windows.filter((w) => !w.min).reduce<Win | null>((a, w) => (!a || w.z > a.z ? w : a), null);
  const open = useCallback((kind: AppId, slug?: string, tab?: Tab, file?: string) => openWindow(setWindows, kind, slug, tab, file), [setWindows]);
  const openFile = useCallback(
    (app: "preview" | "code" | "text" | "numbers" | "doc" | "kits" | "music", file?: string) => {
      if (app === "music") {
        music.play(file);
        open("music");
      } else open(app === "doc" ? "about" : app, undefined, undefined, file);
    },
    [open],
  );

  // Esc closes the front window, then goes back to the desk
  useEffect(() => {
    if (!live) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (top) setWindows((ws) => ws.filter((w) => w.id !== top.id));
      else onExit?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [live, top, setWindows, onExit]);

  const isOpen = (id: string) => windows.some((w) => w.id === id);
  const tile = (meta: AppMeta) => (
    <span className="grid h-full w-full place-items-center text-[18px] font-semibold text-white" style={{ background: meta.tint, color: meta.tone === "light" ? "#1c1b19" : undefined }}>
      {meta.glyph}
    </span>
  );
  const dock: DockItem[] = [
    { id: "files", label: "Files", icon: tile(APPS.files), open: isOpen("files"), onOpen: () => open("files") },
    ...projects.map<DockItem>((p, i) => ({
      id: p.id,
      label: p.name,
      // eslint-disable-next-line @next/next/no-img-element
      icon: <img src={thumb(p)} alt="" className="h-full w-full object-cover object-top" style={{ background: p.accentColor }} />,
      open: isOpen(`p:${projectSlug(p)}`),
      onOpen: () => open("project", projectSlug(p)),
      divider: i === 0,
    })),
    ...(["deploy", "numbers", "music", "kits", "terminal", "mail"] as const).map<DockItem>((k, i) => ({ id: k, label: APPS[k].title, icon: tile(APPS[k]), open: isOpen(k), onOpen: () => open(k), divider: i === 0 })),
  ];

  return (
    <div
      className="aos theme-fixed relative h-full w-full select-none overflow-hidden text-[13px] text-white"
      style={{ fontFamily: "var(--font-sans)", pointerEvents: live ? "auto" : "none" }}
      role={live ? "region" : undefined}
      aria-label={live ? "Aadam OS, an interactive desktop of projects" : undefined}
      aria-hidden={live ? undefined : true}
      // rain starts softly on the first click (browsers only allow sound after one); pause it from the menu bar
      onPointerDown={live ? () => music.ambient() : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/os/wallpaper-bloom.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,transparent,rgba(0,0,0,0.55))]" />

      <MenuBar
        live={live}
        onExit={onExit}
        items={["Work", "Studio", "Contact"]}
        right={
          <>
            <NowPlaying />
            <span className="hidden items-center gap-1.5 lg:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" /> Available for work
            </span>
          </>
        }
      />

      <div ref={desk} className="absolute inset-x-0 bottom-[86px] top-8">
        <WelcomeCard />
        <Stickies live={live} />

        {/* the clutter: files left where they were last used */}
        <div className="absolute inset-0 hidden md:block">
          {SCATTER.map((f) => (
            <div key={f.id} className="absolute" style={{ left: `${f.x}%`, top: `${f.y}%` }}>
              <DesktopIcon label={f.name} glyph={<FileGlyph kind={f.kind} src={f.src} size={40} />} tint="transparent" onOpen={() => open(f.app, undefined, undefined, f.file)} live={live} />
            </div>
          ))}
        </div>

        {/* apps, top right, in two columns so they stay clear of the dock */}
        <div className="absolute right-5 top-5 hidden grid-cols-2 justify-items-center gap-x-1 gap-y-2 sm:grid">
          <DesktopIcon label="Bloom Boba" img={thumb(projects[0] ?? ({} as Project))} onOpen={() => open("project", "bloom-boba")} live={live} />
          {(["files", "mail", "deploy", "music", "terminal"] as const).map((k) => (
            <DesktopIcon key={k} label={APPS[k].title} glyph={APPS[k].glyph} tint={APPS[k].tint} onOpen={() => open(k)} live={live} />
          ))}
        </div>

        {windows.map((w) => {
          const p = w.kind === "project" ? findBySlug(w.slug) : undefined;
          const meta = w.kind === "project" ? null : APPS[w.kind];
          const update = (patch: Partial<Win>) => setWindows((ws) => ws.map((x) => (x.id === w.id ? { ...x, ...patch } : x)));
          const title =
            w.kind === "preview" ? SHOTS.find((s) => s.id === w.file)?.name ?? "Preview" : w.kind === "code" ? SNIPPETS.find((s) => s.id === w.file)?.name ?? "Code" : w.kind === "text" ? TEXTS.find((t) => t.id === w.file)?.name ?? "TextEdit" : p?.name ?? meta?.title ?? "Window";
          return (
            <Window key={w.id} w={w} title={title} desk={desk} live={live} focused={top?.id === w.id} update={update} close={() => setWindows((ws) => ws.filter((x) => x.id !== w.id))} tone={meta?.tone}>
              {w.kind === "project" && p && <ProjectApp p={p} tab={w.tab} setTab={(t) => update({ tab: t })} flat={live} />}
              {w.kind === "notes" && <ServicesNotes />}
              {w.kind === "mail" && <MailApp key={w.file} flat={live} subject={w.file} />}
              {w.kind === "deploy" && <DeployApp flat={live} />}
              {w.kind === "terminal" && <TerminalApp openProject={(slug) => open("project", slug)} />}
              {w.kind === "about" && <AboutDoc />}
              {w.kind === "numbers" && <NumbersApp live={live} />}
              {w.kind === "preview" && <PreviewApp key={w.file} file={w.file} live={live} />}
              {w.kind === "code" && <CodeApp file={w.file} />}
              {w.kind === "text" && <TextApp file={w.file} />}
              {w.kind === "music" && <MusicApp live={live} />}
              {w.kind === "files" && <FilesApp key={w.file} open={openFile} live={live} start={w.file === "press" ? "press" : "desktop"} />}
              {w.kind === "kits" && <KitsApp file={w.file} live={live} onStart={(name) => open("mail", undefined, undefined, name)} />}
            </Window>
          );
        })}
      </div>

      <Dock items={dock} live={live} label="Projects and apps" />
    </div>
  );
}

function WelcomeCard() {
  return (
    <div className="absolute left-6 top-5 hidden max-w-[300px] rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl sm:block">
      <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">Welcome</p>
      <p className="mt-1.5 text-[15px] font-semibold leading-snug">I build products that ship and work in the field.</p>
      <p className="mt-1 text-[12px] leading-relaxed text-white/65">Open anything. Projects live in the dock; my notes, files and a spreadsheet are on the desk. Leave me a note on the sticky.</p>
    </div>
  );
}

