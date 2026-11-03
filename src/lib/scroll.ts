import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

/** Scroll to an element, through Lenis when it is running so the two never fight. */
export function scrollToElement(el: HTMLElement, offset = 0) {
  if (lenis) {
    lenis.scrollTo(el, { offset });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}

/** Scroll to a page offset, through Lenis when it is running. */
export function scrollToY(top: number, opts: { immediate?: boolean } = {}) {
  if (lenis) {
    lenis.scrollTo(top, { immediate: opts.immediate });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: opts.immediate || reduce ? "auto" : "smooth" });
}

/** Freeze or release page scrolling (for dialogs), whether or not Lenis is running. */
export function lockScroll(on: boolean) {
  if (lenis) {
    if (on) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = on ? "hidden" : "";
}
