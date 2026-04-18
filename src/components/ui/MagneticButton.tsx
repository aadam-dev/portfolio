"use client";

import { useRef, type ReactNode, type MouseEvent, type CSSProperties } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

interface Props {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}

export default function MagneticButton({
  href,
  onClick,
  children,
  variant = "primary",
  external,
  className = "",
  style,
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) * 0.25;
    const dy = (e.clientY - cy) * 0.35;
    x.set(dx);
    y.set(dy);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-full transition-colors will-change-transform overflow-hidden";

  const variants: Record<string, string> = {
    primary: "bg-white text-black hover:bg-white/90",
    secondary:
      "bg-transparent text-white border border-[var(--line-strong)] hover:border-white/40 hover:bg-white/5",
    ghost:
      "bg-transparent text-[var(--ink-2)] hover:text-white hover:bg-white/5",
  };

  const content = (
    <motion.span style={{ x: sx, y: sy, display: "inline-flex" }} className="items-center gap-2">
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={`${base} ${variants[variant]} ${className}`}
        style={style}
        aria-label={ariaLabel}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`${base} ${variants[variant]} ${className}`}
      style={style}
      aria-label={ariaLabel}
    >
      {content}
    </motion.button>
  );
}
