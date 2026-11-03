"use client";

import { useOsText } from "../l10n";
import { useSyncExternalStore } from "react";
import { TRACKS, type Track } from "../content";

/* ------------------------------------------------------------------ one player for the whole OS (and the phone) */

type State = { track: Track; playing: boolean; volume: number; time: number; duration: number };
let audio: HTMLAudioElement | null = null;
let state: State = { track: TRACKS[0], playing: false, volume: 0.35, time: 0, duration: 0 };
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
const set = (patch: Partial<State>) => {
  state = { ...state, ...patch };
  emit();
};

function el() {
  if (audio || typeof window === "undefined") return audio;
  audio = new Audio();
  audio.preload = "none";
  audio.loop = true;
  audio.volume = state.volume;
  audio.addEventListener("timeupdate", () => set({ time: audio!.currentTime, duration: audio!.duration || 0 }));
  audio.addEventListener("play", () => set({ playing: true }));
  audio.addEventListener("pause", () => set({ playing: false }));
  return audio;
}

export const music = {
  play(id?: string) {
    const a = el();
    if (!a) return;
    const t = id ? TRACKS.find((x) => x.id === id) ?? state.track : state.track;
    if (!a.src.endsWith(t.src)) {
      a.src = t.src;
      set({ track: t, time: 0 });
    }
    a.play().catch(() => {});
  },
  pause() {
    audio?.pause();
  },
  toggle() {
    if (state.playing) music.pause();
    else music.play();
  },
  volume(v: number) {
    const a = el();
    if (a) a.volume = v;
    set({ volume: v });
  },
  /** Rain starts softly the first time someone clicks inside the OS (browsers only allow sound after a click). */
  ambient() {
    try {
      if (sessionStorage.getItem("os-rain") === "off" || sessionStorage.getItem("os-rain") === "on") return;
      sessionStorage.setItem("os-rain", "on");
    } catch {}
    music.play("rain");
  },
  stopAmbient() {
    try {
      sessionStorage.setItem("os-rain", "off");
    } catch {}
    music.pause();
  },
};

export function useMusic() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => state,
    () => state,
  );
}

const mmss = (s: number) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");

/** In the menu bar: what's playing, and a one-click mute. */
export function NowPlaying() {
  const s = useMusic();
  const t = useOsText().music;
  const [title] = t.tracks[s.track.id] ?? [s.track.title];
  if (!s.playing) return null;
  return (
    <button onClick={() => music.stopAmbient()} className="hidden items-center gap-1.5 rounded-md px-1.5 text-white/85 hover:bg-white/10 sm:flex" aria-label={t.pauseTrack(title)}>
      <span aria-hidden className="flex h-3 items-end gap-[2px]">
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-[2px] animate-pulse rounded-sm bg-white" style={{ height: `${6 + i * 3}px`, animationDelay: `${i * 0.2}s` }} />
        ))}
      </span>
      <span className="max-w-[140px] truncate">{title}</span>
    </button>
  );
}

/** Music: three field recordings from Accra, on a loop. */
export default function MusicApp({ live }: { live: boolean }) {
  const s = useMusic();
  const t = useOsText().music;
  const name = (x: Track) => t.tracks[x.id] ?? [x.title, x.artist];
  const tab = live ? 0 : -1;
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#1d1a17] to-[#0e0c0a] p-5 text-white">
      <div className="flex gap-4">
        <div className="grid h-28 w-28 shrink-0 place-items-center rounded-xl text-[34px] shadow-xl" style={{ background: s.track.tone }} aria-hidden>
          ♪
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">{s.playing ? t.playing : t.paused}</p>
          <p className="mt-1 truncate text-[18px] font-semibold">{name(s.track)[0]}</p>
          <p className="text-[13px] text-white/60">{name(s.track)[1]}</p>
          <div className="mt-3 flex items-center gap-3">
            <button tabIndex={tab} onClick={() => music.toggle()} aria-label={s.playing ? t.pause : t.play} className="grid h-11 w-11 place-items-center rounded-full bg-white text-[16px] text-black">
              {s.playing ? "❚❚" : "▶"}
            </button>
            <label className="flex flex-1 items-center gap-2 text-[12px] text-white/60">
              <span aria-hidden>🔈</span>
              <input tabIndex={tab} type="range" min={0} max={1} step={0.05} value={s.volume} onChange={(e) => music.volume(Number(e.target.value))} aria-label={t.volume} className="w-full accent-white" />
            </label>
          </div>
          <div className="mt-2 flex items-center gap-2 font-mono text-[10.5px] text-white/45">
            <span>{mmss(s.time)}</span>
            <span className="h-1 flex-1 overflow-hidden rounded bg-white/15">
              <span className="block h-full bg-white/70" style={{ width: `${s.duration ? (s.time / s.duration) * 100 : 0}%` }} />
            </span>
            <span>{mmss(s.duration)}</span>
          </div>
        </div>
      </div>
      <ol className="mt-5 divide-y divide-white/10 rounded-lg border border-white/10">
        {TRACKS.map((x, i) => (
          <li key={x.id}>
            <button tabIndex={tab} onClick={() => music.play(x.id)} className={`flex w-full items-center gap-3 px-3 py-2.5 text-start hover:bg-white/[0.06] ${s.track.id === x.id ? "text-[var(--accent-2)]" : ""}`}>
              <span className="w-4 font-mono text-[11px] text-white/40">{s.track.id === x.id && s.playing ? "♪" : i + 1}</span>
              <span className="flex-1 text-[13px]">{name(x)[0]}</span>
              <span className="text-[12px] text-white/45">{name(x)[1]}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="mt-auto pt-4 text-[11.5px] text-white/40">{t.note}</p>
    </div>
  );
}
