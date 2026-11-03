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

/* ------------------------------------------------------------------ apps */

export type AppId = "project" | "notes" | "mail" | "about" | "deploy" | "terminal";

export interface Win extends WinFrame {
  kind: AppId;
  slug?: string;
  tab: Tab;
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
  about: { title: "About.txt", glyph: "Aa", tint: "linear-gradient(160deg,#f4f1ea,#d9d3c6)", size: [640, 560], tone: "light" },
  notes: { title: "Services.notes", glyph: "✎", tint: "linear-gradient(180deg,#ffd60a 0 26%,#fffdf5 26%)", size: [560, 560] },
  mail: { title: "Mail", glyph: "✉", tint: "linear-gradient(160deg,#4fc3ff,#1a73e8)", size: [560, 520] },
  deploy: { title: "Deployments", glyph: "▶", tint: "linear-gradient(160deg,#ff8a3c,#e2480f)", size: [900, 560] },
  terminal: { title: "Terminal", glyph: ">_", tint: "linear-gradient(160deg,#2b2f36,#0e1116)", size: [640, 420] },
};

export function openWindow(setWindows: OSProps["setWindows"], kind: AppId, slug?: string, tab: Tab = "overview") {
  setWindows((ws) => {
    const id = kind === "project" ? `p:${slug}` : kind;
    const found = ws.find((w) => w.id === id);
    const z = nextZ();
    if (found) return ws.map((w) => (w.id === id ? { ...w, z, min: false, tab: kind === "project" && tab !== "overview" ? tab : w.tab } : w));
    const n = ws.length;
    const size = kind === "project" ? undefined : APPS[kind].size;
    return [...ws, { id, kind, slug, tab, x: 12 + ((n * 5) % 26), y: 8 + ((n * 4) % 18), z, w: size?.[0], h: size?.[1] }];
  });
}

/* ------------------------------------------------------------------ OS */

export default function AadamOS({ mode, windows, setWindows, onExit }: OSProps) {
  const live = mode === "flat";
  const projects = useMemo(() => dockProjects(), []);
  const desk = useRef<HTMLDivElement>(null);
  const top = windows.filter((w) => !w.min).reduce<Win | null>((a, w) => (!a || w.z > a.z ? w : a), null);
  const open = useCallback((kind: AppId, slug?: string, tab?: Tab) => openWindow(setWindows, kind, slug, tab), [setWindows]);

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
    <span className="grid h-full w-full place-items-center text-[18px] font-semibold text-white" style={{ background: meta.tint }}>
      {meta.glyph}
    </span>
  );
  const dock: DockItem[] = [
    ...projects.map<DockItem>((p) => ({
      id: p.id,
      label: p.name,
      // eslint-disable-next-line @next/next/no-img-element
      icon: <img src={thumb(p)} alt="" className="h-full w-full object-cover object-top" style={{ background: p.accentColor }} />,
      open: isOpen(`p:${projectSlug(p)}`),
      onOpen: () => open("project", projectSlug(p)),
    })),
    ...(["deploy", "terminal", "mail", "notes"] as const).map<DockItem>((k, i) => ({ id: k, label: APPS[k].title, icon: tile(APPS[k]), open: isOpen(k), onOpen: () => open(k), divider: i === 0 })),
  ];

  return (
    <div
      className="aos theme-fixed relative h-full w-full select-none overflow-hidden text-[13px] text-white"
      style={{ fontFamily: "var(--font-sans)", pointerEvents: live ? "auto" : "none" }}
      role={live ? "region" : undefined}
      aria-label={live ? "Aadam OS, an interactive desktop of projects" : undefined}
      aria-hidden={live ? undefined : true}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/os/wallpaper-bloom.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,transparent,rgba(0,0,0,0.55))]" />

      <MenuBar
        live={live}
        onExit={onExit}
        items={["Work", "Studio", "Contact"]}
        right={
          <span className="hidden items-center gap-1.5 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" /> Available for work
          </span>
        }
      />

      <div ref={desk} className="absolute inset-x-0 bottom-[86px] top-8">
        <WelcomeCard />
        {/* two columns, so the icons stay clear of the dock on short screens */}
        <div className="absolute right-5 top-5 hidden grid-cols-2 justify-items-center gap-x-1 gap-y-3 sm:grid">
          <DesktopIcon label="Bloom Boba" img={thumb(projects[0] ?? ({} as Project))} onOpen={() => open("project", "bloom-boba")} live={live} />
          {(["about", "notes", "mail", "deploy", "terminal"] as const).map((k) => (
            <DesktopIcon key={k} label={APPS[k].title} glyph={APPS[k].glyph} tint={APPS[k].tint} onOpen={() => open(k)} live={live} />
          ))}
        </div>

        {windows.map((w) => {
          const p = w.kind === "project" ? findBySlug(w.slug) : undefined;
          const meta = w.kind === "project" ? null : APPS[w.kind];
          const update = (patch: Partial<Win>) => setWindows((ws) => ws.map((x) => (x.id === w.id ? { ...x, ...patch } : x)));
          return (
            <Window
              key={w.id}
              w={w}
              title={p?.name ?? meta?.title ?? "Window"}
              desk={desk}
              live={live}
              focused={top?.id === w.id}
              update={update}
              close={() => setWindows((ws) => ws.filter((x) => x.id !== w.id))}
              tone={meta?.tone}
            >
              {w.kind === "project" && p && <ProjectApp p={p} tab={w.tab} setTab={(t) => update({ tab: t })} flat={live} />}
              {w.kind === "notes" && <ServicesNotes />}
              {w.kind === "mail" && <MailApp flat={live} />}
              {w.kind === "deploy" && <DeployApp flat={live} />}
              {w.kind === "terminal" && <TerminalApp openProject={(slug) => open("project", slug)} />}
              {w.kind === "about" && <AboutApp />}
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
    <div className="absolute left-6 top-6 hidden max-w-[300px] rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl sm:block">
      <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">Welcome</p>
      <p className="mt-1.5 text-[15px] font-semibold leading-snug">I build products that ship and work in the field.</p>
      <p className="mt-1 text-[12px] leading-relaxed text-white/65">Open a project from the dock. Each one has the story, a real walkthrough and the live site.</p>
    </div>
  );
}

function AboutApp() {
  return (
    <div className="space-y-3 p-6 text-[13px] leading-relaxed text-black/75">
      <p className="text-[18px] font-semibold text-black">Aadam · forward deployed engineer</p>
      <p>I design and build software for businesses that run on the ground: shops, kitchens, schools, suppliers. Brand and storefront at the front, the operating system behind it.</p>
      <p className="text-black/55">Based in Accra, working worldwide.</p>
    </div>
  );
}
