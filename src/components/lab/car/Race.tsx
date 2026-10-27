"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Car, { type Drive } from "./Car";
import { createEngine } from "@/components/desk/sound";

/** Keys held right now, shared by the keyboard and the on-screen pedals. */
export interface Controls {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

// an oval: centre line radii, track width
const A = 30;
const B = 17;
const HALF = 5;

function ellipseShape(a: number, b: number) {
  const s = new THREE.Shape();
  s.absellipse(0, 0, a, b, 0, Math.PI * 2, false, 0);
  return s;
}

function Track() {
  const geo = useMemo(() => {
    const outer = ellipseShape(A + HALF, B + HALF);
    outer.holes.push(new THREE.Path(ellipseShape(A - HALF, B - HALF).getPoints(128)));
    const g = new THREE.ShapeGeometry(outer, 128);
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);
  // red and white kerbs on both edges
  const kerbs = useMemo(() => {
    const out: { p: [number, number, number]; r: number; red: boolean }[] = [];
    [A - HALF, A + HALF].forEach((ra, k) => {
      const rb = k ? B + HALF : B - HALF;
      const n = 110;
      for (let i = 0; i < n; i++) {
        const t = (i / n) * Math.PI * 2;
        const x = Math.cos(t) * ra;
        const z = Math.sin(t) * rb;
        const dx = -Math.sin(t) * ra;
        const dz = Math.cos(t) * rb;
        out.push({ p: [x, 0.02, z], r: -Math.atan2(dz, dx), red: i % 2 === 0 });
      }
    });
    return out;
  }, []);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[220, 160]} />
        <meshStandardMaterial color="#8a4b2f" roughness={1} />
      </mesh>
      <mesh geometry={geo} position={[0, 0.01, 0]} receiveShadow>
        <meshStandardMaterial color="#2c2d30" roughness={0.9} />
      </mesh>
      {kerbs.map((k, i) => (
        <mesh key={i} position={k.p} rotation={[0, k.r, 0]}>
          <boxGeometry args={[1.25, 0.04, 0.5]} />
          <meshStandardMaterial color={k.red ? "#c62828" : "#f2f2f2"} roughness={0.8} />
        </mesh>
      ))}
      {/* start line */}
      <mesh position={[A, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[HALF * 2, 1.2]} />
        <meshStandardMaterial color="#f2f2f2" />
      </mesh>
      {/* a few palms and cones for speed cues */}
      {Array.from({ length: 14 }, (_, i) => {
        const t = (i / 14) * Math.PI * 2 + 0.2;
        return (
          <group key={i} position={[Math.cos(t) * (A + HALF + 6), 0, Math.sin(t) * (B + HALF + 6)]}>
            <mesh position={[0, 2.2, 0]}>
              <cylinderGeometry args={[0.18, 0.28, 4.4, 8]} />
              <meshStandardMaterial color="#6b4f35" />
            </mesh>
            <mesh position={[0, 4.6, 0]}>
              <coneGeometry args={[1.6, 1.4, 7]} />
              <meshStandardMaterial color="#2f5d34" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/** Speed and lap readouts, written straight to the DOM each frame. */
export class Hud {
  speed: HTMLElement | null = null;
  time: HTMLElement | null = null;
  bindSpeed = (el: HTMLElement | null) => {
    this.speed = el;
  };
  bindTime = (el: HTMLElement | null) => {
    this.time = el;
  };
  write(kmh: number, lap: string) {
    if (this.speed) this.speed.textContent = String(kmh);
    if (this.time) this.time.textContent = lap;
  }
}

export default function Race({
  controls,
  paint,
  hud,
  onLap,
}: {
  controls: MutableRefObject<Controls>;
  paint: string;
  hud: Hud;
  onLap: (ms: number) => void;
}) {
  const car = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const drive = useRef<Drive>({ speed: 0, steer: 0, brake: 0 });
  const st = useRef({ x: A, z: -3, h: -Math.PI / 2, progress: 0, lastTheta: 0, lapStart: 0, started: false });
  const engine = useMemo(() => createEngine(), []);
  const lapCb = useRef(onLap);
  useEffect(() => {
    lapCb.current = onLap;
  });
  useEffect(() => () => engine.stop(), [engine]);

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 1 / 20);
    const s = st.current;
    const c = controls.current;
    const d = drive.current;
    const throttle = c.up ? 1 : 0;
    const brake = c.down ? 1 : 0;
    const steer = (c.left ? 1 : 0) - (c.right ? 1 : 0);

    // where the car is relative to the track
    const r = Math.hypot(s.x / A, s.z / B);
    const width = HALF / Math.min(A, B);
    const onTrack = Math.abs(r - 1) < width * 0.95;

    let v = d.speed;
    v += throttle * (v < 0 ? 14 : 9.5 - v * 0.16) * dt;
    if (brake) v += v > 0.3 ? -16 * dt : -5 * dt; // brake, then reverse
    v -= v * (onTrack ? 0.12 : 1.1) * dt;
    if (!throttle && !brake) v -= Math.sign(v) * Math.min(Math.abs(v), 0.8 * dt);
    v = Math.max(-6, Math.min(onTrack ? 40 : 14, v));
    d.speed = v;
    d.steer += (steer - d.steer) * Math.min(1, dt * 8);
    d.brake = brake && v > 0.3 ? 1 : 0;

    s.h += d.steer * (v / (2.6 + Math.abs(v) * 0.11)) * dt * 0.9;
    s.x += Math.cos(s.h) * v * dt;
    s.z -= Math.sin(s.h) * v * dt;
    // a soft wall well outside the track
    const far = Math.hypot(s.x / (A + HALF + 4), s.z / (B + HALF + 4));
    if (far > 1) {
      s.x /= far;
      s.z /= far;
      d.speed *= 0.4;
    }

    // laps: count progress around the oval, start the clock on the first move
    const theta = Math.atan2(s.z / B, s.x / A);
    let dth = theta - s.lastTheta;
    if (dth > Math.PI) dth -= Math.PI * 2;
    if (dth < -Math.PI) dth += Math.PI * 2;
    s.lastTheta = theta;
    if (!s.started && Math.abs(v) > 0.5) {
      s.started = true;
      s.lapStart = state.clock.elapsedTime;
      s.progress = 0;
    }
    if (s.started) {
      s.progress += dth;
      if (s.progress >= Math.PI * 2) {
        lapCb.current((state.clock.elapsedTime - s.lapStart) * 1000);
        s.lapStart = state.clock.elapsedTime;
        s.progress -= Math.PI * 2;
      }
    }

    const g = car.current;
    if (g) {
      g.position.set(s.x, 0, s.z);
      g.rotation.y = s.h;
    }
    // chase camera
    const fx = Math.cos(s.h);
    const fz = -Math.sin(s.h);
    camera.position.lerp(new THREE.Vector3(s.x - fx * 8, 3.4, s.z - fz * 8), Math.min(1, dt * 3));
    camera.lookAt(s.x + fx * 4, 0.8, s.z + fz * 4);

    hud.write(Math.round(Math.abs(v) * 3.6), s.started ? (state.clock.elapsedTime - s.lapStart).toFixed(1) : "0.0");
    engine.update(v, throttle);
  });

  return (
    <>
      <Track />
      <group ref={car}>
        <Car paint={paint} drive={drive} />
      </group>
    </>
  );
}
