"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";

export type Quad = [[number, number], [number, number], [number, number], [number, number]]; // TL, TR, BR, BL (fractions of the photo)

export interface DeskSceneProps {
  /** Photoreal desk photo with a blank laptop screen. */
  image: string;
  /** Walkthrough recording mapped onto the screen; encode with short GOPs so it scrubs smoothly. */
  video: string;
  poster?: string;
  /** Screen corners as fractions of the photo. */
  screen: Quad;
  kicker: string;
  title: string;
  line: string;
  href?: string;
  hrefLabel?: string;
  liveUrl?: string;
}

/** Solve the projective transform that maps the rect (0,0,w,h) onto the quad, as a CSS matrix3d. */
function quadMatrix(w: number, h: number, dst: [number, number][]) {
  const src: [number, number][] = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ];
  const A: number[][] = [];
  const b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i];
    const [u, v] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    b.push(v);
  }
  // Gaussian elimination
  const n = 8;
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    [b[c], b[p]] = [b[p], b[c]];
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      for (let k = c; k < n; k++) A[r][k] -= f * A[c][k];
      b[r] -= f * b[c];
    }
  }
  const [a, bb, c, d, e, f, g, hh] = b.map((v, i) => v / A[i][i]);
  return `matrix3d(${a},${d},0,${g},${bb},${e},0,${hh},0,0,1,0,${c},${f},0,1)`;
}

/**
 * A photographed desk with the project playing on the laptop. On desktop the section pins and
 * scrolling scrubs the recording; on touch and under reduced motion it simply loops.
 */
export default function DeskScene(props: DeskSceneProps) {
  const { image, video, poster, screen, kicker, title, line, href, hrefLabel, liveUrl } = props;
  const track = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [scrub, setScrub] = useState(false);
  const [m, setM] = useState<string>("none");
  const VW = 1600;
  const VH = 1000;

  useEffect(() => {
    setScrub(!reduced && window.matchMedia("(pointer: fine)").matches && window.innerWidth >= 900);
  }, [reduced]);

  useLayoutEffect(() => {
    const el = frame.current;
    if (!el) return;
    const fit = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const pts = screen.map(([x, y]) => [x * w, y * h] as [number, number]);
      // video element is laid out at VW x VH, then projected into the screen quad
      setM(quadMatrix(VW, VH, pts));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [screen]);

  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const zoom = useTransform(scrollYProgress, [0, 1], [1, 1.07]);
  const copyY = useTransform(scrollYProgress, [0, 0.3], [0, -40]);

  const raf = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!scrub) return;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const v = vid.current;
      if (v && v.duration && !Number.isNaN(v.duration)) v.currentTime = Math.min(v.duration - 0.05, p * v.duration);
    });
  });

  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    if (scrub) v.pause();
    else v.play().catch(() => {});
  }, [scrub]);

  const cx = (screen[0][0] + screen[2][0]) / 2;
  const cy = (screen[0][1] + screen[2][1]) / 2;

  return (
    <section ref={track} className="relative" style={{ height: scrub ? "260vh" : "auto" }} aria-label={`${title} on a desk`}>
      <div className={scrub ? "sticky top-0 h-[100svh] overflow-hidden" : "relative py-16 md:py-24"}>
        <motion.div
          className={scrub ? "absolute inset-0" : "relative"}
          style={{ scale: scrub ? zoom : 1, transformOrigin: `${cx * 100}% ${cy * 100}%` }}
        >
          <div
            ref={frame}
            className={
              scrub
                ? "absolute left-1/2 top-1/2 aspect-[16/9] w-[max(100vw,177.78svh)] max-w-none -translate-x-1/2 -translate-y-1/2"
                : "relative aspect-[16/9] w-full"
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <video
              ref={vid}
              src={video}
              poster={poster}
              muted
              playsInline
              loop={!scrub}
              preload="auto"
              aria-label={`${title} walkthrough`}
              className="absolute left-0 top-0 origin-top-left object-cover"
              style={{ width: VW, height: VH, transform: m }}
            />
            {/* screen glare so it sits in the photo */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 30% 40% at ${cx * 100 - 12}% ${screen[0][1] * 100 + 6}%, rgba(255,240,220,0.10), transparent 70%)`,
              }}
            />
          </div>
        </motion.div>

        {/* copy */}
        <motion.div
          style={{ y: scrub ? copyY : 0 }}
          className={
            scrub
              ? "pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-[var(--background)] via-[var(--background)]/70 to-transparent px-4 pb-24 pt-24 md:px-6"
              : "relative px-4 pt-8 md:px-6"
          }
        >
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="eyebrow mb-3">{kicker}</p>
              <h2 className="font-display text-white" style={{ fontSize: "clamp(2rem, 5vw, 4rem)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                {title}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-2)]">{line}</p>
            </div>
            <div className="pointer-events-auto flex flex-wrap gap-3">
              {href && (
                <Link href={href} className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-[13px] font-semibold text-black">
                  {hrefLabel ?? "Open the case study"} <span aria-hidden>→</span>
                </Link>
              )}
              {liveUrl && (
                <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] px-5 py-3 text-[13px] text-white">
                  Visit the live site
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
