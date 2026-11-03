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
