"use client";

import Link from "next/link";
import { projectSlug, visibleProjects, type Project } from "@/lib/projects";
import ScaledIframe from "@/components/ui/ScaledIframe";

export type Tab = "overview" | "walkthrough" | "live" | "builder";

/** Apps in the dock: flagship + featured projects that have real screenshots, Bloom Boba first. */
export function dockProjects(): Project[] {
  const all = visibleProjects().filter((p) => p.screenImages && Object.keys(p.screenImages).length);
  const rank = (p: Project) => (p.id === "bloomboba" ? 0 : p.flagship ? 1 : p.featured ? 2 : 3);
  return all.sort((a, b) => rank(a) - rank(b)).slice(0, 9);
}

export const thumb = (p: Project) => p.screenImages?.[p.defaultScreen ?? p.screens[0]?.id ?? ""] ?? Object.values(p.screenImages ?? {})[0] ?? "";

export const findBySlug = (slug?: string) => (slug ? visibleProjects().find((x) => projectSlug(x) === slug) : undefined);

export default function ProjectApp({ p, tab, setTab, flat }: { p: Project; tab: Tab; setTab: (t: Tab) => void; flat: boolean }) {
  const walk = p.walkthroughs?.[0];
  const canLive = !!p.liveBaseUrl && p.liveEmbeddable !== false;
  const builder = p.id === "bloomboba" && p.liveBaseUrl ? `${p.liveBaseUrl.replace(/\/$/, "")}/#make` : null;
  const tabs: [Tab, string][] = [
    ["overview", "Overview"],
    ...(walk ? ([["walkthrough", "Walkthrough"]] as [Tab, string][]) : []),
    ...(builder ? ([["builder", "Build a drink"]] as [Tab, string][]) : []),
    ...(p.liveBaseUrl ? ([["live", "Live site"]] as [Tab, string][]) : []),
  ];
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 gap-1 border-b border-white/10 px-3 py-2" role="tablist">
        {tabs.map(([t, l]) => (
          <button key={t} role="tab" aria-selected={tab === t} tabIndex={flat ? 0 : -1} onClick={() => setTab(t)} className={`rounded-md px-3 py-1 text-[12px] ${tab === t ? "bg-white/15 text-white" : "text-white/60 hover:text-white"}`}>
            {l}
          </button>
        ))}
        <Link href={`/work/${projectSlug(p)}`} tabIndex={flat ? 0 : -1} className="ml-auto rounded-md px-3 py-1 text-[12px] text-[var(--accent-2)] hover:underline">
          Full case study →
        </Link>
      </div>

      {tab === "overview" && (
        <div className="grid gap-5 p-5 md:grid-cols-[1.2fr_1fr]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumb(p)} alt={`${p.name} screen`} className="w-full rounded-lg ring-1 ring-white/10" />
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">{p.categoryLabel}</p>
            <h3 className="mt-1 text-[20px] font-semibold leading-tight">{p.name}</h3>
            <p className="mt-1 text-white/70">{p.tagline}</p>
            <p className="mt-3 text-[12.5px] leading-relaxed text-white/60">{p.description}</p>
            {p.outcomes && (
              <div className="mt-4 flex flex-wrap gap-2">
                {p.outcomes.slice(0, 3).map((o) => (
                  <span key={o.label} className="rounded-md bg-white/[0.07] px-2.5 py-1.5">
                    <b className="mr-1">{o.value}</b>
                    <span className="text-white/60">{o.label}</span>
                  </span>
                ))}
              </div>
            )}
            <p className="mt-4 text-[11px] text-white/45">{p.stack.join(" · ")}</p>
          </div>
        </div>
      )}

      {tab === "walkthrough" && walk && (
        <div className="h-full bg-black">
          {flat ? (
            <video data-os-video src={walk.src} poster={walk.poster} autoPlay muted loop playsInline controls preload="metadata" className="h-full w-full object-contain" />
          ) : (
            // on the laptop screen a still stands in; the film only loads once the OS is open
            // eslint-disable-next-line @next/next/no-img-element
            <img src={walk.poster ?? thumb(p)} alt="" className="h-full w-full object-contain" />
          )}
        </div>
      )}

      {tab === "builder" && builder && (
        <div className="h-full">{flat ? <ScaledIframe src={builder} title={`${p.name} drink builder`} /> : <p className="p-8 text-white/60">The builder opens when you are at the desk.</p>}</div>
      )}

      {tab === "live" && p.liveBaseUrl && (
        <div className="h-full">
          {canLive && flat ? (
            <ScaledIframe src={p.liveBaseUrl} title={`${p.name} live`} />
          ) : (
            <div className="grid h-full place-items-center p-8 text-center">
              <div>
                <p className="text-white/70">{canLive ? "The live site loads when you're at the desk." : "This site can't be embedded."}</p>
                <a href={p.liveBaseUrl} target="_blank" rel="noopener noreferrer" tabIndex={flat ? 0 : -1} className="mt-3 inline-block rounded-md bg-white/15 px-3 py-1.5 hover:bg-white/25">
                  Open {new URL(p.liveBaseUrl).host} ↗
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
