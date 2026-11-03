"use client";

import { useEffect, useMemo, useState, useSyncExternalStore, useTransition } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { findProject, projectSlug, visibleProjects } from "@/lib/projects";
import { localServices } from "@/lib/services";
import { aboutFor } from "@/lib/about";
import { scrollToElement } from "@/lib/scroll";
import ModeScreen from "@/components/fieldkit/ModeScreen";
import { Fit } from "@/components/replicas";
import type { ModeId } from "@/components/fieldkit/chapters";
import { setTheme, useTheme } from "@/components/fieldkit/useTheme";
import { PLACES } from "@/components/map/places";
import type { MapView } from "@/components/map/MapCanvas";
import { DEPLOYS } from "../apps/deploy";
import { GuestSticky } from "../apps/stickies";
import { FileGlyph } from "../apps/files";
import { thumb } from "../apps/project";
import { KITS, PRESS_FILES, SHOTS, SNIPPETS, TEXTS } from "../content";
import { Sticky } from "../kit/parts";
import { useOsText, intlLocale } from "../l10n";

const MapCanvas = dynamic(() => import("@/components/map/MapCanvas"), { ssr: false });

export const WHATSAPP = "https://wa.me/233559602056";
export const EMAIL = "adam@aadambuilds.dev";

/* ------------------------------------------------------------------ wallpaper, kept per visitor */

export type Wall = "desk" | "swirl";
const WALL_KEY = "phone-wall";
const wallSubs = new Set<() => void>();
export const wallpaper = {
  get: (): Wall => {
    try {
      return localStorage.getItem(WALL_KEY) === "swirl" ? "swirl" : "desk";
    } catch {
      return "desk";
    }
  },
  set: (w: Wall) => {
    try {
      localStorage.setItem(WALL_KEY, w);
    } catch {}
    wallSubs.forEach((f) => f());
  },
};
export function useWallpaper() {
  return useSyncExternalStore(
    (f) => {
      wallSubs.add(f);
      return () => wallSubs.delete(f);
    },
    wallpaper.get,
    () => "desk" as Wall,
  );
}
export const WALLS: Record<Wall, { src: string; pos: string }> = {
  desk: { src: "/workspace/wide.webp", pos: "62% 50%" },
  swirl: { src: "/os/wallpaper-swirl.webp", pos: "70% 50%" },
};

/* ------------------------------------------------------------------ Notes */

export function NotesPhone() {
  const t = useOsText().stickies;
  const SERVICES = localServices(useLocale()).services;
  const [building, setBuilding] = useState<string[] | null>(null);
  useEffect(() => {
    let on = true;
    fetch("/api/now")
      .then((r) => r.json())
      .then((j) => on && setBuilding(Array.isArray(j.building) ? j.building : []))
      .catch(() => on && setBuilding([]));
    return () => {
      on = false;
    };
  }, []);
  return (
    <div className="space-y-4 p-4 text-[#1c1c1e]">
      <GuestSticky live className="w-full" />
      <div className="grid grid-cols-2 gap-3">
        <Sticky color="#fff2a8" tilt={-1.5} title={t.building}>
          {building?.length ? building.map((b) => <p key={b}>· {b}</p>) : <p>{t.phoneFallback}</p>}
        </Sticky>
        <Sticky color="#ffc8d8" tilt={1.2} title={t.howTitle}>
          {t.how.map((x) => (
            <p key={x}>{x}</p>
          ))}
        </Sticky>
      </div>
      <div className="rounded-2xl bg-white p-4">
        <p className="text-[20px] font-bold">{t.whatIDo}</p>
        {SERVICES.map((s) => (
          <div key={s.n} className="mt-3">
            <p className="text-[14px] font-semibold">
              {s.n} {s.title}
            </p>
            <p className="text-[13px] text-black/60">{s.short}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Maps */

export function MapsPhone() {
  const t = useOsText().maps;
  const [view, setView] = useState<MapView>("accra");
  const [sel, setSel] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const p = PLACES.find((x) => x.id === sel);
  const list = PLACES.filter((x) => (view === "world" ? true : !x.abroad));
  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1 bg-[#e9e6df]">
        {!failed && <MapCanvas places={PLACES} selected={sel} view={view} onSelect={setSel} onReady={() => {}} onFail={() => setFailed(true)} />}
        {failed && <p className="p-4 pt-14 text-[13px] text-black/60">{t.failed}</p>}
        <div className="absolute left-1/2 top-3 z-10 flex -translate-x-1/2 rounded-full bg-white/90 p-0.5 text-[13px] text-black shadow">
          {(["accra", "world"] as const).map((v) => (
            <button key={v} onClick={() => (setView(v), setSel(null))} aria-pressed={view === v} className={`rounded-full px-3 py-1 ${view === v ? "bg-black text-white" : ""}`}>
              {v === "accra" ? t.accra : t.world}
            </button>
          ))}
        </div>
      </div>
      <div className="max-h-[44%] shrink-0 overflow-y-auto overscroll-contain rounded-t-2xl bg-[#1c1c1e] p-3" data-lenis-prevent>
        <p className="mb-2 px-1 text-[13px] font-semibold text-white/70">{t.title}</p>
        {p ? (
          <div className="flex gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt="" className="h-20 w-28 shrink-0 rounded-lg object-cover" />
            <div className="min-w-0 text-[13px]">
              <p className="font-semibold">{p.name}</p>
              <p className="text-white/55">{p.area}</p>
              <p className="mt-1 line-clamp-2 text-white/75">{p.shipped}</p>
              <button onClick={() => setSel(null)} className="mt-1 text-[#5aa9ff]">
                ‹ {t.title}
              </button>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {list.map((x) => (
              <li key={x.id}>
                <button onClick={() => setSel(x.id)} className="flex w-full items-center gap-3 py-2 text-left">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#ff5b1f] text-[13px]">●</span>
                  <span className="min-w-0">
                    <span className="block truncate text-[14px]">{x.name}</span>
                    <span className="block truncate text-[12px] text-white/50">{x.area}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Wallet */

type Pass = { id: string; org: string; title: string; tone: string; ink?: string; fields: [string, string][]; body?: string };

export function WalletPhone() {
  const all = useOsText();
  const t = all.wallet;
  const f = all.passes;
  const LEADERSHIP = aboutFor(useLocale()).LEADERSHIP;
  const passes: Pass[] = [
    { id: "card", org: "aadambuilds.dev", title: "Aadam", tone: "linear-gradient(150deg,#ff5b1f,#a8320b)", fields: [[f.role, all.contacts.role], [f.email, EMAIL], [f.based, f.accra]] },
    { id: "court", org: "Madina Basketball Court", title: f.colead, tone: "linear-gradient(150deg,#f97316,#7c2d12)", fields: [[f.raised, "GHS 40,000+"], [f.donors, "11"]], body: LEADERSHIP[0] },
    { id: "vc", org: "VCTF · Ministry of Finance · World Bank", title: "VC Analyst Program", tone: "linear-gradient(150deg,#1e3a8a,#0b1530)", fields: [[f.cohort, f.selected]], body: LEADERSHIP[3] },
    { id: "aspire", org: "Aspire Leadership Programme", title: f.cohort4, tone: "linear-gradient(150deg,#0f766e,#042f2e)", fields: [[f.faculty, f.harvard]], body: LEADERSHIP[4] },
    { id: "iou", org: "IOU Student Committee", title: f.itLead, tone: "linear-gradient(150deg,#6d28d9,#2e1065)", fields: [[f.hours, f.hoursValue]], body: LEADERSHIP[1] },
    { id: "certs", org: "Google · Goldman Sachs", title: f.certs, tone: "linear-gradient(150deg,#e5e7eb,#9ca3af)", ink: "#111", fields: [[f.year, "2026"]], body: LEADERSHIP[5] },
  ];
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="p-4">
      <p className="mb-3 text-[12.5px] text-white/50">{t.hint}</p>
      <div className="relative">
        {passes.map((p, i) => {
          const on = open === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setOpen(on ? null : p.id)}
              aria-expanded={on}
              className="relative block w-full rounded-2xl p-4 text-left shadow-[0_-6px_20px_rgba(0,0,0,0.35)] transition-[margin] duration-300"
              style={{ background: p.tone, color: p.ink ?? "#fff", marginTop: i === 0 ? 0 : on || open === passes[i - 1]?.id ? 12 : -118, zIndex: i }}
            >
              <span className="flex items-start justify-between gap-2">
                <span className="text-[11px] uppercase tracking-[0.14em] opacity-75">{p.org}</span>
                {p.id === "card" && <span className="text-[11px] opacity-75">{t.card}</span>}
              </span>
              <span className="mt-1 block text-[22px] font-semibold tracking-tight">{p.title}</span>
              <span className="mt-4 grid grid-cols-2 gap-2">
                {p.fields.map(([k, v]) => (
                  <span key={k} className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-[0.12em] opacity-60">{k}</span>
                    <span className="block truncate text-[13px] font-medium">{v}</span>
                  </span>
                ))}
              </span>
              {on && p.body && <span className="mt-3 block text-[12.5px] leading-snug opacity-85">{p.body}</span>}
              {on && p.id === "card" && (
                <span className="mt-3 flex gap-2 text-[12.5px]">
                  <a href={`mailto:${EMAIL}`} onClick={(e) => e.stopPropagation()} className="rounded-full bg-white/20 px-3 py-1">
                    {EMAIL}
                  </a>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Contacts */

export function ContactsPhone() {
  const all = useOsText();
  const t = all.contacts;
  const vcard = useMemo(() => {
    const body = ["BEGIN:VCARD", "VERSION:3.0", "FN:Aadam", "N:;Aadam;;;", `TITLE:${t.role}`, `EMAIL;TYPE=INTERNET:${EMAIL}`, "TEL;TYPE=CELL:+233559602056", "URL:https://aadambuilds.dev", "ADR;TYPE=WORK:;;;Accra;;;Ghana", "END:VCARD"].join("\r\n");
    return `data:text/vcard;charset=utf-8,${encodeURIComponent(body)}`;
  }, [t.role]);
  const rows: [string, string, string?][] = [
    [t.email, EMAIL, `mailto:${EMAIL}`],
    [t.whatsapp, "+233 55 960 2056", WHATSAPP],
    [t.based, all.contactRows.based],
    [t.hours, all.contactRows.hours],
    [t.site, "aadambuilds.dev", "/"],
  ];
  return (
    <div className="p-4 text-center">
      <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-b from-[#ff8a5c] to-[#c2410c] text-[38px] font-semibold text-white">A</span>
      <p className="mt-3 text-[26px] font-semibold">Aadam</p>
      <p className="text-[14px] text-white/60">{t.role}</p>
      <div className="mt-4 flex justify-center gap-3 text-[12px]">
        <a href={`mailto:${EMAIL}`} className="w-20 rounded-xl bg-white/10 py-2.5">
          ✉<span className="block">{t.email}</span>
        </a>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="w-20 rounded-xl bg-white/10 py-2.5">
          💬<span className="block">{t.whatsapp}</span>
        </a>
        <a href={vcard} download="aadam.vcf" className="w-20 rounded-xl bg-white/10 py-2.5">
          ＋<span className="block">{t.save}</span>
        </a>
      </div>
      <dl className="mt-5 divide-y divide-white/10 rounded-2xl bg-white/[0.06] text-left">
        {rows.map(([k, v, href]) => (
          <div key={k} className="px-4 py-2.5">
            <dt className="text-[12px] text-white/50">{k}</dt>
            <dd className="text-[15px]">{href ? <a href={href} className="text-[#5aa9ff]">{v}</a> : v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ------------------------------------------------------------------ Clock */

function useNow(ms = 1000) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}

/** Minutes from UTC of a zone at a moment. */
function offset(zone: string, at: number) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: zone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(at);
  const g = (k: string) => Number(parts.find((p) => p.type === k)?.value);
  return Math.round((Date.UTC(g("year"), g("month") - 1, g("day"), g("hour"), g("minute")) - Math.floor(at / 60_000) * 60_000) / 60_000);
}

function Face({ zone, now }: { zone: string; now: number }) {
  const d = new Date(now + offset(zone, now) * 60_000);
  const s = d.getUTCSeconds();
  const m = d.getUTCMinutes() + s / 60;
  const h = (d.getUTCHours() % 12) + m / 60;
  const hand = (deg: number, len: number, w: number, c: string) => <line x1="50" y1="50" x2={50 + len * Math.sin((deg * Math.PI) / 180)} y2={50 - len * Math.cos((deg * Math.PI) / 180)} stroke={c} strokeWidth={w} strokeLinecap="round" />;
  const day = d.getUTCHours() >= 6 && d.getUTCHours() < 18;
  return (
    <svg viewBox="0 0 100 100" className="h-16 w-16 shrink-0" aria-hidden>
      <circle cx="50" cy="50" r="48" fill={day ? "#fff" : "#1c1c1e"} stroke="#3a3a3c" />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1="50" y1="6" x2="50" y2={i % 3 ? 10 : 13} stroke={day ? "#111" : "#ddd"} strokeWidth="2" transform={`rotate(${i * 30} 50 50)`} />
      ))}
      {hand(h * 30, 24, 4, day ? "#111" : "#fff")}
      {hand(m * 6, 34, 3, day ? "#111" : "#fff")}
      {hand(s * 6, 38, 1.2, "#ff9500")}
      <circle cx="50" cy="50" r="2.5" fill="#ff9500" />
    </svg>
  );
}

export function ClockPhone() {
  const t = useOsText().clock;
  const locale = useLocale();
  const now = useNow();
  const mine = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC", []);
  if (now === null) return null;
  const zones: [string, string][] = [
    ["Africa/Accra", t.me],
    [mine, t.you],
    ["Europe/London", "London"],
    ["Europe/Paris", "Paris"],
    ["America/New_York", "New York"],
    ["Asia/Dubai", "Dubai"],
  ];
  const accraH = new Date(now).getUTCHours();
  const accraD = new Date(now).getUTCDay();
  const working = accraD > 0 && accraD < 6 && accraH >= 9 && accraH < 17;
  return (
    <div className="p-4">
      <p className="text-[28px] font-bold">{t.world}</p>
      <p className={`mt-1 inline-flex items-center gap-1.5 text-[13px] ${working ? "text-[#30d158]" : "text-white/55"}`}>
        <span className={`h-2 w-2 rounded-full ${working ? "bg-[#30d158]" : "bg-white/40"}`} /> {working ? t.working : t.off}
      </p>
      <ul className="mt-3 divide-y divide-white/10">
        {zones.map(([z, label], i) => {
          if (i === 1 && z === "Africa/Accra") return null;
          const diff = Math.round((offset(z, now) - 0) / 60);
          return (
            <li key={`${z}${i}`} className="flex items-center gap-4 py-3">
              <Face zone={z} now={now} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[17px]">{label}</p>
                <p className="text-[12.5px] text-white/50">{i === 0 ? "GMT+0" : t.ahead(diff)}</p>
              </div>
              <p className="text-[30px] font-light tabular-nums">{new Intl.DateTimeFormat(intlLocale(locale), { hour: "2-digit", minute: "2-digit", timeZone: z }).format(now)}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ Settings */

const LANGS: [string, string][] = [
  ["en", "English"],
  ["fr", "Français"],
  ["ar", "العربية"],
];

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <p className="px-4 pb-1.5 text-[12px] uppercase tracking-[0.08em] text-white/45">{title}</p>
      <div className="divide-y divide-white/10 overflow-hidden rounded-xl bg-white/[0.07]">{children}</div>
    </section>
  );
}

export function SettingsPhone() {
  const t = useOsText().settings;
  const theme = useTheme();
  const wall = useWallpaper();
  const locale = useLocale();
  const router = useRouter();
  const [, start] = useTransition();
  const row = "flex w-full items-center justify-between px-4 py-3 text-left text-[15px]";
  return (
    <div className="p-4 pt-1">
      <Group title={t.appearance}>
        {(["light", "dark"] as const).map((m) => (
          <button key={m} className={row} onClick={(e) => setTheme(m, { x: e.clientX, y: e.clientY })} aria-pressed={theme === m}>
            {m === "light" ? t.light : t.dark}
            {theme === m && <span className="text-[#0a84ff]">✓</span>}
          </button>
        ))}
      </Group>
      <Group title={t.language}>
        {LANGS.map(([code, name]) => (
          <button
            key={code}
            lang={code}
            className={row}
            aria-pressed={locale === code}
            onClick={() => {
              if (code === locale) return;
              document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; samesite=lax`;
              start(() => router.refresh());
            }}
          >
            {name}
            {locale === code && <span className="text-[#0a84ff]">✓</span>}
          </button>
        ))}
      </Group>
      <Group title={t.wallpaper}>
        <div className="flex gap-3 p-3">
          {(Object.keys(WALLS) as Wall[]).map((w) => (
            <button key={w} onClick={() => wallpaper.set(w)} aria-pressed={wall === w} className="flex-1 text-center text-[12.5px]">
              <span className={`block aspect-[9/16] overflow-hidden rounded-lg ring-2 ${wall === w ? "ring-[#0a84ff]" : "ring-transparent"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={WALLS[w].src} alt="" className="h-full w-full object-cover" style={{ objectPosition: WALLS[w].pos }} />
              </span>
              <span className="mt-1 block">{w === "desk" ? t.desk : t.swirl}</span>
            </button>
          ))}
        </div>
      </Group>
      <Group title={t.aboutPhone}>
        <p className="px-4 py-3 text-[13.5px] leading-relaxed text-white/70">{t.aboutBody}</p>
      </Group>
    </div>
  );
}

/* ------------------------------------------------------------------ Safari */

export function SafariPhone() {
  const t = useOsText().safari;
  const sites = useMemo(() => visibleProjects().filter((p) => p.liveBaseUrl && p.liveEmbeddable !== false), []);
  const [url, setUrl] = useState<string | null>(null);
  const host = url ? new URL(url).host : "";
  return (
    <div className="flex h-full flex-col bg-[#1c1c1e]">
      {url ? (
        <>
          <iframe src={url} title={host} sandbox="allow-scripts allow-same-origin allow-popups" referrerPolicy="no-referrer" loading="lazy" className="min-h-0 w-full flex-1 border-0 bg-white" />
          <div className="flex shrink-0 items-center gap-2 border-t border-white/10 px-3 py-2 text-[13px]">
            <button onClick={() => setUrl(null)} className="px-2 text-[18px] text-[#5aa9ff]" aria-label={t.favourites}>
              ‹
            </button>
            <span className="min-w-0 flex-1 truncate rounded-lg bg-white/10 px-3 py-1.5 text-center text-white/80">{host}</span>
            <a href={url} target="_blank" rel="noopener noreferrer" className="px-2 text-[16px] text-[#5aa9ff]" aria-label={t.newTab}>
              ↗
            </a>
          </div>
        </>
      ) : (
        <div className="p-4">
          <p className="text-[20px] font-bold">{t.favourites}</p>
          <div className="mt-3 grid grid-cols-4 gap-x-3 gap-y-4">
            {sites.map((p) => (
              <button key={p.id} onClick={() => setUrl(p.liveBaseUrl!)} className="text-center">
                <span className="mx-auto grid aspect-square w-full place-items-center overflow-hidden rounded-xl bg-white text-[20px] font-bold text-black">
                  {thumb(p) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb(p)} alt="" className="h-full w-full object-cover object-top" loading="lazy" />
                  ) : (
                    p.name[0]
                  )}
                </span>
                <span className="mt-1 block truncate text-[11px] text-white/80">{p.name}</span>
              </button>
            ))}
          </div>
          <p className="mt-5 text-[12px] text-white/45">{t.framed}</p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ Systems (the playable deployments) */

export function SystemsPhone() {
  const all = useOsText();
  const t = all.systems;
  const name = (mode: string) => all.deploy.items[mode] ?? [mode, ""];
  const [m, setM] = useState<ModeId>("counter");
  const d = DEPLOYS.find((x) => x.mode === m)!;
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 gap-1.5 overflow-x-auto px-3 py-2 [scrollbar-width:none]" data-lenis-prevent>
        {DEPLOYS.map((x) => (
          <button key={x.mode} onClick={() => setM(x.mode)} aria-pressed={m === x.mode} className={`shrink-0 rounded-full px-3 py-1.5 text-[12.5px] ${m === x.mode ? "bg-white text-black" : "bg-white/10"}`}>
            {name(x.mode)[0]}
          </button>
        ))}
      </div>
      <p className="px-4 text-[12px] text-white/50">
        {name(d.mode)[1] || d.sub} · {t.hint}
      </p>
      <div className="relative mx-3 my-3 aspect-[16/10] overflow-hidden rounded-xl bg-black">
        <Fit w={640} h={400}>
          <ModeScreen mode={m} />
        </Fit>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Files */

type Opened = { app: "preview" | "code" | "text"; id: string } | null;

export function FilesPhone({ onOpen, openKits }: { onOpen: (o: NonNullable<Opened>) => void; openKits: (id: string) => void }) {
  const all = useOsText();
  const t = all.files;
  const row = "flex w-full items-center gap-3 px-3 py-2 text-left";
  const sec = (title: string, children: React.ReactNode, note?: string) => (
    <section className="mt-4">
      <p className="px-4 pb-1 text-[12px] uppercase tracking-[0.08em] text-white/45">{title}</p>
      {note && <p className="px-4 pb-1.5 text-[12px] text-white/45">{note}</p>}
      <div className="divide-y divide-white/10 overflow-hidden rounded-xl bg-white/[0.07]">{children}</div>
    </section>
  );
  return (
    <div className="p-3 pt-0">
      {sec(
        t.press,
        PRESS_FILES.map((f, i) => (
          <a key={f.name} href={f.href} download className={row}>
            <FileGlyph kind={f.kind} size={30} src={f.name.endsWith(".png") ? f.href : undefined} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px]">{f.name}</span>
              <span className="block truncate text-[12px] text-white/50">{all.finder.pressFiles[i] ?? f.note}</span>
            </span>
            <span className="text-[12px] text-[#5aa9ff]">{t.download}</span>
          </a>
        )),
      )}
      {sec(
        t.kits,
        KITS.map((k) => (
          <button key={k.id} onClick={() => openKits(k.id)} className={row}>
            <span className="grid h-8 w-8 place-items-center rounded-lg text-white" style={{ background: k.tone }}>
              ◆
            </span>
            <span className="flex-1 text-[14px]">{all.kits.items[k.id]?.name ?? k.name}</span>
            <span className="text-white/35">›</span>
          </button>
        )),
      )}
      {sec(
        t.shots,
        SHOTS.map((s) => (
          <button key={s.id} onClick={() => onOpen({ app: "preview", id: s.id })} className={row}>
            <FileGlyph kind="image" src={s.src} size={34} />
            <span className="flex-1 truncate text-[14px]">{s.name}</span>
            <span className="text-white/35">›</span>
          </button>
        )),
      )}
      {sec(
        t.code,
        SNIPPETS.map((s) => (
          <button key={s.id} onClick={() => onOpen({ app: "code", id: s.id })} className={row}>
            <FileGlyph kind="code" size={30} />
            <span className="flex-1 truncate font-mono text-[13px]">{s.name}</span>
            <span className="text-white/35">›</span>
          </button>
        )),
      )}
      {sec(
        t.notes,
        TEXTS.map((x) => (
          <button key={x.id} onClick={() => onOpen({ app: "text", id: x.id })} className={row}>
            <FileGlyph kind="text" size={30} />
            <span className="flex-1 truncate text-[14px]">{x.name}</span>
            <span className="text-white/35">›</span>
          </button>
        )),
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ project apps */

export function BloomPhone() {
  return <video src="/walkthroughs/bloom-boba-mobile.mp4" autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-cover" />;
}

export function AlBoyutPhone() {
  const p = findProject("al-boyut");
  return (
    <div className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-contain [scrollbar-width:none]" data-lenis-prevent>
      {(p?.mobileShowcase ?? []).map((m) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={m.src} src={m.src} alt={m.label} className="h-full w-full shrink-0 snap-center object-cover object-top" />
      ))}
    </div>
  );
}

export function CourtPhone({ leave }: { leave: () => void }) {
  const p = findProject("madinabasketball");
  const t = useOsText().court;
  return (
    <div className="bg-[#0d0d0d] p-4">
      {["court", "events", "landing"].map((k) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={k} src={`/previews/madinabasketball/${k}.webp`} alt="" className="mb-3 w-full rounded-xl" loading="lazy" />
      ))}
      <p className="text-[13px] text-white/70">{t.blurb}</p>
      <button
        onClick={() => {
          leave();
          const el = document.getElementById("chapter-06");
          if (el) setTimeout(() => scrollToElement(el, -60), 60);
        }}
        className="mt-3 block rounded-full bg-[#ff6b35] px-4 py-2 text-[13px] font-semibold text-black"
      >
        {t.score}
      </button>
      {p && (
        <Link href={`/work/${projectSlug(p)}`} className="mt-3 inline-block text-[13px] text-[#ff8a5c]">
          {t.open} →
        </Link>
      )}
    </div>
  );
}
