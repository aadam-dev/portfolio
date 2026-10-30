"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Html, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import meta from "../../../public/desk/3d/desk3d.json";
import type { ScreenId } from "./plates";

/**
 * The desk, live: the Blender scene with its light baked in (albedo times a
 * day or evening lightmap, blended on the GPU), the real apps on the three
 * screens, and the things on it you can use. Drag the mouse and a cursor
 * moves on the monitor; let go without moving to click. Spin the chair,
 * bounce the ball, click the lamp for the lights.
 */
type V3 = [number, number, number];
type Meta = typeof meta & { ball?: { at: V3; radius: number } };
const M = meta as unknown as Meta;
const BASE = "/desk/3d";
const APP_W = 640;
const APP_H = 400;

export type DeskView = "desktop" | "phone";

/* ------------------------------------------------------------------ materials */

const VERT = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const FRAG = /* glsl */ `
uniform sampler2D map; uniform sampler2D lmA; uniform sampler2D lmB;
uniform float mixT; uniform float scale; uniform float exposure; uniform float glow;
varying vec2 vUv;
void main(){
  vec3 a = texture2D(map, vUv).rgb;
  vec3 l = mix(texture2D(lmA, vUv).rgb, texture2D(lmB, vUv).rgb, mixT) * scale;
  gl_FragColor = vec4(a * l * exposure + a * glow, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

/** All the baked materials of the room, blended between day and evening together. */
class Lighting {
  mats: THREE.ShaderMaterial[] = [];
  t = 0;
  target = 0;
  bulb = new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffe2b8"), toneMapped: false });
  make(map: THREE.Texture, a: THREE.Texture, b: THREE.Texture) {
    const m = new THREE.ShaderMaterial({ uniforms: { map: { value: map }, lmA: { value: a }, lmB: { value: b }, mixT: { value: this.t }, scale: { value: M.lightScale }, exposure: { value: 1 }, glow: { value: 0 } }, vertexShader: VERT, fragmentShader: FRAG });
    this.mats.push(m);
    return m;
  }
  set(night: boolean) {
    this.target = night ? 1 : 0;
  }
  /** Ease towards the target; true while still moving. */
  step(dt: number) {
    const d = this.target - this.t;
    if (Math.abs(d) < 0.002) this.t = this.target;
    else this.t += d * Math.min(1, dt * 3.2);
    for (const m of this.mats) m.uniforms.mixT.value = this.t;
    this.bulb.color.setRGB(0.35 + 0.65 * this.t, 0.33 + 0.55 * this.t, 0.3 + 0.4 * this.t).multiplyScalar(0.6 + 2.4 * this.t);
    return this.t !== this.target;
  }
  hover(m: THREE.ShaderMaterial | null, on: boolean) {
    if (m) m.uniforms.glow.value = on ? 0.06 : 0;
  }
}

function useTextures(view: DeskView) {
  const s = view === "phone" ? "-m" : "";
  const paths = useMemo(() => {
    const p: Record<string, string> = {};
    for (const g of M.groups) for (const k of ["albedo", "day", "evening"]) p[`${g}-${k}`] = `${BASE}/${g}-${k}${s}.webp`;
    p.lock = `${BASE}/lockscreen.webp`;
    return p;
  }, [s]);
  const tex = useTexture(paths, (t) => {
    for (const x of Array.isArray(t) ? t : [t]) {
      x.flipY = false;
      x.colorSpace = THREE.SRGBColorSpace;
      x.anisotropy = 4;
    }
  });
  return tex as unknown as Record<string, THREE.Texture>;
}

/** Still pictures of the three apps, for screens that aren't live (phones and tablets). */
const SHOTS = { left: `${BASE}/screen-left.webp`, center: `${BASE}/screen-center.webp`, right: `${BASE}/screen-right.webp` };

/* ------------------------------------------------------------------ geometry helpers */

const v = (p: number[]) => new THREE.Vector3(p[0], p[1], p[2]);

/** A screen's frame from its four corners (TL, TR, BR, BL): centre, axes, size. */
function frameOf(q: number[][]) {
  const [tl, tr, , bl] = q.map(v);
  const x = tr.clone().sub(tl);
  const y = tl.clone().sub(bl);
  const w = x.length();
  const h = y.length();
  x.normalize();
  y.normalize();
  const z = new THREE.Vector3().crossVectors(x, y).normalize();
  const c = q.map(v).reduce((a, b) => a.add(b), new THREE.Vector3()).multiplyScalar(0.25);
  const quat = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
  return { c, x, y, z, w, h, quat };
}
const FRAMES = { center: frameOf(M.screens.center), left: frameOf(M.screens.left), right: frameOf(M.screens.right) };

/** Where the camera sits to show a screen: whole ("fit") or filling the view ("cover"). */
function screenPose(f: (typeof FRAMES)["center"], fov: number, aspect: number, mode: "fit" | "cover") {
  const t = Math.tan(THREE.MathUtils.degToRad(fov / 2));
  const d = mode === "fit" ? Math.max(f.h / 2 / t / 0.82, f.w / 2 / (t * aspect) / 0.86) : Math.min(f.h / 2 / t, f.w / 2 / (t * aspect)) * 0.98;
  return { pos: f.c.clone().addScaledVector(f.z, d), look: f.c.clone() };
}

const HOME: Record<DeskView, { pos: V3; look: V3; hfov: number }> = {
  desktop: { pos: [0.28, 1.52, 2.42], look: [-0.38, 0.88, -0.1], hfov: 56 },
  phone: { pos: [0.02, 1.48, 1.72], look: [0.0, 0.86, -0.08], hfov: 54 },
};

/** The camera: home with a little pointer parallax, a glide to a focused screen, or the scroll dive. */
class Rig {
  pos = new THREE.Vector3();
  look = new THREE.Vector3();
  ready = false;
  step(cam: THREE.PerspectiveCamera, view: DeskView, aspect: number, pointer: THREE.Vector2, focus: ScreenId | null, dive: number, dt: number) {
    const home = HOME[view];
    cam.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(home.hfov / 2)) / aspect));
    cam.fov = Math.min(cam.fov, 74);
    let tp = v(home.pos);
    let tl = v(home.look);
    if (!focus) {
      tp.x += pointer.x * 0.06;
      tp.y += pointer.y * 0.03;
    }
    const e = Math.min(1, Math.max(0, (dive - 0.04) / 0.82));
    const ease = e * e * (3 - 2 * e);
    if (focus) {
      const p = screenPose(FRAMES[focus], cam.fov, aspect, "fit");
      tp = p.pos;
      tl = p.look;
    } else if (ease > 0) {
      const p = screenPose(FRAMES.center, cam.fov, aspect, "cover");
      tp.lerp(p.pos, ease);
      tl.lerp(p.look, ease);
    }
    if (!this.ready) {
      this.pos.copy(tp);
      this.look.copy(tl);
      this.ready = true;
    }
    const k = 1 - Math.exp(-dt * (focus ? 4.5 : ease > 0 ? 14 : 3.5));
    this.pos.lerp(tp, k);
    this.look.lerp(tl, k);
    cam.position.copy(this.pos);
    cam.lookAt(this.look);
    cam.updateProjectionMatrix();
  }
}

/** The chair and the ball move; this holds their motion between frames. */
class Toys {
  chair = 0;
  chairV = 0;
  chairDrag = false;
  ballY = 0;
  ballV = 0;
  ballSpin = 0;
  step(dt: number) {
    if (!this.chairDrag) {
      this.chair += this.chairV * dt;
      this.chairV *= Math.exp(-dt * 1.4);
      if (Math.abs(this.chairV) < 0.01) this.chairV = 0;
    }
    if (this.ballV !== 0 || this.ballY > 0) {
      this.ballV -= 9.8 * dt;
      this.ballY += this.ballV * dt;
      this.ballSpin += dt * 3;
      if (this.ballY <= 0) {
        this.ballY = 0;
        this.ballV = Math.abs(this.ballV) > 0.6 ? -this.ballV * 0.62 : 0;
      }
    }
    return this.chairV !== 0 || this.chairDrag || this.ballV !== 0 || this.ballY > 0;
  }
  grab() {
    this.chairDrag = true;
  }
  turn(dx: number) {
    this.chair += dx * 0.012;
    this.chairV = dx * 0.7;
  }
  release(tap: boolean) {
    this.chairDrag = false;
    if (tap) this.chairV += 5;
  }
  bounce() {
    this.ballV = 2.6;
  }
}

/** AgX tone mapping, set once on the renderer. */
function tone(gl: THREE.WebGLRenderer) {
  gl.toneMapping = THREE.AgXToneMapping;
  gl.toneMappingExposure = 1.05;
}

/* ------------------------------------------------------------------ the scene */

function Label({ at, children }: { at: V3 | THREE.Vector3; children: ReactNode }) {
  return (
    <Html position={at as V3} center zIndexRange={[20, 10]} style={{ pointerEvents: "none" }}>
      <span className="theme-fixed whitespace-nowrap rounded-full bg-black/80 px-2.5 py-1 text-[11.5px] text-white shadow-lg">{children}</span>
    </Html>
  );
}

function Steam({ at }: { at: V3 }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d")!;
    const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, "rgba(255,255,255,0.55)");
    r.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);
  const puffs = useRef<THREE.Sprite[]>([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    puffs.current.forEach((s, i) => {
      if (!s) return;
      const life = (t * 0.32 + i / 6) % 1;
      s.position.set(at[0] + Math.sin(t * 1.3 + i) * 0.012 * life, at[1] + 0.01 + life * 0.17, at[2] + Math.cos(t + i) * 0.008 * life);
      s.scale.setScalar(0.03 + life * 0.07);
      (s.material as THREE.SpriteMaterial).opacity = Math.sin(life * Math.PI) * 0.35;
    });
  });
  return (
    <>
      {Array.from({ length: 6 }, (_, i) => (
        <sprite key={i} ref={(s) => void (puffs.current[i] = s!)}>
          <spriteMaterial map={tex} transparent depthWrite={false} opacity={0} toneMapped={false} />
        </sprite>
      ))}
    </>
  );
}

interface SceneProps {
  view: DeskView;
  night: boolean;
  focused: ScreenId | null;
  onFocus: (id: ScreenId) => void;
  onLamp: () => void;
  onSpot: (id: "books" | "phone" | "notebook") => void;
  screens: Record<ScreenId, { node: ReactNode; label: string }>;
  dive: { current: number };
  /** live apps on the screens (desktop); otherwise still images, and a tap opens the app full screen */
  live: boolean;
  onReady: () => void;
}

function Scene({ view, night, focused, onFocus, onLamp, onSpot, screens, dive, live, onReady }: SceneProps) {
  const gltf = useGLTF(`${BASE}/desk.glb`, false, true);
  const tex = useTextures(view);
  const { camera, size, pointer, gl } = useThree();
  const light = useMemo(() => new Lighting(), []);
  const rig = useMemo(() => new Rig(), []);
  const toys = useMemo(() => new Toys(), []);
  const mats = useMemo(() => Object.fromEntries(M.groups.map((g) => [g, light.make(tex[`${g}-albedo`], tex[`${g}-day`], tex[`${g}-evening`])])) as Record<string, THREE.ShaderMaterial>, [light, tex]);
  const lockMat = useMemo(() => new THREE.MeshBasicMaterial({ map: tex.lock, toneMapped: false }), [tex]);
  const shots = useTexture(SHOTS, (t) => {
    for (const x of Array.isArray(t) ? t : [t]) x.colorSpace = THREE.SRGBColorSpace;
  }) as unknown as Record<ScreenId, THREE.Texture>;
  const [hover, setHover] = useState<string | null>(null);
  const [books, setBooks] = useState(false);
  const chairRef = useRef<THREE.Group>(null);
  const ballRef = useRef<THREE.Group>(null);
  const mouseRef = useRef<THREE.Group>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const centerEl = useRef<HTMLDivElement>(null);
  const drag = useRef<{ kind: "mouse" | "chair"; x: number; moved: number; last: number } | null>(null);

  useEffect(() => {
    light.set(night);
  }, [light, night]);
  useEffect(() => {
    tone(gl);
    onReady();
  }, [gl, onReady]);

  // Blender suffixes a clashing name (".001", which three.js loads as "001"); match on the base name
  const nodes = useMemo(() => Object.fromEntries(Object.entries(gltf.nodes).map(([k, n]) => [k.replace(/\.?\d{3}$/, ""), n])), [gltf.nodes]) as Record<string, THREE.Mesh>;
  const pivot = (g: string) => (g === "chair" ? v(M.chair.at) : g === "mouse" ? v(M.mouse.at) : g === "ball" && M.ball ? v(M.ball.at) : null);

  // the mouse travels on the felt mat; its spot on the mat is the cursor's spot on the monitor
  const pad = M.mousepad;
  const padRect = { x0: pad.center[0] - pad.size[0] / 2 + 0.04, x1: pad.center[0] + pad.size[0] / 2 - 0.04, z0: pad.center[2] - pad.size[1] / 2 + 0.05, z1: pad.center[2] + pad.size[1] / 2 - 0.05 };
  const mouseHome = v(M.mouse.at);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), -mouseHome.y), [mouseHome.y]);
  const placeCursor = (x: number, z: number) => {
    const u = (x - padRect.x0) / (padRect.x1 - padRect.x0);
    const w = (z - padRect.z0) / (padRect.z1 - padRect.z0);
    const el = cursorRef.current;
    if (el) el.style.transform = `translate(${(u * APP_W).toFixed(1)}px, ${(w * APP_H).toFixed(1)}px)`;
  };
  const clickAtCursor = () => {
    const el = cursorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.visibility = "hidden";
    const target = document.elementFromPoint(r.left + 1, r.top + 1) as HTMLElement | null;
    el.style.visibility = "";
    if (target && centerEl.current?.contains(target)) target.click();
  };

  useFrame((_, dt) => {
    const d = Math.min(dt, 1 / 20);
    light.step(d);
    toys.step(d);
    if (chairRef.current) chairRef.current.rotation.y = toys.chair;
    if (ballRef.current) {
      ballRef.current.position.y = (M.ball?.at[1] ?? 0) + toys.ballY;
      ballRef.current.rotation.x = toys.ballSpin;
    }
    rig.step(camera as THREE.PerspectiveCamera, view, size.width / size.height, pointer, focused, dive.current, d);
  });

  const down = (kind: "mouse" | "chair") => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    (e.target as unknown as Element)?.setPointerCapture?.(e.pointerId);
    drag.current = { kind, x: e.clientX, moved: 0, last: e.clientX };
    if (kind === "chair") toys.grab();
  };
  const move = (e: ThreeEvent<PointerEvent>) => {
    const g = drag.current;
    if (!g) return;
    g.moved += Math.abs(e.clientX - g.last);
    if (g.kind === "chair") {
      const dx = e.clientX - g.last;
      toys.turn(dx);
    } else {
      const p = new THREE.Vector3();
      if (e.ray.intersectPlane(plane, p) && mouseRef.current) {
        const x = THREE.MathUtils.clamp(p.x, padRect.x0, padRect.x1);
        const z = THREE.MathUtils.clamp(p.z, padRect.z0, padRect.z1);
        mouseRef.current.position.set(x, mouseHome.y, z);
        placeCursor(x, z);
        g.moved += 1;
      }
    }
    g.last = e.clientX;
  };
  const up = (e: ThreeEvent<PointerEvent>) => {
    const g = drag.current;
    drag.current = null;
    if (!g) return;
    e.stopPropagation();
    if (g.kind === "chair") {
      toys.release(g.moved < 3);
    } else if (g.moved < 3) clickAtCursor();
  };
  const hoverOn = (id: string, mat?: THREE.ShaderMaterial) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHover(id);
    light.hover(mat ?? null, true);
    document.body.style.cursor = id === "chair" || id === "mouse" ? "grab" : "pointer";
  };
  const hoverOff = (mat?: THREE.ShaderMaterial) => () => {
    setHover(null);
    light.hover(mat ?? null, false);
    document.body.style.cursor = "";
  };

  return (
    <>
      {M.groups.map((g) => {
        const n = nodes[g];
        if (!n) return null;
        const p = pivot(g);
        const mesh = (
          <mesh
            geometry={n.geometry}
            material={mats[g]}
            position={p ? n.position.clone().sub(p) : n.position}
            quaternion={n.quaternion}
            scale={n.scale}
            onPointerDown={g === "chair" ? down("chair") : g === "mouse" ? down("mouse") : undefined}
            onPointerMove={g === "chair" || g === "mouse" ? move : undefined}
            onPointerUp={g === "chair" || g === "mouse" ? up : undefined}
            onClick={g === "ball" ? (e) => (e.stopPropagation(), toys.bounce()) : undefined}
            onPointerOver={g === "chair" || g === "mouse" || g === "ball" ? hoverOn(g, mats[g]) : undefined}
            onPointerOut={g === "chair" || g === "mouse" || g === "ball" ? hoverOff(mats[g]) : undefined}
          />
        );
        if (!p) return <group key={g}>{mesh}</group>;
        return (
          <group key={g} ref={g === "chair" ? chairRef : g === "ball" ? ballRef : g === "mouse" ? mouseRef : undefined} position={p}>
            {mesh}
          </group>
        );
      })}
      {nodes.phone_screen && <mesh geometry={nodes.phone_screen.geometry} material={lockMat} position={nodes.phone_screen.position} quaternion={nodes.phone_screen.quaternion} scale={nodes.phone_screen.scale} />}
      {nodes.bulb && <mesh geometry={nodes.bulb.geometry} material={light.bulb} position={nodes.bulb.position} quaternion={nodes.bulb.quaternion} scale={nodes.bulb.scale} />}

      {/* the three screens, running the real apps */}
      {(Object.keys(FRAMES) as ScreenId[]).map((id) => {
        const f = FRAMES[id];
        const px = APP_W;
        if (!live)
          return (
            <mesh
              key={id}
              position={f.c}
              quaternion={f.quat}
              onClick={(e) => {
                e.stopPropagation();
                onFocus(id);
              }}
              onPointerOver={() => setHover(`screen-${id}`)}
              onPointerOut={() => setHover(null)}
            >
              <planeGeometry args={[f.w, f.h]} />
              <meshBasicMaterial map={shots[id]} toneMapped={false} />
            </mesh>
          );
        return (
          <group key={id} position={f.c} quaternion={f.quat}>
            <mesh position={[0, 0, -0.0004]}>
              <planeGeometry args={[f.w, f.h]} />
              <meshBasicMaterial color="#0b0b0c" />
            </mesh>
            <Html transform distanceFactor={(400 * f.w) / px} zIndexRange={[5, 0]} style={{ width: px, height: APP_H }}>
              <div ref={id === "center" ? centerEl : undefined} className="theme-fixed relative overflow-hidden bg-white select-none" style={{ width: px, height: APP_H }}>
                {screens[id].node}
                {id === "center" && (
                  <div ref={cursorRef} aria-hidden className="pointer-events-none absolute left-0 top-0 z-50" style={{ transform: "translate(420px, 170px)" }}>
                    <svg width="16" height="22" viewBox="0 0 16 22">
                      <path d="M1 1 L1 17 L5 13 L8 20 L11 19 L8 12 L14 12 Z" fill="#111" stroke="#fff" strokeWidth="1.4" />
                    </svg>
                  </div>
                )}
                {focused !== id && (
                  <button
                    type="button"
                    aria-label={`Open the ${screens[id].label} screen`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onFocus(id);
                    }}
                    onPointerEnter={() => setHover(`screen-${id}`)}
                    onPointerLeave={() => setHover(null)}
                    className="absolute inset-0 cursor-zoom-in bg-transparent hover:bg-white/5 transition-colors"
                  />
                )}
              </div>
            </Html>
          </group>
        );
      })}

      {/* the lamp, books, phone and notebook take a click; invisible handles sit on them */}
      {(
        [
          ["lamp", M.lamp.shade, 0.1],
          ["books", M.hotspots.books, 0.13],
          ["phone", M.hotspots.phone, 0.07],
          ["notebook", M.hotspots.notebook, 0.1],
        ] as [string, number[], number][]
      ).map(([id, at, r]) => (
        <mesh
          key={id}
          position={at as V3}
          onClick={(e) => {
            e.stopPropagation();
            if (id === "lamp") onLamp();
            else if (id === "books") setBooks((b) => !b);
            else onSpot(id as "phone" | "notebook");
          }}
          onPointerOver={hoverOn(id)}
          onPointerOut={hoverOff()}
        >
          <sphereGeometry args={[r, 12, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
      <Steam at={M.steam as V3} />

      {hover === "lamp" && <Label at={v(M.lamp.shade).add(new THREE.Vector3(0, 0.12, 0))}>{night ? "Lamp off, daylight" : "Lamp on"}</Label>}
      {hover === "books" && !books && <Label at={v(M.hotspots.books).add(new THREE.Vector3(0, 0.1, 0))}>On my desk</Label>}
      {hover === "phone" && <Label at={v(M.hotspots.phone).add(new THREE.Vector3(0, 0.08, 0))}>Work in motion</Label>}
      {hover === "notebook" && <Label at={v(M.hotspots.notebook).add(new THREE.Vector3(0, 0.08, 0))}>Research</Label>}
      {hover === "chair" && <Label at={v(M.chair.at).add(new THREE.Vector3(0, 1.32, 0))}>Drag to spin</Label>}
      {hover === "mouse" && <Label at={v(M.mouse.at).add(new THREE.Vector3(0, 0.07, 0))}>Drag me, tap to click</Label>}
      {hover === "ball" && M.ball && <Label at={v(M.ball.at).add(new THREE.Vector3(0, 0.2, 0))}>Bounce it</Label>}
      {books && (
        <Html position={v(M.hotspots.books).add(new THREE.Vector3(0, 0.16, 0)).toArray()} center zIndexRange={[30, 20]}>
          <div className="theme-fixed w-[240px] rounded-2xl bg-[#16130f]/95 p-4 text-[13px] leading-relaxed text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)]" onClick={() => setBooks(false)}>
            <p className="text-[12px] text-white/60">On my desk right now:</p>
            <ul className="mt-2 space-y-1">
              <li>
                <b>The Laws of Human Nature</b> <span className="text-white/60">· Robert Greene</span>
              </li>
              <li>
                <b>Mastery</b> <span className="text-white/60">· Robert Greene</span>
              </li>
              <li>
                <b>Quiet</b> <span className="text-white/60">· Susan Cain</span>
              </li>
            </ul>
          </div>
        </Html>
      )}
    </>
  );
}

export default function Desk3D(props: Omit<SceneProps, "onReady"> & { paused: boolean; onUnfocus: () => void }) {
  const [ready, setReady] = useState(false);
  const { paused, onUnfocus, ...scene } = props;
  return (
    <div className="absolute inset-0 transition-opacity duration-700" style={{ opacity: ready ? 1 : 0 }}>
      <Canvas
        frameloop={paused ? "never" : "always"}
        dpr={[1, props.view === "phone" ? 1.5 : 1.75]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ fov: 34, near: 0.03, far: 30, position: HOME[props.view].pos }}
        onPointerMissed={() => props.focused && onUnfocus()}
      >
        <color attach="background" args={["#1a1410"]} />
        <Suspense fallback={null}>
          <Scene {...scene} onReady={() => setReady(true)} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(`${BASE}/desk.glb`, false, true);
