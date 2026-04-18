"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  title: string;
  /** The virtual width we render the iframe at. */
  designWidth?: number;
  /** Aspect ratio of the virtual viewport (width / height). Default 1440 / 900. */
  designAspect?: number;
  className?: string;
}

/**
 * Renders a desktop-sized iframe (`designWidth` × designWidth/designAspect)
 * inside a responsive container, scaled with CSS transform so the content is
 * faithfully readable on any screen size.
 */
export default function ScaledIframe({
  src,
  title,
  designWidth = 1440,
  designAspect = 1440 / 900,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const w = el.clientWidth;
      setScale(Math.min(w / designWidth, 1));
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [designWidth]);

  const designHeight = designWidth / designAspect;
  const displayedHeight = designHeight * scale;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ height: displayedHeight }}
    >
      <iframe
        title={title}
        src={src}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        referrerPolicy="no-referrer"
        style={{
          width: designWidth,
          height: designHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          border: 0,
          background: "#fff",
          display: "block",
        }}
      />
    </div>
  );
}
