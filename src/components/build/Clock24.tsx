"use client";

import { useEffect, useState } from "react";

/**
 * A 24-hour dial. Midnight at the bottom, noon at the top. The shaded arc is
 * the working day; the hand shows the time now in that place.
 */
const R = 44;
const angle = (h: number) => ((h / 24) * 360 + 180) * (Math.PI / 180);
const pt = (h: number, r = R) => [50 + r * Math.sin(angle(h)), 50 - r * Math.cos(angle(h))];

function arc(from: number, to: number, r = R) {
  const [x1, y1] = pt(from, r);
  const [x2, y2] = pt(to, r);
  const large = (((to - from) % 24) + 24) % 24 > 12 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

/** Current hour (fractional) at a GMT offset, refreshed each minute. */
export function useHourAt(offset: number) {
  const [h, setH] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setH((((d.getUTCHours() + d.getUTCMinutes() / 60 + offset) % 24) + 24) % 24);
    };
    const first = requestAnimationFrame(tick);
    const id = window.setInterval(tick, 30000);
    return () => {
      cancelAnimationFrame(first);
      window.clearInterval(id);
    };
  }, [offset]);
  return h;
}

export default function Clock24({
  offset,
  work,
  overlap,
  tone,
  label,
}: {
  /** GMT offset of the place, in hours. */
  offset: number;
  /** Working hours in local time. */
  work: [number, number];
  /** Overlap with the other party, in this place's local hours. */
  overlap?: [number, number] | null;
  tone: string;
  label: string;
}) {
  const h = useHourAt(offset);
  const hand = h == null ? null : pt(h, R - 12);
  const time = h == null ? "--:--" : `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.floor((h % 1) * 60)).padStart(2, "0")}`;
  return (
    <figure className="flex flex-col items-center">
      <svg viewBox="0 0 100 100" className="w-[120px] h-[120px]" role="img" aria-label={`${label}, ${time}`}>
        <circle cx="50" cy="50" r="48" fill="currentColor" opacity="0.04" />
        <circle cx="50" cy="50" r={R} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="6" />
        <path d={arc(work[0], work[1])} fill="none" stroke={tone} strokeWidth="6" strokeLinecap="butt" opacity="0.55" />
        {overlap && overlap[1] > overlap[0] && (
          <path d={arc(overlap[0], overlap[1])} fill="none" stroke={tone} strokeWidth="6" strokeLinecap="butt" />
        )}
        {[0, 6, 12, 18].map((q) => {
          const [x, y] = pt(q, R - 13);
          return (
            <text key={q} x={x} y={y + 2.5} textAnchor="middle" fontSize="7" fill="currentColor" opacity="0.45" fontFamily="var(--font-mono)">
              {String(q).padStart(2, "0")}
            </text>
          );
        })}
        {hand && <line x1="50" y1="50" x2={hand[0]} y2={hand[1]} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
        <circle cx="50" cy="50" r="2.5" fill="currentColor" />
      </svg>
      <figcaption className="mt-1 text-center">
        <span className="block font-mono text-[15px] tabular-nums">{time}</span>
        <span className="block text-[11.5px] opacity-60">{label}</span>
      </figcaption>
    </figure>
  );
}
