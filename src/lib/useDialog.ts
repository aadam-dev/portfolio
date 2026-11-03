"use client";

import { useEffect, useRef, type RefObject } from "react";
import { lockScroll } from "./scroll";

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,iframe,[tabindex]:not([tabindex="-1"])';

/**
 * Behaviour every modal on the site shares: focus moves in and is kept inside, Esc calls
 * `onEscape`, the page behind stops scrolling, and focus returns to where it was on close.
 */
export function useDialog(ref: RefObject<HTMLElement | null>, onEscape: () => void, active = true) {
  const esc = useRef(onEscape);
  useEffect(() => {
    esc.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    const before = document.activeElement as HTMLElement | null;
    lockScroll(true);
    const first = el.querySelector<HTMLElement>("[data-autofocus]") ?? el.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? el).focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        esc.current();
        return;
      }
      if (e.key !== "Tab") return;
      const items = [...el.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((x) => x.offsetParent !== null || x === document.activeElement);
      if (!items.length) return;
      const a = items[0];
      const z = items[items.length - 1];
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault();
        a.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      lockScroll(false);
      before?.focus?.({ preventScroll: true });
    };
  }, [ref, active]);
}
