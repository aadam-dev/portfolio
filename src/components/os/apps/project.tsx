"use client";

import { useLocale } from "next-intl";
import { useOsText } from "../l10n";
import Link from "next/link";
import { projectSlug, visibleProjects, type Project, localizedProject } from "@/lib/projects";
import ScaledIframe from "@/components/ui/ScaledIframe";

export type Tab = "overview" | "walkthrough" | "live" | "builder" | "explorer";

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
  const explorer = p.id === "afroarab" ? "https://afroarab-properties.vercel.app/lands/titled-lands-green-valley/explorer?plot=17" : null;
  const t = useOsText().project;
  const local = localizedProject(p, useLocale());
  const tabs: [Tab, string][] = [
    ["overview", t.overview],
    ...(walk ? ([["walkthrough", t.walkthrough]] as [Tab, string][]) : []),
    ...(builder ? ([["builder", t.builder]] as [Tab, string][]) : []),
    ...(explorer ? ([["explorer", t.explorer]] as [Tab, string][]) : []),
    ...(p.liveBaseUrl ? ([["live", t.live]] as [Tab, string][]) : []),
  ];
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 gap-1 border-b border-white/10 px-3 py-2" role="tablist">
        {tabs.map(([id, l]) => (
          <button key={id} role="tab" aria-selected={tab === id} tabIndex={flat ? 0 : -1} onClick={() => setTab(id)} className={`rounded-md px-3 py-1 text-[12px] ${tab === id ? "bg-white/15 text-white" : "text-white/60 hover:text-white"}`}>
            {l}
          </button>
        ))}
        <Link href={`/work/${projectSlug(p)}`} tabIndex={flat ? 0 : -1} className="ml-auto rounded-md px-3 py-1 text-[12px] text-[var(--accent-2)] hover:underline">
          {t.caseStudy} →
        </Link>
      </div>

      {tab === "overview" && (
        <div className="grid gap-5 p-5 md:grid-cols-[1.2fr_1fr]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumb(p)} alt={t.screen(p.name)} className="w-full rounded-lg ring-1 ring-white/10" />
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">{p.categoryLabel}</p>
            <h3 className="mt-1 text-[20px] font-semibold leading-tight">{p.name}</h3>
            <p className="mt-1 text-white/70">{local.tagline}</p>
            <p className="mt-3 text-[12.5px] leading-relaxed text-white/60">{local.description}</p>
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
        <div className="h-full">{flat ? <ScaledIframe src={builder} title={`${p.name} drink builder`} /> : <p className="p-8 text-white/60">{t.builderLater}</p>}</div>
      )}

      {tab === "explorer" && explorer && (
        <div className="relative h-full">
          {flat ? (
            <iframe title={`${p.name} 3D plot explorer`} src={explorer} sandbox="allow-scripts allow-same-origin allow-popups" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full border-0" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumb(p)} alt="" className="h-full w-full object-cover" />
          )}
        </div>
      )}

      {tab === "live" && p.liveBaseUrl && (
        <div className="h-full">
          {canLive && flat ? (
            <ScaledIframe src={p.liveBaseUrl} title={`${p.name} live`} />
          ) : (
            <div className="grid h-full place-items-center p-8 text-center">
              <div>
                <p className="text-white/70">{canLive ? t.liveLater : t.noEmbed}</p>
                <a href={p.liveBaseUrl} target="_blank" rel="noopener noreferrer" tabIndex={flat ? 0 : -1} className="mt-3 inline-block rounded-md bg-white/15 px-3 py-1.5 hover:bg-white/25">
                  {t.openHost(new URL(p.liveBaseUrl).host)} ↗
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
