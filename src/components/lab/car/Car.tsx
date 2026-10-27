"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SystemId } from "./systems";

/**
 * A car built from separate parts so it can come apart. Units are metres,
 * x points forward, y up. Rear-wheel drive so the whole drivetrain is visible.
 */
const WB = 1.35; // half wheelbase
const TZ = 0.8; // wheel centre, half track
const WR = 0.34; // wheel radius
const SYSTEM_IDS: SystemId[] = ["body", "chassis", "powertrain", "brakes", "suspension", "fuel", "wheels", "cabin"];

export interface Drive {
  speed: number; // m/s, signed
  steer: number; // -1..1
  brake: number; // 0..1
}

interface Ctx {
  e: MutableRefObject<number>;
}
const CarCtx = createContext<Ctx | null>(null);

/** A part that slides out along its own direction as the car explodes. */
function Part({ ex, position = [0, 0, 0], rotation, children }: { ex: [number, number, number]; position?: [number, number, number]; rotation?: [number, number, number]; children: ReactNode }) {
  const g = useRef<THREE.Group>(null);
  const ctx = useContext(CarCtx)!;
  useFrame(() => {
    const t = ctx.e.current;
    g.current?.position.set(position[0] + ex[0] * t, position[1] + ex[1] * t, position[2] + ex[2] * t);
  });
  return (
    <group ref={g} position={position} rotation={rotation}>
      {children}
    </group>
  );
}

function materialSet(paint: string) {
  return {
    paint: new THREE.MeshPhysicalMaterial({ color: paint, metalness: 0.55, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.08 }),
    glass: new THREE.MeshPhysicalMaterial({ color: "#1a2630", metalness: 0.3, roughness: 0.05, transparent: true, opacity: 0.62 }),
    chrome: new THREE.MeshStandardMaterial({ color: "#d9dde2", metalness: 1, roughness: 0.18 }),
    alu: new THREE.MeshStandardMaterial({ color: "#a9adb3", metalness: 0.85, roughness: 0.38 }),
    steel: new THREE.MeshStandardMaterial({ color: "#4b4f55", metalness: 0.7, roughness: 0.5 }),
    rubber: new THREE.MeshStandardMaterial({ color: "#151515", roughness: 0.92 }),
    dark: new THREE.MeshStandardMaterial({ color: "#222427", roughness: 0.7 }),
    seat: new THREE.MeshStandardMaterial({ color: "#3a332c", roughness: 0.85 }),
    head: new THREE.MeshStandardMaterial({ color: "#f4f1ea", emissive: "#fff6e0", emissiveIntensity: 0.8 }),
    tail: new THREE.MeshStandardMaterial({ color: "#7a1010", emissive: "#ff2a1a", emissiveIntensity: 0.7 }),
    hot: new THREE.MeshStandardMaterial({ color: "#b5121b", metalness: 0.4, roughness: 0.45, emissive: "#ff3d00", emissiveIntensity: 0 }),
    spring: new THREE.MeshStandardMaterial({ color: "#d7a019", metalness: 0.6, roughness: 0.35 }),
    gas: new THREE.MeshBasicMaterial({ color: "#9fb4c8", transparent: true, opacity: 0.8 }),
    fuel: new THREE.MeshBasicMaterial({ color: "#f5b301", transparent: true, opacity: 0.9 }),
  };
}
type Mats = ReturnType<typeof materialSet>;

/** A coil spring: seven turns, 26 cm tall. */
class Helix extends THREE.Curve<THREE.Vector3> {
  constructor() {
    super();
  }
  getPoint(t: number, target = new THREE.Vector3()) {
    return target.set(Math.cos(t * Math.PI * 14) * 0.055, t * 0.26, Math.sin(t * Math.PI * 14) * 0.055);
  }
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Pull the sides in towards the top (tumblehome) and towards each end (plan taper). */
function shape(g: THREE.BufferGeometry, top: [number, number, number], ends: number) {
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const k = (1 - top[2] * smooth(top[0], top[1], y)) * (1 - ends * smooth(1.3, 2.4, Math.abs(x)));
    p.setZ(i, p.getZ(i) * k);
  }
  g.computeVertexNormals();
  return g;
}

function geometries() {
  // side profile of the lower body, wheel arches cut in, extruded across the width
  const body = new THREE.Shape();
  body.moveTo(-2.2, 0.3);
  body.lineTo(-WB - 0.44, 0.3);
  body.absarc(-WB, WR - 0.01, 0.43, Math.PI, 0, true);
  body.lineTo(WB - 0.43, 0.3);
  body.absarc(WB, WR - 0.01, 0.43, Math.PI, 0, true);
  body.lineTo(2.18, 0.3);
  body.quadraticCurveTo(2.3, 0.5, 2.26, 0.62);
  body.quadraticCurveTo(2.2, 0.76, 1.98, 0.81);
  body.lineTo(0.95, 0.93);
  body.lineTo(-1.95, 0.97);
  body.quadraticCurveTo(-2.2, 0.95, -2.3, 0.8);
  body.quadraticCurveTo(-2.36, 0.62, -2.3, 0.42);
  body.closePath();
  const W = 1.74;
  const bodyGeo = new THREE.ExtrudeGeometry(body, { depth: W, bevelEnabled: true, bevelThickness: 0.09, bevelSize: 0.06, bevelSegments: 6, curveSegments: 28, steps: 6 });
  bodyGeo.translate(0, 0, -W / 2);
  shape(bodyGeo, [0.7, 1.0, 0.06], 0.17);

  const cabin = new THREE.Shape();
  cabin.moveTo(0.92, 0.93);
  cabin.lineTo(0.16, 1.37);
  cabin.quadraticCurveTo(-0.45, 1.43, -1.12, 1.4);
  cabin.lineTo(-1.88, 0.99);
  cabin.lineTo(-1.95, 0.96);
  cabin.closePath();
  const CW = 1.5;
  const cabinGeo = new THREE.ExtrudeGeometry(cabin, { depth: CW, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.04, bevelSegments: 5, steps: 6 });
  cabinGeo.translate(0, 0, -CW / 2);
  shape(cabinGeo, [0.95, 1.42, 0.16], 0);

  // tyre: a lathe profile with rounded shoulders
  const prof: THREE.Vector2[] = [];
  for (let i = 0; i <= 16; i++) {
    const a = (i / 16) * Math.PI;
    prof.push(new THREE.Vector2(WR - 0.1 + Math.sin(a) * 0.1, -Math.cos(a) * 0.11));
  }
  const tyre = new THREE.LatheGeometry(prof, 48);
  tyre.rotateX(Math.PI / 2);

  const spring = new THREE.TubeGeometry(new Helix(), 160, 0.009, 6, false);

  const exhaustPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.45, 0.5, 0.26),
    new THREE.Vector3(1.2, 0.28, 0.3),
    new THREE.Vector3(0.4, 0.22, 0.32),
    new THREE.Vector3(-0.6, 0.22, 0.36),
    new THREE.Vector3(-1.75, 0.26, 0.42),
    new THREE.Vector3(-2.32, 0.3, 0.44),
  ]);
  const exhaust = new THREE.TubeGeometry(exhaustPath, 80, 0.032, 10, false);
  const fuelPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.85, 0.36, -0.3),
    new THREE.Vector3(0.2, 0.26, -0.36),
    new THREE.Vector3(1.2, 0.36, -0.32),
    new THREE.Vector3(1.55, 0.78, -0.2),
  ]);
  const fuelLine = new THREE.TubeGeometry(fuelPath, 60, 0.012, 6, false);
  return { bodyGeo, cabinGeo, tyre, spring, exhaust, exhaustPath, fuelLine, fuelPath };
}

function Wheel({ g, x, side, m, spin, steerRef, springRef, caliperRef, hubRef }: {
  g: ReturnType<typeof geometries>;
  x: number;
  side: 1 | -1;
  m: Record<SystemId, Mats>;
  spin: (g: THREE.Group | null) => void;
  steerRef?: (g: THREE.Group | null) => void;
  springRef: (g: THREE.Group | null) => void;
  caliperRef: (g: THREE.Mesh | null) => void;
  hubRef: (g: THREE.Group | null) => void;
}) {
  const inner = -side; // towards the car's centre line
  return (
    <group ref={hubRef} position={[x, WR, side * TZ]}>
      <group ref={steerRef}>
        <group ref={spin}>
          <Part ex={[0, 0, side * 0.75]}>
            <mesh geometry={g.tyre} material={m.wheels.rubber} castShadow />
            {/* rim: a ring and five spokes, open so the disc shows through */}
            <mesh material={m.wheels.chrome} position={[0, 0, side * 0.04]}>
              <torusGeometry args={[0.215, 0.022, 10, 40]} />
            </mesh>
            {[0, 1, 2, 3, 4].map((i) => (
              <mesh key={i} material={m.wheels.chrome} position={[0, 0, side * 0.05]} rotation={[0, 0, (i / 5) * Math.PI * 2]}>
                <boxGeometry args={[0.04, 0.42, 0.025]} />
              </mesh>
            ))}
            <mesh material={m.wheels.alu} position={[0, 0, side * 0.06]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.055, 0.055, 0.04, 20]} />
            </mesh>
          </Part>
          <Part ex={[0, 0, side * 0.45]}>
            <mesh material={m.brakes.steel} position={[0, 0, inner * 0.02]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.19, 0.19, 0.026, 40]} />
            </mesh>
          </Part>
        </group>
        <Part ex={[0, 0, side * 0.5]}>
          <mesh ref={caliperRef} material={m.brakes.hot} position={[-0.13, 0.12, inner * 0.02]} rotation={[0, 0, 0.8]}>
            <boxGeometry args={[0.07, 0.15, 0.08]} />
          </mesh>
        </Part>
      </group>
      <Part ex={[0, 0.25, side * 0.3]}>
        {/* damper and coil spring above the hub, with the lower arm to the frame */}
        <group position={[0, 0.05, inner * 0.2]} ref={springRef}>
          <mesh material={m.suspension.steel} position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.34, 12]} />
          </mesh>
          <mesh geometry={g.spring} material={m.suspension.spring} position={[0, 0.02, 0]} />
        </group>
        <mesh material={m.suspension.steel} position={[0, -0.06, inner * 0.17]}>
          <boxGeometry args={[0.07, 0.035, 0.32]} />
        </mesh>
      </Part>
    </group>
  );
}

/** The moving parts the animation needs, collected by ref callbacks. */
class Rig {
  spins: (THREE.Group | null)[] = [];
  steers: (THREE.Group | null)[] = [];
  springs: (THREE.Group | null)[] = [];
  hubs: (THREE.Group | null)[] = [];
  pistons: (THREE.Mesh | null)[] = [];
  shafts: (THREE.Mesh | null)[] = [];
  puffs: (THREE.Mesh | null)[] = [];
  drops: (THREE.Mesh | null)[] = [];
  calipers: (THREE.Mesh | null)[] = [];
  reg<K extends "spins" | "steers" | "springs" | "hubs">(key: K, i: number) {
    return (el: THREE.Group | null) => {
      this[key][i] = el;
    };
  }
  regMesh<K extends "pistons" | "shafts" | "puffs" | "drops" | "calipers">(key: K, i: number) {
    return (el: THREE.Mesh | null) => {
      this[key][i] = el;
    };
  }
}

export default function Car({
  paint,
  explode = 0,
  focus = null,
  step = 0,
  drive,
}: {
  paint: string;
  explode?: number;
  focus?: SystemId | null;
  step?: number;
  drive?: MutableRefObject<Drive>;
}) {
  const g = useMemo(() => geometries(), []);
  // one material set per system, so a whole system can fade at once; paint is updated in place below
  const [m] = useState(() => Object.fromEntries(SYSTEM_IDS.map((s) => [s, materialSet(paint)])) as Record<SystemId, Mats>);
  const e = useRef(0);
  const ctx = useMemo(() => ({ e }), []);
  const fade = useRef(Object.fromEntries(SYSTEM_IDS.map((s) => [s, 1])) as Record<SystemId, number>);

  const rig = useMemo(() => new Rig(), []);
  const clock = useRef({ t: 0, wheel: 0, wheelSpeed: 0 });

  // repaint every system's paint material
  useEffect(() => {
    SYSTEM_IDS.forEach((s) => m[s].paint.color.set(paint));
  }, [paint, m]);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 1 / 20);
    const c = clock.current;
    c.t += dt;
    e.current += (explode - e.current) * Math.min(1, dt * 5);

    // fade every system that is not in focus
    SYSTEM_IDS.forEach((s) => {
      const target = focus && focus !== s ? 0.08 : 1;
      const f = (fade.current[s] += (target - fade.current[s]) * Math.min(1, dt * 6));
      Object.values(m[s]).forEach((mat) => {
        const base = mat === m[s].glass ? 0.62 : mat === m[s].gas || mat === m[s].fuel ? mat.opacity : 1;
        const clear = f < 0.99 || mat === m[s].glass || mat === m[s].gas || mat === m[s].fuel;
        // three compiles opaque materials with alpha pinned to 1, so a switch needs a recompile
        if (mat.transparent !== clear) {
          mat.transparent = clear;
          mat.needsUpdate = true;
        }
        mat.opacity = mat === m[s].gas || mat === m[s].fuel ? (focus === s ? 0.85 : 0) : base * f;
        mat.depthWrite = f > 0.5;
      });
    });

    // wheel speed: from the driver in a race, from the lesson in the showroom
    let target = 0;
    if (drive) target = drive.current.speed;
    else if (focus === "powertrain" || focus === "wheels") target = 6;
    else if (focus === "brakes") target = step < 2 ? 7 : step === 2 ? 2 : 0;
    c.wheelSpeed += (target - c.wheelSpeed) * Math.min(1, dt * (focus === "brakes" && step >= 2 ? 1.6 : 2.5));
    c.wheel += (c.wheelSpeed / WR) * dt;
    rig.spins.forEach((s) => s && (s.rotation.z = -c.wheel));
    rig.shafts.forEach((s, i) => s && (i === 0 ? (s.rotation.x = c.wheel * 3.2) : (s.rotation.y = c.wheel)));

    // pistons: four cylinders, firing order 1-3-4-2
    const crank = focus === "powertrain" ? c.t * 7 : drive ? c.wheel * 3.2 : 0;
    const phase = [0, Math.PI, Math.PI, 0];
    rig.pistons.forEach((p, i) => p && (p.position.y = 0.86 + Math.sin(crank + phase[i]) * 0.05));

    // brakes glow as the pads clamp
    const clamp = drive ? drive.current.brake : focus === "brakes" ? (step >= 2 ? 1 : 0) : 0;
    SYSTEM_IDS.forEach((s) => {
      const h = m[s].hot;
      h.emissiveIntensity += ((focus === "brakes" ? (step >= 3 ? 1.6 : clamp * 0.6) : clamp * 0.8) - h.emissiveIntensity) * Math.min(1, dt * 3);
    });

    // suspension: bump and rebound, front wheels steer
    const bob = focus === "suspension" && step < 2 ? Math.sin(c.t * 4) * (step === 0 ? 0.045 : 0.045 * Math.exp(-((c.t * 2) % 3))) : 0;
    rig.hubs.forEach((h, i) => h && (h.position.y = WR + bob * (i % 2 ? 1 : -1)));
    rig.springs.forEach((s, i) => s && (s.scale.y = 1 - bob * (i % 2 ? 1 : -1) * 2.5));
    const steer = drive ? drive.current.steer * 0.45 : focus === "suspension" && step === 2 ? Math.sin(c.t * 1.4) * 0.4 : 0;
    // the inside wheel turns more (Ackermann)
    rig.steers.forEach((s, i) => s && (s.rotation.y = steer * (1 + (i === 0 ? 1 : -1) * Math.sign(steer) * 0.12)));

    // gas and fuel flowing along their lines
    rig.puffs.forEach((p, i) => {
      if (!p) return;
      const u = (c.t * 0.35 + i / rig.puffs.length) % 1;
      p.position.copy(g.exhaustPath.getPointAt(u));
      p.scale.setScalar(0.6 + u * 0.8);
    });
    rig.drops.forEach((p, i) => {
      if (!p) return;
      const u = (c.t * 0.3 + i / rig.drops.length) % 1;
      p.position.copy(g.fuelPath.getPointAt(u));
    });
  });

  return (
    <CarCtx.Provider value={ctx}>
      <group>
        {/* chassis: a ladder frame */}
        <Part ex={[0, 0, 0]}>
          {[-0.46, 0.46].map((z) => (
            <mesh key={z} material={m.chassis.steel} position={[0, 0.36, z]} castShadow>
              <boxGeometry args={[4.0, 0.1, 0.07]} />
            </mesh>
          ))}
          {[-1.7, -WB + 0.3, 0, WB - 0.3, 1.85].map((x) => (
            <mesh key={x} material={m.chassis.steel} position={[x, 0.36, 0]}>
              <boxGeometry args={[0.07, 0.08, 0.92]} />
            </mesh>
          ))}
        </Part>

        {/* body */}
        <Part ex={[0, 1.0, 0]}>
          <mesh geometry={g.bodyGeo} material={m.body.paint} castShadow receiveShadow />
          <mesh material={m.body.dark} position={[2.27, 0.5, 0]}>
            <boxGeometry args={[0.04, 0.14, 0.86]} />
          </mesh>
          {/* bumpers and sills in black trim break up the slab sides */}
          <mesh material={m.body.dark} position={[2.2, 0.36, 0]}>
            <boxGeometry args={[0.14, 0.1, 1.52]} />
          </mesh>
          <mesh material={m.body.dark} position={[-2.33, 0.42, 0]}>
            <boxGeometry args={[0.12, 0.1, 1.44]} />
          </mesh>
          {[-1, 1].map((sd) => (
            <mesh key={sd} material={m.body.dark} position={[0, 0.33, sd * 0.86]}>
              <boxGeometry args={[1.82, 0.07, 0.05]} />
            </mesh>
          ))}
          {[-1, 1].map((s) => (
            <group key={s}>
              <mesh material={m.body.head} position={[2.22, 0.66, s * 0.62]}>
                <boxGeometry args={[0.08, 0.08, 0.32]} />
              </mesh>
              <mesh material={m.body.tail} position={[-2.37, 0.72, s * 0.56]} rotation={[0, 0, 0.35]}>
                <boxGeometry args={[0.03, 0.07, 0.34]} />
              </mesh>
              <mesh material={m.body.dark} position={[0.78, 1.0, s * 0.86]}>
                <boxGeometry args={[0.12, 0.07, 0.12]} />
              </mesh>
            </group>
          ))}
        </Part>
        <Part ex={[0, 1.55, 0]}>
          <mesh geometry={g.cabinGeo} material={m.body.glass} />
        </Part>
        <Part ex={[0, 1.8, 0]}>
          <mesh material={m.body.paint} position={[-0.47, 1.435, 0]} castShadow>
            <boxGeometry args={[1.18, 0.025, 1.22]} />
          </mesh>
        </Part>
        <Part ex={[0.35, 1.3, 0]}>
          {/* bonnet */}
          <mesh material={m.body.paint} position={[1.45, 0.925, 0]} rotation={[0, 0, -0.115]} castShadow>
            <boxGeometry args={[1.0, 0.018, 1.46]} />
          </mesh>
        </Part>
        {[-1, 1].map((s) =>
          [0.44, -0.5].map((x) => (
            <Part key={`${s}${x}`} ex={[0, 0.1, s * 0.95]}>
              {/* doors */}
              <group position={[x, 0.64, s * 0.905]} rotation={[s * 0.1, 0, 0]}>
                <mesh material={m.body.paint} castShadow>
                  <boxGeometry args={[0.9, 0.56, 0.035]} />
                </mesh>
                <mesh material={m.body.chrome} position={[0.25, 0.14, s * 0.025]}>
                  <boxGeometry args={[0.13, 0.025, 0.02]} />
                </mesh>
              </group>
            </Part>
          )),
        )}

        {/* engine, gearbox, driveshaft, differential */}
        <Part ex={[0.35, 1.0, 0]}>
          <mesh material={m.powertrain.alu} position={[1.6, 0.62, 0]} castShadow>
            <boxGeometry args={[0.5, 0.38, 0.6]} />
          </mesh>
          <mesh material={m.powertrain.dark} position={[1.6, 0.86, 0]}>
            <boxGeometry args={[0.44, 0.09, 0.62]} />
          </mesh>
          {[-0.225, -0.075, 0.075, 0.225].map((z, i) => (
            <mesh key={z} ref={rig.regMesh("pistons", i)} material={m.powertrain.chrome} position={[1.6, 0.86, z]}>
              <cylinderGeometry args={[0.055, 0.055, 0.08, 16]} />
            </mesh>
          ))}
        </Part>
        <Part ex={[0.9, 0.3, 0]}>
          <mesh material={m.powertrain.dark} position={[2.1, 0.56, 0]}>
            <boxGeometry args={[0.05, 0.36, 0.9]} />
          </mesh>
        </Part>
        <Part ex={[0, 0.55, 0]}>
          <mesh material={m.powertrain.alu} position={[1.12, 0.52, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.17, 0.46, 20]} />
          </mesh>
        </Part>
        <Part ex={[0, -0.45, 0]}>
          <mesh ref={rig.regMesh("shafts", 0)} material={m.powertrain.steel} position={[-0.2, 0.42, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.032, 0.032, 2.2, 10]} />
          </mesh>
          <mesh material={m.powertrain.alu} position={[-WB, WR + 0.02, 0]}>
            <sphereGeometry args={[0.13, 20, 14]} />
          </mesh>
          <group position={[-WB, WR, 0]}>
            <mesh ref={rig.regMesh("shafts", 1)} material={m.powertrain.steel} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.028, 0.028, TZ * 2 - 0.2, 10]} />
            </mesh>
          </group>
        </Part>

        {/* fuel and exhaust */}
        <Part ex={[0, -0.85, 0]}>
          <mesh geometry={g.exhaust} material={m.fuel.steel} />
          <mesh material={m.fuel.alu} position={[0.45, 0.22, 0.32]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.07, 0.07, 0.32, 16]} />
          </mesh>
          <mesh material={m.fuel.steel} position={[-1.75, 0.27, 0.42]}>
            <boxGeometry args={[0.46, 0.13, 0.22]} />
          </mesh>
          <mesh material={m.fuel.dark} position={[-0.88, 0.38, -0.22]} castShadow>
            <boxGeometry args={[0.5, 0.16, 0.62]} />
          </mesh>
          <mesh geometry={g.fuelLine} material={m.fuel.dark} />
          {Array.from({ length: 9 }, (_, i) => (
            <mesh key={i} ref={rig.regMesh("puffs", i)} material={m.fuel.gas}>
              <sphereGeometry args={[0.035, 10, 8]} />
            </mesh>
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <mesh key={i} ref={rig.regMesh("drops", i)} material={m.fuel.fuel}>
              <sphereGeometry args={[0.022, 8, 6]} />
            </mesh>
          ))}
        </Part>

        {/* cabin: seats, dashboard, wheel */}
        <Part ex={[0, 0.75, 0]}>
          {[-0.38, 0.38].map((z) => (
            <group key={z}>
              <mesh material={m.cabin.seat} position={[-0.05, 0.56, z]}>
                <boxGeometry args={[0.5, 0.12, 0.46]} />
              </mesh>
              <mesh material={m.cabin.seat} position={[-0.32, 0.86, z]} rotation={[0, 0, 0.18]}>
                <boxGeometry args={[0.1, 0.56, 0.46]} />
              </mesh>
            </group>
          ))}
          <mesh material={m.cabin.seat} position={[-1.0, 0.56, 0]}>
            <boxGeometry args={[0.5, 0.12, 1.3]} />
          </mesh>
          <mesh material={m.cabin.seat} position={[-1.3, 0.86, 0]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.1, 0.56, 1.3]} />
          </mesh>
          <mesh material={m.cabin.dark} position={[0.72, 0.86, 0]}>
            <boxGeometry args={[0.3, 0.2, 1.5]} />
          </mesh>
          <mesh material={m.cabin.dark} position={[0.48, 0.96, 0.38]} rotation={[0, Math.PI / 2, 0.45]}>
            <torusGeometry args={[0.16, 0.02, 8, 32]} />
          </mesh>
          <mesh material={m.cabin.steel} position={[0.75, 0.8, 0.38]} rotation={[0, 0, 1.1]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
          </mesh>
        </Part>

        {/* steering rack across the front axle */}
        <Part ex={[0, 0.2, 0]}>
          <mesh material={m.suspension.steel} position={[WB - 0.15, 0.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.2, 10]} />
          </mesh>
        </Part>

        {/* wheels: front left, front right, rear left, rear right */}
        {([
          [WB, 1],
          [WB, -1],
          [-WB, 1],
          [-WB, -1],
        ] as const).map(([x, side], i) => (
          <Wheel
            key={i}
            g={g}
            x={x}
            side={side}
            m={m}
            spin={rig.reg("spins", i)}
            steerRef={x > 0 ? rig.reg("steers", i) : undefined}
            springRef={rig.reg("springs", i)}
            caliperRef={rig.regMesh("calipers", i)}
            hubRef={rig.reg("hubs", i)}
          />
        ))}
      </group>
    </CarCtx.Provider>
  );
}
