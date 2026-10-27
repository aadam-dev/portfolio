"use client";

import { useId } from "react";
import type { Place } from "./places";

/**
 * A drawn map of the Accra pins, used before the tile map loads and when
 * it can't (no WebGL, tiles blocked). Same pins, same selection.
 */
const W = 1600;
const H = 900;
const C = { lng: -0.1585, lat: 5.6835 };
const S = 9800; // px per degree

const x = (lng: number) => W / 2 + (lng - C.lng) * S;
const y = (lat: number) => H / 2 - (lat - C.lat) * S;

const AREAS = [
  { name: "Legon", lng: -0.1905, lat: 5.6435 },
  { name: "Madina", lng: -0.168, lat: 5.6745 },
  { name: "Adenta", lng: -0.1555, lat: 5.7215 },
  { name: "Lakeside Estate", lng: -0.1245, lat: 5.678 },
  { name: "East Legon", lng: -0.158, lat: 5.637 },
];

export default function Schematic({
  places,
  selected,
  onSelect,
  interactive = true,
}: {
  places: Place[];
  selected: string | null;
  onSelect?: (id: string) => void;
  interactive?: boolean;
}) {
  const dots = useId();
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" {...(interactive ? { role: "group", "aria-label": "Accra" } : { "aria-hidden": true })}>
      <defs>
        <pattern id={dots} width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.3" fill="var(--ink-5)" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="var(--surface)" />
      <rect width={W} height={H} fill={`url(#${dots})`} />
      {AREAS.map((a) => (
        <text
          key={a.name}
          x={x(a.lng)}
          y={y(a.lat)}
          textAnchor="middle"
          className="font-mono uppercase"
          style={{ fontSize: 15, letterSpacing: "0.2em", fill: "var(--ink-4)" }}
        >
          {a.name}
        </text>
      ))}
      {places
        .filter((p) => !p.abroad)
        .map((p) => {
          const on = p.id === selected;
          return (
            <g
              key={p.id}
              transform={`translate(${x(p.lng)} ${y(p.lat)})`}
              {...(interactive && {
                role: "button",
                tabIndex: 0,
                "aria-label": `${p.name}, ${p.area}`,
                "aria-pressed": on,
                onClick: () => onSelect?.(p.id),
                onKeyDown: (e: React.KeyboardEvent) => {
                  if (e.key !== "Enter" && e.key !== " ") return;
                  e.preventDefault();
                  onSelect?.(p.id);
                },
              })}
              className="cursor-pointer outline-none [&:focus-visible_circle]:stroke-[var(--foreground)]"
            >
              {on && <circle r="26" fill="var(--accent)" opacity="0.18" />}
              <circle r={on ? 11 : 8} fill="var(--accent)" stroke="var(--background)" strokeWidth="3" />
              <text
                x="16"
                y="6"
                style={{ fontSize: 19, fontWeight: 600, fill: on ? "var(--foreground)" : "var(--ink-2)" }}
              >
                {p.name}
              </text>
            </g>
          );
        })}
    </svg>
  );
}
