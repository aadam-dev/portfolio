"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import AadamOS, { type Win } from "./AadamOS";
import { quadMatrix, type Quad } from "./quad";
import { scrollToElement } from "@/lib/scroll";

/** Desk photo + screen corners (fractions of the photo: TL, TR, BR, BL). */
const PLATE = "/desk/bloom-boba-desk.webp";
const PLATE_AR = 1536 / 864;
const SCREEN: Quad = [
  [0.2253, 0.1516],
  [0.7174, 0.1516],
  [0.7259, 0.6944],
  [0.2122, 0.6944],
];
const OS_W = 1600;
const OS_H = 1000;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// scroll choreography (fractions of the pinned track)
const HOLD = 0.12; // establishing shot
const LAND = 0.68; // zoom finished, OS goes interactive

/**
 * "Aadam's desk": a photographed desk with Aadam OS running on the laptop. Scrolling dollies the
 * camera into the screen until the OS fills the viewport and becomes interactive. Touch devices and
 * reduced motion get the still desk and a button that opens the OS full screen.
 */
export default function DeskStage() {
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const osBox = useRef<HTMLDivElement>(null);
  const spill = useRef<HTMLDivElement>(null);
  const glare = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [immersive, setImmersive] = useState(true);
  const [landed, setLanded] = useState(false);
  const [modal, setModal] = useState(false);
  const [windows, setWindows] = useState<Win[]>([{ id: "p:bloom-boba", kind: "project", slug: "bloom-boba", x: 22, y: 8, z: 10, tab: "walkthrough" }]);
  const setW = useCallback((fn: (w: Win[]) => Win[]) => setWindows(fn), []);
  const size = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    setImmersive(!reduced && fine && window.innerWidth >= 900);
  }, [reduced]);

  /** Plate rect (cover-fit in the stage), the screen quad in stage px, and its centre. */
  const geometry = useCallback(() => {
    const el = stage.current!;
    const W = el.clientWidth;
    const H = el.clientHeight;
    let pw = W;
    let ph = W / PLATE_AR;
    if (ph < H) {
      ph = H;
      pw = H * PLATE_AR;
    }
    const pl = (W - pw) / 2;
    const pt = (H - ph) / 2;
    const quad = SCREEN.map(([x, y]) => [pl + x * pw, pt + y * ph] as [number, number]);
    const cx = (quad[0][0] + quad[1][0] + quad[2][0] + quad[3][0]) / 4;
    const cy = (quad[0][1] + quad[1][1] + quad[2][1] + quad[3][1]) / 4;
    const sw = (quad[1][0] - quad[0][0] + (quad[2][0] - quad[3][0])) / 2;
    const sh = (quad[3][1] - quad[0][1] + (quad[2][1] - quad[1][1])) / 2;
    return { W, H, pw, ph, pl, pt, quad, cx, cy, sw, sh };
  }, []);

  const render = useCallback(
    (p: number) => {
      if (!stage.current || !plate.current || !osBox.current) return;
      const g = geometry();
      const k = ease(clamp((p - HOLD) / (LAND - HOLD)));
      // zoom so the screen covers the viewport, moving its centre to the middle
      const sEnd = Math.max(g.W / g.sw, g.H / g.sh) * 1.02;
      const s = 1 + (sEnd - 1) * k;
      const tx = (g.W / 2 - g.cx) * k;
      const ty = (g.H / 2 - g.cy) * k;
      plate.current.style.transformOrigin = `${g.cx}px ${g.cy}px`;
      plate.current.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
      // the OS follows the same camera move, projected onto the zoomed quad
      const q = g.quad.map(([x, y]) => [g.cx + (x - g.cx) * s + tx, g.cy + (y - g.cy) * s + ty] as [number, number]);
      const isLanded = p >= LAND;
      if (isLanded) {
        osBox.current.style.transform = "none";
        osBox.current.style.width = `${g.W}px`;
        osBox.current.style.height = `${g.H}px`;
      } else {
        osBox.current.style.width = `${OS_W}px`;
        osBox.current.style.height = `${OS_H}px`;
        osBox.current.style.transform = quadMatrix(OS_W, OS_H, q);
      }
      setLanded((was) => (was === isLanded ? was : isLanded));
      if (glare.current) glare.current.style.opacity = String(0.9 * (1 - k));
      if (copy.current) {
        copy.current.style.opacity = String(1 - clamp((p - HOLD) / 0.12));
        copy.current.style.transform = `translateY(${-30 * clamp((p - HOLD) / 0.2)}px)`;
      }
    },
    [geometry],
  );

  // scroll → camera
  useEffect(() => {
    if (!immersive) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = track.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const len = r.height - window.innerHeight;
        render(clamp(-r.top / len));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [immersive, render]);

  // non-immersive: keep the OS projected on the still photo
  useLayoutEffect(() => {
    if (immersive || !stage.current || !osBox.current) return;
    const fit = () => {
      const g = geometry();
      size.current = { w: g.W, h: g.H };
      osBox.current!.style.width = `${OS_W}px`;
      osBox.current!.style.height = `${OS_H}px`;
      osBox.current!.style.transform = quadMatrix(OS_W, OS_H, g.quad);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(stage.current);
    return () => ro.disconnect();
  }, [immersive, geometry]);

  // screen light spills onto the desk: average colour of what's on screen
  useEffect(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 4;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    const t = setInterval(() => {
      const v = osBox.current?.querySelector<HTMLVideoElement>("[data-os-video]");
      const src: CanvasImageSource | null = v && v.readyState >= 2 ? v : osBox.current?.querySelector("img") ?? null;
      if (!ctx || !src || !spill.current) return;
      try {
        ctx.drawImage(src, 0, 0, 4, 4);
        const d = ctx.getImageData(0, 0, 4, 4).data;
        let r = 0, gg = 0, b = 0;
        for (let i = 0; i < d.length; i += 4) {
          r += d[i];
          gg += d[i + 1];
          b += d[i + 2];
        }
        const n = d.length / 4;
        spill.current.style.setProperty("--spill", `rgb(${(r / n) | 0}, ${(gg / n) | 0}, ${(b / n) | 0})`);
      } catch {
        /* cross-origin frame: skip */
      }
    }, 250);
    return () => clearInterval(t);
  }, []);

  // glare follows the mouse a little
  const onMove = (e: React.MouseEvent) => {
    if (!glare.current) return;
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    glare.current.style.background = `linear-gradient(${115 + (x - 50) * 0.3}deg, transparent ${30 + y * 0.1}%, rgba(255,255,255,0.10) ${42 + y * 0.1}%, transparent ${56 + y * 0.1}%)`;
  };

  const enter = () => {
    if (!immersive) return setModal(true);
    const el = track.current;
    if (!el) return;
    const len = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + len * (LAND + 0.04) });
  };
  const exit = () => {
    if (!immersive) return setModal(false);
    const next = track.current?.nextElementSibling as HTMLElement | null;
    if (next) scrollToElement(next);
  };

  const osLayer = (
    <div
      ref={osBox}
      className="absolute left-0 top-0 origin-top-left overflow-hidden"
      style={{ width: OS_W, height: OS_H, borderRadius: landed ? 0 : 6, zIndex: 3 }}
    >
      <AadamOS mode={landed ? "flat" : "projected"} windows={windows} setWindows={setW} onExit={exit} />
      <div ref={glare} aria-hidden className="pointer-events-none absolute inset-0 transition-opacity" />
    </div>
  );

  const intro = (
          <div ref={copy} className={immersive ? "pointer-events-none absolute inset-x-0 top-0 z-[4] bg-gradient-to-b from-[var(--background)] via-[var(--background)]/60 to-transparent px-4 pb-28 pt-24 md:px-6" : "relative px-4 pb-6 pt-16"}>
            <div className="mx-auto flex max-w-[1280px] flex-wrap items-end justify-between gap-6">
              <div className="max-w-xl">
                <p className="eyebrow mb-3">Step inside</p>
                <h2 className="font-display text-white" style={{ fontSize: "clamp(2rem, 5vw, 4.2rem)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                  Pull up a chair.
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-2)]">
                  {immersive ? "Scroll into the laptop. Every project is an app: open it, watch it run, try the live site." : "Every project is an app on this desk. Open it, watch it run, try the live site."}
                </p>
              </div>
              <button onClick={enter} className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-[13px] font-semibold text-black">
                {immersive ? "Jump to the desktop" : "Open Aadam OS"} <span aria-hidden>↓</span>
              </button>
            </div>
          </div>
  );

  return (
    <>
      <section
        ref={track}
        id="desk"
        className="relative bg-[var(--background)]"
        style={{ height: immersive ? "340vh" : "auto" }}
        aria-label="Aadam's desk: an interactive desktop of projects"
      >
        {!immersive && intro}
        <div
          ref={stage}
          onMouseMove={onMove}
          style={{ zIndex: landed ? 50 : undefined }}
          className={immersive ? "sticky top-0 h-[100svh] w-full overflow-hidden" : "relative aspect-[16/9] w-full overflow-hidden"}
        >
          {/* desk photo */}
          <div ref={plate} className="absolute inset-0 will-change-transform" style={{ zIndex: 1 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PLATE} alt="A walnut desk in afternoon light with a laptop and a bubble tea" className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover" />
            {/* screen light on the desk and keyboard */}
            <div
              ref={spill}
              aria-hidden
              className="absolute inset-0 mix-blend-screen transition-[background] duration-500"
              style={{
                background: "radial-gradient(ellipse 34% 26% at 47% 78%, color-mix(in srgb, var(--spill, #8a6a4a) 38%, transparent), transparent 70%)",
                opacity: 0.55,
              }}
            />
          </div>
          {osLayer}

          {immersive && intro}
        </div>
      </section>

      {/* full-screen OS for touch + reduced motion */}
      {modal && (
        <div className="fixed inset-0 z-[90] bg-black" role="dialog" aria-modal="true" aria-label="Aadam OS">
          <AadamOS mode="flat" windows={windows} setWindows={setW} onExit={() => setModal(false)} />
        </div>
      )}
    </>
  );
}
