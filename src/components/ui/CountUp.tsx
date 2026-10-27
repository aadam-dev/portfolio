"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/** Counts up the numeric part of values like "420+", "GHS 40K+", "3". */
export default function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView || reduce) return;
    const match = value.match(/(\d+(?:\.\d+)?)/);
    if (!match) return;
    const target = parseFloat(match[1]);
    const controls = animate(Math.floor(target * 0.4), target, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        const rendered = Number.isInteger(target) ? Math.round(v).toString() : v.toFixed(1);
        setDisplay(value.replace(match[1], rendered));
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {display}
    </span>
  );
}
