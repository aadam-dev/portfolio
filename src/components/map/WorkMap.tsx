"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, MapPin, Pause, Play, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Schematic from "./Schematic";
import { PLACES, mapsSearch, placeHref, type Place } from "./places";
import type { MapView } from "./MapCanvas";

const MapCanvas = dynamic(() => import("./MapCanvas"), { ssr: false });

function webgl() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function Card({ place, onClose }: { place: Place; onClose: () => void }) {
  const t = useTranslations("home.map");
  return (
    <motion.div
      key={place.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25 }}
      className="card card-float absolute z-10 left-3 right-3 bottom-3 md:left-auto md:right-4 md:bottom-4 md:w-[340px] !bg-[var(--background)]"
    >
      <div className="card-media !aspect-[16/6] md:!aspect-[16/10]">
        <Image src={place.image} alt="" fill sizes="360px" className="object-cover object-top" />
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="on-media absolute top-2 right-2 !w-10 !h-10 md:!w-8 md:!h-8 !p-0 justify-center"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4">
        <p className="card-meta">
          <MapPin className="w-3.5 h-3.5" /> {place.area}
        </p>
        <h3 className="mt-1 card-title">{place.name}</h3>
        <p className="card-text !mt-1.5 !text-[13.5px]">{place.shipped}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
          <Link href={placeHref(place)} className="hit inline-flex items-center gap-1 text-white underline-offset-4 hover:underline">
            {t("caseStudy")} <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href={mapsSearch(place)}
            target="_blank"
            rel="noreferrer"
            className="hit inline-flex items-center gap-1 text-[var(--ink-2)] underline-offset-4 hover:underline"
          >
            {t("directions")} <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/** Where the work runs: a pin for every shop, kitchen, court and college. */
export default function WorkMap() {
  const t = useTranslations("home.map");
  const section = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [state, setState] = useState<"idle" | "ready" | "failed">("idle");
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<MapView>("accra");
  const [touring, setTouring] = useState(false);

  // load the tile map only when the section is close
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        if (webgl()) setNear(true);
        else setState("failed");
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // the tour steps through every pin, then stops
  useEffect(() => {
    if (!touring) return;
    const order = PLACES.filter((p) => state === "ready" || !p.abroad).map((p) => p.id);
    let i = 0;
    const step = () => {
      if (i >= order.length) {
        setTouring(false);
        setSelected(null);
        return;
      }
      setSelected(order[i++]);
    };
    const first = window.setTimeout(step, 0);
    const id = window.setInterval(step, 3400);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [touring, state]);

  const pick = (id: string) => {
    setTouring(false);
    setSelected((s) => (s === id ? null : id));
  };

  const place = PLACES.find((p) => p.id === selected) ?? null;
  const live = state === "ready";
  const accra = PLACES.filter((p) => !p.abroad);
  const abroad = PLACES.filter((p) => p.abroad);

  return (
    <section
      ref={section}
      id="map"
      aria-labelledby="map-heading"
      className="relative px-4 md:px-6 py-24 md:py-32 bg-[var(--surface)]"
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 mb-10 md:mb-12 items-end">
          <h2
            id="map-heading"
            className="md:col-span-6 font-display text-white text-balance"
            style={{ fontSize: "clamp(2.25rem, 5.5vw, 4rem)", lineHeight: 0.98, letterSpacing: "-0.03em" }}
          >
            {t("heading")}
          </h2>
          <p className="md:col-span-5 md:col-start-8 text-[15px] md:text-[16px] leading-[1.65] text-[var(--ink-2)] text-pretty">
            {t("sub")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-4">
          <div
            className="card relative h-[62svh] min-h-[420px] max-h-[680px] !bg-[var(--surface-2)] map-shell"
            data-view={view}
          >
            <Schematic places={PLACES} selected={selected} onSelect={pick} />
            {near && state !== "failed" && (
              <div className={`absolute inset-0 transition-opacity duration-700 ${live ? "opacity-100" : "opacity-0"}`}>
                <MapCanvas
                  places={PLACES}
                  selected={selected}
                  view={view}
                  onSelect={pick}
                  onReady={() => setState("ready")}
                  onFail={() => setState("failed")}
                />
              </div>
            )}

            <div className="absolute z-10 top-3 left-3 flex flex-wrap gap-2">
              {live && (
                <div className="seg seg-dark">
                  {(["accra", "world"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={view === v}
                      onClick={() => {
                        setTouring(false);
                        setSelected(null);
                        setView(v);
                      }}
                      className="seg-item"
                    >
                      {t(v)}
                    </button>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => setTouring((x) => !x)}
                aria-pressed={touring}
                className="on-media"
              >
                {touring ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {touring ? t("stop") : t("tour")}
              </button>
            </div>

            <AnimatePresence>{place && <Card place={place} onClose={() => pick(place.id)} />}</AnimatePresence>
          </div>

          <div className="lg:h-[62svh] lg:min-h-[420px] lg:max-h-[680px] flex flex-col">
            <ul className="flex lg:flex-col gap-2 lg:gap-1.5 overflow-x-auto lg:overflow-y-auto -mx-4 px-4 lg:mx-0 lg:px-0 pb-1 snap-x">
              {[...accra, ...abroad].map((p, i) => (
                <li key={p.id} className="snap-start shrink-0 lg:shrink">
                  {i === accra.length && (
                    <p className="hidden lg:block mt-2 mb-1.5 label">{t("world")}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => pick(p.id)}
                    aria-pressed={selected === p.id}
                    className={`card card-link w-full px-3.5 py-2.5 lg:py-2 min-h-11 lg:min-h-0 !bg-[var(--background)] ${selected === p.id ? "card-on" : ""}`}
                  >
                    <span className="block text-[14px] leading-tight font-medium whitespace-nowrap">{p.name}</span>
                    <span className="block card-meta mt-0.5 whitespace-nowrap">{p.area}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-3 text-[12px] text-[var(--ink-3)]">{t("approx")}</p>
      </div>
    </section>
  );
}
