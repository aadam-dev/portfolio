"use client";

import { useEffect, useMemo, useState } from "react";
import { Environment, SoftShadows } from "@react-three/drei";
import { Bloom, DepthOfField, EffectComposer, N8AO, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import type { Tier } from "./tier";

export type Phase = "morning" | "noon" | "golden" | "dusk" | "night";

/** Accra is on GMT all year, so the light follows UTC hours. */
export function accraPhase(date = new Date()): Exclude<Phase, "night"> {
  const h = date.getUTCHours() + date.getUTCMinutes() / 60;
  if (h >= 5.5 && h < 10) return "morning";
  if (h >= 10 && h < 15.5) return "noon";
  if (h >= 15.5 && h < 18.3) return "golden";
  if (h >= 18.3 && h < 19.5) return "dusk";
  // the visitor picked the light theme after dark: show the desk by day
  return "noon";
}

/** Read the phase after mount (the server can't know the time the page is seen). */
export function useAccraPhase() {
  const [p, setP] = useState<Exclude<Phase, "night">>("noon");
  useEffect(() => {
    const tick = () => setP(accraPhase());
    tick();
    const id = window.setInterval(tick, 5 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);
  return p;
}

/** Sun through the window: elevation (deg), heading toward the window, colour, strength. */
const SUN: Record<Exclude<Phase, "night">, { el: number; az: number; color: string; power: number; fill: number }> = {
  morning: { el: 26, az: 50, color: "#ffd9ac", power: 3.2, fill: 0.32 },
  noon: { el: 40, az: 38, color: "#fff1de", power: 3.4, fill: 0.38 },
  golden: { el: 16, az: 30, color: "#ffb26b", power: 3.4, fill: 0.26 },
  dusk: { el: 8, az: 26, color: "#ff9a6a", power: 1.4, fill: 0.18 },
};

export const SKY: Record<Phase, [string, string, string]> = {
  morning: ["#a9cbe8", "#f4e6cc", "#f8dfb5"],
  noon: ["#8dbde6", "#dcebf4", "#f3e7cf"],
  golden: ["#e9b27f", "#f6c98e", "#ffd49a"],
  dusk: ["#3c4a78", "#c87a6a", "#f0a070"],
  night: ["#0a1024", "#1a2442", "#24304f"],
};

export function Lights({ phase, tier, top }: { phase: Phase; tier: Tier; top: number }) {
  const night = phase === "night";
  const s = night ? null : SUN[phase];
  const target = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(0.1, top, -0.05);
    return o;
  }, [top]);
  // a light from outside, aimed so it comes in through the window (x 0.62, y 1.46, z -0.46)
  const sunPos = useMemo(() => {
    if (!s) return new THREE.Vector3();
    const el = THREE.MathUtils.degToRad(s.el);
    const az = THREE.MathUtils.degToRad(s.az);
    return new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)).multiplyScalar(3.2).add(target.position);
  }, [s, target]);

  useEffect(() => {
    RectAreaLightUniformsLib.init();
  }, []);

  return (
    <>
      {tier === "high" && <SoftShadows size={22} samples={12} focus={0.6} />}
      <Environment files={night ? "/desk/hdri/night.exr" : "/desk/hdri/apartment.exr"} environmentIntensity={night ? 0.12 : (s?.fill ?? 0.6)} />
      <primitive object={target} />
      {s && (
        <directionalLight
          position={sunPos}
          target={target}
          intensity={s.power}
          color={s.color}
          castShadow
          shadow-mapSize={tier === "high" ? [2048, 2048] : [1024, 1024]}
          shadow-camera-left={-1.6}
          shadow-camera-right={1.6}
          shadow-camera-top={1.6}
          shadow-camera-bottom={-1.6}
          shadow-camera-near={0.5}
          shadow-camera-far={7}
          shadow-bias={-0.0003}
          shadow-normalBias={0.02}
        />
      )}
      {/* soft daylight bouncing off the room behind the camera */}
      {!night && <hemisphereLight intensity={0.12} color="#fff2dc" groundColor="#6a5340" />}
      {night && (
        <>
          <ambientLight intensity={0.04} color="#8ea2ff" />
          {/* the screens light the desk at night */}
          <rectAreaLight position={[0.02, top + 0.16, -0.12]} rotation={[0, 0, 0]} width={0.8} height={0.2} intensity={2.4} color="#cfe0ff" />
        </>
      )}
    </>
  );
}

/** AO, bloom on emissive parts, a shallow focus on the laptop, vignette and grain. High tier only. */
export function Post({ focus, sharp }: { focus: [number, number, number]; sharp: boolean }) {
  return (
    <EffectComposer multisampling={4} enableNormalPass={false}>
      <N8AO aoRadius={0.14} distanceFalloff={0.5} intensity={2.4} quality="medium" halfRes />
      <DepthOfField target={focus} focalLength={sharp ? 0.0001 : 0.022} bokehScale={sharp ? 0 : 1.5} height={540} />
      <Bloom mipmapBlur luminanceThreshold={1.1} luminanceSmoothing={0.1} intensity={0.35} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Vignette offset={0.32} darkness={0.5} />
      <Noise opacity={0.028} premultiply />
    </EffectComposer>
  );
}
