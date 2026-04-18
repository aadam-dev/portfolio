"use client";

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  /** seconds per full loop */
  duration?: number;
  direction?: "left" | "right";
}

export default function Marquee({
  children,
  className = "",
  duration = 40,
  direction = "left",
}: Props) {
  return (
    <div
      className={`edge-fade-x overflow-hidden ${className}`}
      role="marquee"
      aria-label="Marquee"
    >
      <div
        className="marquee-track flex items-center gap-12 whitespace-nowrap"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
          width: "max-content",
        }}
      >
        {/* Duplicated twice so the loop is seamless */}
        <div className="flex items-center gap-12">{children}</div>
        <div className="flex items-center gap-12" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
