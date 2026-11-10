"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { projectSlug, visibleProjects } from "@/lib/projects";
import { PLATE, STOPS } from "@/components/desk/objects";
import { localStops } from "@/components/desk/objects.l10n";
import { visitSession } from "@/components/site/Tracker";
import { thumb } from "../apps/project";
import { useOsText } from "../l10n";
import { myPhotos, type MyPhoto } from "./store";

type Album = "yours" | "visitors" | "desk" | "work";
/** What sits on the shelf: the studio work in the desk photo (Bloom Boba, Yeskoko). */
const DESK_SHOTS = [
  { src: "/studio/bloom-film-milk.webp", caption: "Bloom Boba" },
  { src: "/studio/bloom-builder-taro.webp", caption: "Bloom Boba" },
  { src: "/studio/bloom-pearls.webp", caption: "Bloom Boba" },
  { src: "/studio/yeskoko-pack.webp", caption: "Yeskoko" },
  { src: "/studio/yeskoko-mango.webp", caption: "Yeskoko" },
];

type Item = { key: string; src: string; caption?: string; href?: string; mine?: MyPhoto };
type Visitor = { id: number; name: string; at: string; image: string };

let visitorsCache: Promise<Visitor[]> | null = null;
const loadVisitors = () =>
  (visitorsCache ??= fetch("/api/guest?kind=photo")
    .then((r) => r.json())
    .then((j) => (Array.isArray(j.items) ? (j.items as Visitor[]) : []))
    .catch(() => []));

/** My photos synced with what the server now says about the ones that were sent. */
function useMine(approved: Visitor[]) {
  const [mine, setMine] = useState<MyPhoto[]>([]);
  useEffect(() => {
    let on = true;
    const load = () => myPhotos.list().then((l) => on && setMine(l));
    load();
    const off = myPhotos.subscribe(load);
    return () => {
      on = false;
      off();
    };
  }, []);
  // a sent photo that now appears in the approved list has been approved
  const ids = useMemo(() => new Set(approved.map((v) => v.id)), [approved]);
  return useMemo(() => mine.map((m) => (m.status === "pending" && m.serverId && ids.has(m.serverId) ? { ...m, status: "approved" as const } : m)), [mine, ids]);
}

/** Photos: the desk, the work, visitors' selfies once approved, and the visitor's own. */
export default function PhotosApp({ start, openCamera }: { start?: Album; openCamera: () => void }) {
  const t = useOsText().photos;
  const locale = useLocale();
  const [album, setAlbum] = useState<Album | null>(start ?? null);
  const [open, setOpen] = useState<number | null>(null);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  useEffect(() => {
    let on = true;
    loadVisitors().then((v) => on && setVisitors(v));
    return () => {
      on = false;
    };
  }, []);
  const mine = useMine(visitors);

  const albums: Record<Album, Item[]> = useMemo(() => {
    const stops = localStops(STOPS, locale);
    return {
      yours: mine.map((m) => ({ key: `m${m.id}`, src: m.src, mine: m })),
      visitors: visitors.map((v) => ({ key: `v${v.id}`, src: v.image, caption: v.name || t.visitor })),
      desk: [{ key: "plate", src: PLATE.src, caption: stops[0].eyebrow }, ...DESK_SHOTS.map((d) => ({ key: d.src, src: d.src, caption: d.caption }))],
      work: visibleProjects()
        .filter((p) => thumb(p))
        .map((p) => ({ key: p.id, src: thumb(p), caption: p.name, href: `/work/${projectSlug(p)}` })),
    };
  }, [mine, visitors, locale, t.visitor]);

  const names: Record<Album, string> = { yours: t.yours, visitors: t.visitors, desk: t.desk, work: t.work };

  if (album === null)
    return (
      <div className="grid grid-cols-2 gap-x-3 gap-y-5 p-4">
        {(Object.keys(albums) as Album[]).map((a) => {
          const cover = albums[a][0]?.src;
          return (
            <button key={a} onClick={() => setAlbum(a)} className="text-left">
              <span className="block aspect-square overflow-hidden rounded-xl bg-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {cover ? <img src={cover} alt="" className="h-full w-full object-cover" loading="lazy" /> : <span className="grid h-full place-items-center text-[28px] text-white/30">◉</span>}
              </span>
              <span className="mt-1.5 block text-[14px] font-medium">{names[a]}</span>
              <span className="block text-[12.5px] text-white/50">{t.count(albums[a].length)}</span>
            </button>
          );
        })}
      </div>
    );

  const items = albums[album];
  if (open !== null && items[open]) return <Viewer items={items} index={open} onClose={() => setOpen(null)} />;

  return (
    <div className="p-1">
      <div className="flex items-center justify-between px-3 py-2">
        <button onClick={() => setAlbum(null)} className="text-[15px] text-[#5aa9ff]">
          ‹ {t.back}
        </button>
        <span className="text-[15px] font-semibold">{names[album]}</span>
        <span className="w-14" />
      </div>
      {!items.length && (
        <div className="px-6 py-14 text-center text-[14px] text-white/60">
          <p>{album === "yours" ? t.emptyYours : t.emptyVisitors}</p>
          <button onClick={openCamera} className="mt-4 rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-black">
            {t.openCamera}
          </button>
        </div>
      )}
      <div className="grid grid-cols-3 gap-[2px]">
        {items.map((it, i) => (
          <button key={it.key} onClick={() => setOpen(i)} className="relative aspect-square overflow-hidden bg-white/5" aria-label={it.caption ?? names[album]}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.src} alt="" loading="lazy" className="h-full w-full object-cover" />
            {it.mine && <Badge s={it.mine.status} />}
          </button>
        ))}
      </div>
    </div>
  );
}

function Badge({ s, big }: { s: MyPhoto["status"]; big?: boolean }) {
  const t = useOsText().photos;
  const label = { local: t.local, pending: t.pending, approved: t.approved, failed: t.failed }[s];
  const tone = { local: "bg-black/60", pending: "bg-[#c27c00]/90", approved: "bg-[#1fa851]/90", failed: "bg-[#c0392b]/90" }[s];
  return <span className={`absolute bottom-1 left-1 rounded-full px-1.5 py-px text-white ${tone} ${big ? "text-[12px]" : "text-[9px]"}`}>{label}</span>;
}

function Viewer({ items, index, onClose }: { items: Item[]; index: number; onClose: () => void }) {
  const all = useOsText();
  const t = all.photos;
  const [i, setI] = useState(index);
  const [busy, setBusy] = useState(false);
  const it = items[Math.min(i, items.length - 1)];
  if (!it) return null;
  const resend = async (m: MyPhoto) => {
    setBusy(true);
    const r = await fetch("/api/guest", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind: "photo", image: m.src, sid: visitSession() }) })
      .then((x) => (x.ok ? x.json() : null))
      .catch(() => null);
    await myPhotos.put({ ...m, status: r?.ok ? "pending" : "failed", serverId: r?.id ?? m.serverId }).catch(() => {});
    setBusy(false);
  };
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-black">
      <div className="flex items-center justify-between px-3 py-2 text-[15px]">
        <button onClick={onClose} className="text-[#5aa9ff]">
          ‹
        </button>
        <span className="text-[12.5px] text-white/60">
          {i + 1} / {items.length}
        </span>
        <span className="w-6" />
      </div>
      <div
        className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overscroll-contain [scrollbar-width:none]"
        data-lenis-prevent
        onScroll={(e) => {
          const el = e.currentTarget;
          const n = Math.round(el.scrollLeft / el.clientWidth);
          if (n !== i) setI(n);
        }}
        ref={(el) => {
          // land on the tapped photo once
          if (el && !el.dataset.ready) {
            el.dataset.ready = "1";
            el.scrollLeft = index * el.clientWidth;
          }
        }}
      >
        {items.map((x) => (
          <div key={x.key} className="relative grid h-full w-full shrink-0 snap-center place-items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={x.src} alt={x.caption ?? ""} className="max-h-full max-w-full object-contain" />
          </div>
        ))}
      </div>
      <div className="min-h-16 space-y-2 px-4 py-3 text-[13.5px]">
        {it.caption && <p className="text-white/80">{it.caption}</p>}
        {it.href && (
          <Link href={it.href} className="text-[#ff8a5c]">
            {t.openProject} →
          </Link>
        )}
        {it.mine && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="relative inline-block h-5 w-36">
              <Badge s={it.mine.status} big />
            </span>
            {(it.mine.status === "local" || it.mine.status === "failed") && (
              <button disabled={busy} onClick={() => resend(it.mine!)} className="rounded-full bg-[var(--accent)] px-3 py-1 text-[12.5px] font-semibold text-black disabled:opacity-60">
                {t.sendNow}
              </button>
            )}
            {(it.mine.status === "local" || it.mine.status === "failed") && <p className="w-full text-[11.5px] leading-snug text-white/50">{all.camera.consent}</p>}
            <button
              onClick={() => {
                if (it.mine?.id != null) myPhotos.remove(it.mine.id).then(onClose);
              }}
              className="rounded-full border border-white/20 px-3 py-1 text-[12.5px] text-[#ff9b8a]"
            >
              {t.remove}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
