"use client";

import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { AttributionControl, LngLatBounds, Map as MlMap, setWorkerUrl } from "maplibre-gl";

setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

/** Dots on a map, sized by count. Used for visitors in the back office. */
export default function PointsMap({ points }: { points: { lng: number; lat: number; n: number; label: string }[] }) {
  const box = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!box.current || !points.length) return;
    let loaded = false;
    const m = new MlMap({ container: box.current, style: "https://tiles.openfreemap.org/styles/positron", attributionControl: false, cooperativeGestures: true, center: [0, 20], zoom: 1.2 });
    m.addControl(new AttributionControl({ compact: true }), "bottom-right");
    m.on("load", () => {
      loaded = true;
      m.addSource("pts", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: points.map((p) => ({ type: "Feature", properties: { n: p.n, label: p.label }, geometry: { type: "Point", coordinates: [p.lng, p.lat] } })),
        },
      });
      m.addLayer({
        id: "pts",
        type: "circle",
        source: "pts",
        paint: {
          "circle-color": "#ff5b1f",
          "circle-opacity": 0.75,
          "circle-stroke-color": "#fff",
          "circle-stroke-width": 1.5,
          "circle-radius": ["interpolate", ["linear"], ["get", "n"], 1, 5, 20, 16, 100, 26],
        },
      });
      const b = new LngLatBounds();
      points.forEach((p) => b.extend([p.lng, p.lat]));
      if (points.length > 1) m.fitBounds(b, { padding: 50, maxZoom: 9, duration: 0 });
      else m.jumpTo({ center: [points[0].lng, points[0].lat], zoom: 8 });
    });
    m.on("error", () => !loaded && setFailed(true));
    return () => m.remove();
  }, [points]);

  if (!points.length) return <p className="h-full grid place-items-center text-[13px] text-[var(--ink-3)]">No located visits yet.</p>;
  return (
    <div className="absolute inset-0">
      <div ref={box} className="w-full h-full" />
      {failed && <p className="absolute inset-0 grid place-items-center text-[13px] text-[var(--ink-3)] bg-[var(--surface)]">The map tiles did not load here.</p>}
    </div>
  );
}
