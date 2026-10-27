"use client";

import { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { AttributionControl, LngLatBounds, Map as MlMap, Marker, NavigationControl, setWorkerUrl } from "maplibre-gl";
import type { Place } from "./places";

// Free vector tiles, no key. Night is the same style, inverted in CSS.
const STYLE = "https://tiles.openfreemap.org/styles/positron";

setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

export type MapView = "accra" | "world";

function bounds(places: Place[]) {
  const b = new LngLatBounds();
  places.forEach((p) => b.extend([p.lng, p.lat]));
  return b;
}

export default function MapCanvas({
  places,
  selected,
  view,
  onSelect,
  onReady,
  onFail,
}: {
  places: Place[];
  selected: string | null;
  view: MapView;
  onSelect: (id: string) => void;
  onReady: () => void;
  onFail: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<MlMap | null>(null);
  const pins = useRef(new Map<string, HTMLButtonElement>());
  const cb = useRef({ onSelect, onReady, onFail });
  useEffect(() => {
    cb.current = { onSelect, onReady, onFail };
  });

  useEffect(() => {
    if (!box.current) return;
    let loaded = false;
    const accra = bounds(places.filter((p) => !p.abroad));
    const m = new MlMap({
      container: box.current,
      style: STYLE,
      bounds: accra,
      fitBoundsOptions: { padding: { top: 70, bottom: 50, left: 60, right: 60 } },
      attributionControl: false,
      cooperativeGestures: true,
      dragRotate: false,
      pitchWithRotate: false,
      maxZoom: 17,
    });
    map.current = m;
    m.addControl(new AttributionControl({ compact: true }), "bottom-left");
    m.addControl(new NavigationControl({ showCompass: false }), "top-right");
    m.touchZoomRotate.disableRotation();

    const registry = pins.current;
    places.forEach((p) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "map-pin";
      if (p.abroad) el.dataset.abroad = "";
      el.setAttribute("aria-label", `${p.name}, ${p.area}`);
      el.innerHTML = `<span class="map-pin-dot"></span><span class="map-pin-label">${p.name}</span>`;
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        cb.current.onSelect(p.id);
      });
      registry.set(p.id, el);
      new Marker({ element: el, anchor: "bottom" }).setLngLat([p.lng, p.lat]).addTo(m);
    });

    m.on("load", () => {
      loaded = true;
      cb.current.onReady();
    });
    m.on("error", () => {
      if (!loaded) cb.current.onFail();
    });
    // tiles that never arrive count as a failure too
    const timer = window.setTimeout(() => !loaded && cb.current.onFail(), 9000);

    return () => {
      window.clearTimeout(timer);
      registry.clear();
      m.remove();
      map.current = null;
    };
  }, [places]);

  // keep pins in step with the selection
  useEffect(() => {
    pins.current.forEach((el, id) => el.toggleAttribute("data-on", id === selected));
  }, [selected]);

  // camera follows the selection, or the chosen view when nothing is selected
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    const p = places.find((x) => x.id === selected);
    if (p) {
      m.flyTo({ center: [p.lng, p.lat], zoom: p.abroad ? 11 : 14.2, speed: 0.9, curve: 1.5, maxDuration: 3000 });
      return;
    }
    const b = bounds(view === "world" ? places : places.filter((x) => !x.abroad));
    const pad = view === "world" ? { top: 90, bottom: 60, left: 160, right: 90 } : { top: 70, bottom: 50, left: 60, right: 60 };
    m.fitBounds(b, { padding: pad, duration: 1400 });
  }, [selected, view, places]);

  // maplibre's stylesheet sets position: relative on the container, so size it from a wrapper
  return (
    <div className="absolute inset-0">
      <div ref={box} className="w-full h-full" />
    </div>
  );
}
