"use client";

import { useSyncExternalStore } from "react";

/**
 * All desk sounds are synthesised with WebAudio, so they fire on the exact
 * physics frame that caused them and there are no audio files to load.
 * Sound is off until the visitor turns it on (autoplay rules, and manners).
 */
let enabled = false;
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
const subs = new Set<() => void>();

function audio() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.6;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return { ctx, out: master! };
}

export function setSound(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem("desk-sound", on ? "1" : "0");
  } catch {}
  if (on) audio();
  subs.forEach((s) => s());
}

export function useSound(): [boolean, (on: boolean) => void] {
  const on = useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => enabled,
    () => false,
  );
  return [on, setSound];
}

function noiseBuffer(c: AudioContext, seconds: number) {
  const b = c.createBuffer(1, Math.ceil(c.sampleRate * seconds), c.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}

/** A leather ball on wood/floor: a low thump with a short slap on top. */
export function bounce(strength: number, surface: "wood" | "floor" | "hard" = "wood") {
  if (!enabled) return;
  const v = Math.min(1, Math.max(0, strength));
  if (v < 0.04) return;
  const { ctx: c, out } = audio();
  const t = c.currentTime;
  const body = c.createOscillator();
  const g = c.createGain();
  const base = surface === "floor" ? 70 : surface === "hard" ? 150 : 105;
  body.frequency.setValueAtTime(base * 1.9, t);
  body.frequency.exponentialRampToValueAtTime(base, t + 0.09);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.9 * v, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
  body.connect(g).connect(out);
  body.start(t);
  body.stop(t + 0.25);
  const n = c.createBufferSource();
  n.buffer = noiseBuffer(c, 0.06);
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = surface === "wood" ? 1800 : 900;
  const ng = c.createGain();
  ng.gain.setValueAtTime(0.5 * v, t);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  n.connect(bp).connect(ng).connect(out);
  n.start(t);
}

/** A fingertip on water: a pitched plink and a soft wash. */
export function plink(strength = 0.6) {
  if (!enabled) return;
  const { ctx: c, out } = audio();
  const t = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  const f = 900 + Math.random() * 500;
  o.type = "sine";
  o.frequency.setValueAtTime(f, t);
  o.frequency.exponentialRampToValueAtTime(f * 2.2, t + 0.07);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.25 * strength, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + 0.22);
  const n = c.createBufferSource();
  n.buffer = noiseBuffer(c, 0.35);
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1400;
  const ng = c.createGain();
  ng.gain.setValueAtTime(0.05 * strength, t);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
  n.connect(lp).connect(ng).connect(out);
  n.start(t);
}

/** Cloth brushing: filtered noise swell. */
export function rustle(strength = 0.5) {
  if (!enabled) return;
  const { ctx: c, out } = audio();
  const t = c.currentTime;
  const n = c.createBufferSource();
  n.buffer = noiseBuffer(c, 0.5);
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 2600;
  bp.Q.value = 0.6;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.07 * strength, t + 0.12);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.48);
  n.connect(bp).connect(g).connect(out);
  n.start(t);
}

/** A small mechanical click (lamp switch, key press). */
export function click() {
  if (!enabled) return;
  const { ctx: c, out } = audio();
  const t = c.currentTime;
  const n = c.createBufferSource();
  n.buffer = noiseBuffer(c, 0.02);
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 3000;
  const g = c.createGain();
  g.gain.setValueAtTime(0.35, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);
  n.connect(hp).connect(g).connect(out);
  n.start(t);
}

/**
 * A small engine note: two detuned oscillators through a lowpass, pitched
 * by road speed and opened up by the throttle. Silent while sound is off.
 */
export function createEngine() {
  let n: { o1: OscillatorNode; o2: OscillatorNode; f: BiquadFilterNode; g: GainNode } | null = null;
  const stop = () => {
    if (!n) return;
    const { o1, o2, g } = n;
    const t = g.context.currentTime;
    g.gain.setTargetAtTime(0, t, 0.05);
    o1.stop(t + 0.3);
    o2.stop(t + 0.3);
    n = null;
  };
  return {
    update(speed: number, throttle: number) {
      if (!enabled) return stop();
      const { ctx: c, out } = audio();
      if (!n) {
        const o1 = c.createOscillator();
        const o2 = c.createOscillator();
        o1.type = "sawtooth";
        o2.type = "square";
        const f = c.createBiquadFilter();
        f.type = "lowpass";
        const g = c.createGain();
        g.gain.value = 0;
        o1.connect(f);
        o2.connect(f);
        f.connect(g);
        g.connect(out);
        o1.start();
        o2.start();
        n = { o1, o2, f, g };
      }
      const t = c.currentTime;
      // a rev that rises with speed and drops at each upshift
      const gear = Math.min(5, Math.floor(Math.abs(speed) / 9));
      const rev = 38 + (Math.abs(speed) - gear * 9) * 7 + gear * 6;
      n.o1.frequency.setTargetAtTime(rev, t, 0.05);
      n.o2.frequency.setTargetAtTime(rev * 0.501, t, 0.05);
      n.f.frequency.setTargetAtTime(400 + throttle * 1400, t, 0.08);
      n.g.gain.setTargetAtTime(0.035 + throttle * 0.05, t, 0.08);
    },
    stop,
  };
}
