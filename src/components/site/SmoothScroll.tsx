"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { registerLenis } from "@/lib/scroll";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    // nested scrollers (replica screens, the office, menus) keep their own wheel scrolling
    const lenis = new Lenis({ lerp: 0.1, allowNestedScroll: true });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    registerLenis(lenis);
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      registerLenis(null);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}
