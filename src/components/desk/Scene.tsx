"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Html, useGLTF, useTexture } from "@react-three/drei";
import { CuboidCollider, CylinderCollider, Physics, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { active, kick } from "./activity";
import { setCursor } from "./cursor";
import { badgeTexture, kenteTexture, notebookTexture, phoneTexture, wallTexture } from "./textures";
import { Lights, Post, SKY, type Phase } from "./Look";
import Ball from "./Ball";
import Curtain from "./Curtain";
import Water, { Glass } from "./Water";
import { LaptopRig, type ScreenId } from "./Laptop";
import { click } from "./sound";
import { reportProgress } from "@/lib/loadProgress";
import type { Tier } from "./tier";

const TOP = 0.76; // desk height (m)

export interface DeskProps {
  /** Off screen: render nothing at all. */
  paused?: boolean;
  tier: Tier;
  night: boolean;
  /** Light by time of day in Accra ("night" when the dark theme is on). */
  phase: Phase;
  /** Scroll progress of the dive into the centre screen, 0 to 1 (written by the hero). */
  dive: { current: number };
  wide: boolean;
  screens: { left: { node: ReactNode; label: string }; center: { node: ReactNode; label: string }; right: { node: ReactNode; label: string } };
  focused: ScreenId | null;
  setFocused: (id: ScreenId | null) => void;
  onToggleTheme: () => void;
  onNavigate: (href: string) => void;
}

/* ---------- render-on-demand driver ---------- */
function Driver() {
  const invalidate = useThree((s) => s.invalidate);
  useFrame(() => {
    if (active()) invalidate();
  });
  useEffect(() => {
    const move = () => {
      kick(250);
      invalidate();
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", move);
    };
  }, [invalidate]);
  return null;
}

/* ---------- camera ---------- */
/** Where the camera sits to frame a screen: "fit" shows it whole, "cover" fills the view with it. */
function screenPose(obj: THREE.Object3D, cam: THREE.PerspectiveCamera, aspect: number, mode: "fit" | "cover", pos: THREE.Vector3, look: THREE.Vector3) {
  const q = new THREE.Quaternion();
  obj.getWorldPosition(look);
  obj.getWorldQuaternion(q);
  const n = new THREE.Vector3(0, 0, 1).applyQuaternion(q);
  const halfH = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
  const d =
    mode === "fit"
      ? Math.max(0.095 / halfH / 0.86, 0.155 / (halfH * aspect) / 0.9)
      : Math.min(0.0905 / halfH, 0.145 / (halfH * aspect));
  pos.copy(look).addScaledVector(n, d);
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function CameraRig({ wide, focusObj, diveObj, dive }: { wide: boolean; focusObj: THREE.Object3D | null; diveObj: THREE.Object3D | null; dive: { current: number } }) {
  const { camera, pointer, size } = useThree();
  const pos = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());
  const ready = useRef(false);

  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    const tPos = new THREE.Vector3();
    const tLook = new THREE.Vector3();
    const e = smooth(0.04, 0.86, dive.current);
    if (focusObj) {
      screenPose(focusObj, cam, aspect, "fit", tPos, tLook);
    } else {
      const still = 1 - e;
      tLook.set(0.04 + pointer.x * 0.03 * still, TOP + 0.08 + pointer.y * 0.015 * still, -0.1);
      tPos.set(0.08 + pointer.x * 0.08 * still, wide ? 1.36 : 1.5, wide ? 1.42 : 1.62);
      if (diveObj && e > 0) {
        const dp = new THREE.Vector3();
        const dl = new THREE.Vector3();
        screenPose(diveObj, cam, aspect, "cover", dp, dl);
        tPos.lerp(dp, e);
        tLook.lerp(dl, e);
      }
    }
    if (!ready.current) {
      pos.current.copy(tPos);
      look.current.copy(tLook);
      ready.current = true;
    }
    const k = focusObj ? 0.09 : e > 0 ? 0.2 : 0.06;
    pos.current.lerp(tPos, k);
    look.current.lerp(tLook, k);
    cam.position.copy(pos.current);
    cam.lookAt(look.current);
    if (pos.current.distanceTo(tPos) > 0.001) kick(120);
  });
  return null;
}

/* ---------- hover label ---------- */
function Label({ text, position }: { text: string; position: [number, number, number] }) {
  return (
    <Html position={position} center zIndexRange={[8, 6]} style={{ pointerEvents: "none" }}>
      <span className="theme-fixed whitespace-nowrap rounded-full bg-[#111]/85 px-2.5 py-1 font-body text-[11.5px] text-white shadow-lg">{text}</span>
    </Html>
  );
}

function useHover() {
  const [hover, setHover] = useState<string | null>(null);
  const bind = (id: string, cursor = "pointer") => ({
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHover(id);
      setCursor(cursor);
      kick(200);
    },
    onPointerOut: () => {
      setHover((h) => (h === id ? null : h));
      setCursor("");
      kick(200);
    },
  });
  return { hover, bind };
}

/* ---------- the room ---------- */
function Room({ phase, tier }: { phase: Phase; tier: Tier }) {
  const night = phase === "night";
  const wall = useMemo(() => new THREE.MeshStandardMaterial({ map: wallTexture(), roughness: 0.95 }), []);
  const sky = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 512;
    const g = c.getContext("2d")!;
    const grd = g.createLinearGradient(0, 0, 0, 512);
    const [a, b, c2] = SKY[phase];
    grd.addColorStop(0, a);
    grd.addColorStop(0.65, b);
    grd.addColorStop(1, c2);
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 512);
    // the roofline across the street
    g.fillStyle = night ? "#05070f" : "rgba(120,110,95,0.55)";
    g.beginPath();
    g.moveTo(0, 430);
    for (let x = 0; x <= 256; x += 32) g.lineTo(x, 400 + ((x * 37) % 50));
    g.lineTo(256, 512);
    g.lineTo(0, 512);
    g.fill();
    if (night) {
      g.fillStyle = "#ffd27a";
      for (let i = 0; i < 14; i++) g.fillRect((i * 53) % 240, 430 + ((i * 29) % 60), 4, 5);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [night, phase]);
  const WIN = { x: 0.62, y: 1.46, w: 0.74, h: 0.86 };
  const Z = -0.46;
  const L = WIN.x - WIN.w / 2;
  const R = WIN.x + WIN.w / 2;
  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color={night ? "#3a2f27" : "#8d7560"} roughness={0.8} />
      </mesh>
      {/* back wall with a window opening */}
      <mesh material={wall} position={[(L - 3) / 2, 1.5, Z]} receiveShadow castShadow>
        <planeGeometry args={[L + 3, 3]} />
      </mesh>
      <mesh material={wall} position={[(R + 3) / 2, 1.5, Z]} receiveShadow castShadow>
        <planeGeometry args={[3 - R, 3]} />
      </mesh>
      <mesh material={wall} position={[WIN.x, (WIN.y - WIN.h / 2) / 2, Z]} receiveShadow castShadow>
        <planeGeometry args={[WIN.w, WIN.y - WIN.h / 2]} />
      </mesh>
      <mesh material={wall} position={[WIN.x, (3 + WIN.y + WIN.h / 2) / 2, Z]} receiveShadow castShadow>
        <planeGeometry args={[WIN.w, 3 - (WIN.y + WIN.h / 2)]} />
      </mesh>
      {/* the view, a little behind the wall */}
      <mesh position={[WIN.x, WIN.y, Z - 0.12]}>
        <planeGeometry args={[WIN.w + 0.4, WIN.h + 0.3]} />
        <meshBasicMaterial map={sky} toneMapped={false} />
      </mesh>
      {/* frame and sill */}
      <mesh position={[WIN.x, WIN.y - WIN.h / 2 - 0.012, Z + 0.04]} castShadow receiveShadow>
        <boxGeometry args={[WIN.w + 0.08, 0.025, 0.1]} />
        <meshStandardMaterial color="#f4efe6" roughness={0.6} />
      </mesh>
      <mesh position={[WIN.x, WIN.y, Z - 0.01]} castShadow>
        <boxGeometry args={[0.018, WIN.h, 0.02]} />
        <meshStandardMaterial color="#f4efe6" />
      </mesh>
      {/* curtain rod */}
      <mesh position={[WIN.x, WIN.y + WIN.h / 2 + 0.06, Z + 0.07]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.008, WIN.w + 0.3, 12]} />
        <meshStandardMaterial color="#3b2f26" metalness={0.6} roughness={0.4} />
      </mesh>
      {tier === "high" ? (
        <Curtain position={[WIN.x - WIN.w / 2 + 0.16, WIN.y + WIN.h / 2 + 0.055, Z + 0.07]} width={0.46} height={1.02} />
      ) : (
        <mesh position={[WIN.x - WIN.w / 2 + 0.16, WIN.y - 0.02, Z + 0.07]}>
          <planeGeometry args={[0.46, 1.02]} />
          <meshStandardMaterial color="#efe6d6" roughness={0.9} transparent opacity={0.94} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

/* ---------- the desk ---------- */
const WOOD = ["/desk/tex/wood-color.webp", "/desk/tex/wood-bump.webp", "/desk/tex/wood-rough.webp"];

function Desk() {
  const [color, bump, rough] = useTexture(WOOD, (ts) => {
    for (const t of ts) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(1.5, 0.68);
      t.anisotropy = 8;
    }
    ts[0].colorSpace = THREE.SRGBColorSpace;
  });
  const top = useMemo(() => {
    // oiled oak: grain in the bump and roughness maps, a thin satin coat on top
    return new THREE.MeshPhysicalMaterial({ map: color, color: "#c99b72", bumpMap: bump, bumpScale: 1.2, roughnessMap: rough, roughness: 0.9, clearcoat: 0.22, clearcoatRoughness: 0.42 });
  }, [color, bump, rough]);
  const steel = useMemo(() => new THREE.MeshStandardMaterial({ color: "#232326", metalness: 0.85, roughness: 0.38 }), []);
  return (
    <group>
      <mesh material={top} position={[0, TOP - 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.04, 0.82]} />
      </mesh>
      {[-0.82, 0.82].map((x) => (
        <group key={x}>
          <mesh material={steel} position={[x, (TOP - 0.04) / 2, -0.32]} castShadow receiveShadow>
            <boxGeometry args={[0.04, TOP - 0.04, 0.04]} />
          </mesh>
          <mesh material={steel} position={[x, (TOP - 0.04) / 2, 0.32]} castShadow>
            <boxGeometry args={[0.04, TOP - 0.04, 0.04]} />
          </mesh>
          <mesh material={steel} position={[x, 0.08, 0]}>
            <boxGeometry args={[0.04, 0.03, 0.68]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------- props ---------- */
function Lamp({ night, onToggle, bind, hover }: { night: boolean; onToggle: () => void; bind: ReturnType<typeof useHover>["bind"]; hover: string | null }) {
  const metal = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#26262a", metalness: 0.9, roughness: 0.3, anisotropy: 0.6 }), []);
  const target = useMemo(() => {
    const o = new THREE.Object3D();
    // in the lamp's own (scaled) frame: a pool on the desk in front of it
    o.position.set(0.5, 0, 0.45);
    return o;
  }, []);
  return (
    <group position={[-0.62, TOP, -0.3]} scale={0.85}>
      <group
        onClick={(e) => {
          e.stopPropagation();
          click();
          onToggle();
        }}
        {...bind("lamp")}
      >
        <mesh material={metal} position={[0, 0.008, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.075, 0.016, 32]} />
        </mesh>
        <mesh material={metal} position={[0.03, 0.2, 0]} rotation={[0, 0, -0.25]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.4, 12]} />
        </mesh>
        <mesh material={metal} position={[0.14, 0.38, 0.04]} rotation={[0.3, 0, -1.1]} castShadow>
          <cylinderGeometry args={[0.007, 0.007, 0.26, 12]} />
        </mesh>
        <mesh position={[0.25, 0.34, 0.09]} rotation={[0.5, 0, -2.3]} castShadow>
          <coneGeometry args={[0.07, 0.12, 32, 1, true]} />
          <meshStandardMaterial color="#1c1c1e" metalness={0.6} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.27, 0.315, 0.105]}>
          <sphereGeometry args={[0.022, 16, 16]} />
          <meshStandardMaterial color="#fff6dd" emissive="#ffd99a" emissiveIntensity={night ? 7 : 0.25} toneMapped={false} />
        </mesh>
      </group>
      {night && (
        <>
          <primitive object={target} />
          <spotLight position={[0.27, 0.3, 0.1]} target={target} angle={0.85} penumbra={0.7} intensity={9} distance={2.6} color="#ffcf8a" castShadow shadow-mapSize={[1024, 1024]} />
        </>
      )}
      {hover === "lamp" && <Label text={night ? "Lights on" : "Switch to night"} position={[0.2, 0.5, 0.05]} />}
    </group>
  );
}

function Flat({ map, w, h, position, rotation = 0, rough = 0.6, thickness = 0.004 }: { map: THREE.Texture; w: number; h: number; position: [number, number, number]; rotation?: number; rough?: number; thickness?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, thickness / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, thickness, h]} />
        <meshStandardMaterial color="#efe9dc" roughness={0.8} />
      </mesh>
      <mesh position={[0, thickness + 0.0004, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[w * 0.98, h * 0.98]} />
        <meshStandardMaterial map={map} roughness={rough} />
      </mesh>
    </group>
  );
}

function Props({ tier, bind, hover, onNavigate }: { tier: Tier; bind: ReturnType<typeof useHover>["bind"]; hover: string | null; onNavigate: (href: string) => void }) {
  const tex = useMemo(() => ({ kente: kenteTexture(), note: notebookTexture(), badge: badgeTexture(), phone: phoneTexture() }), []);
  const go = (href: string) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onNavigate(href);
  };
  return (
    <group>
      {/* notebook with the wavelet working */}
      <group onClick={go("/about#research")} {...bind("notebook")}>
        <Flat map={tex.note} w={0.17} h={0.235} position={[-0.3, TOP, 0.2]} rotation={0.22} thickness={0.012} />
        <mesh position={[-0.3 + 0.07, TOP + 0.014, 0.2]} rotation={[0, 0.22 + 0.3, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.0045, 0.0045, 0.15, 12]} />
          <meshStandardMaterial color="#1f2a44" roughness={0.3} metalness={0.3} />
        </mesh>
      </group>
      {hover === "notebook" && <Label text="Research: Wavelet-ANN forecasting" position={[-0.3, TOP + 0.08, 0.2]} />}

      {/* ICIS badge */}
      <group onClick={go("/about#research")} {...bind("badge")}>
        <Flat map={tex.badge} w={0.065} h={0.092} position={[0.46, TOP, 0.08]} rotation={-0.35} thickness={0.002} rough={0.35} />
        <mesh position={[0.46, TOP + 0.0015, 0.0]} rotation={[-Math.PI / 2, 0, 0.6]}>
          <torusGeometry args={[0.07, 0.004, 6, 48, Math.PI * 1.3]} />
          <meshStandardMaterial color="#0f2a4a" roughness={0.8} />
        </mesh>
      </group>
      {hover === "badge" && <Label text="ICIS 2026: paper presented" position={[0.46, TOP + 0.06, 0.08]} />}

      {/* phone with orders coming in */}
      <group position={[-0.06, TOP, 0.26]} rotation={[0, 0.35, 0]} onClick={go("#work-in-motion")} {...bind("phone")}>
        <mesh position={[0, 0.004, 0]} castShadow>
          <boxGeometry args={[0.072, 0.008, 0.15]} />
          <meshStandardMaterial color="#141416" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.0082, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.066, 0.143]} />
          <meshStandardMaterial map={tex.phone} emissive="#ffffff" emissiveMap={tex.phone} emissiveIntensity={0.55} roughness={0.15} />
        </mesh>
      </group>
      {hover === "phone" && <Label text="Orders arriving: see the systems" position={[-0.06, TOP + 0.06, 0.26]} />}

      {/* glass of water on a kente coaster */}
      <group position={[0.3, TOP, 0.24]}>
        <mesh position={[0, 0.0015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[0.055, 40]} />
          <meshStandardMaterial map={tex.kente} roughness={0.85} />
        </mesh>
        <group position={[0, 0.003, 0]} {...bind("water", "crosshair")}>
          <Glass radius={0.036} height={0.115} fancy={tier === "high"} />
          <Water radius={0.0325} level={0.08} />
        </group>
      </group>
      {hover === "water" && <Label text="Touch the water" position={[0.3, TOP + 0.16, 0.24]} />}

      {/* thermal printer with a receipt curling out */}
      <group position={[-0.42, TOP, -0.12]} rotation={[0, 0.4, 0]} onClick={go("#build")} {...bind("printer")}>
        <mesh position={[0, 0.035, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 0.07, 0.13]} />
          <meshStandardMaterial color="#202022" roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.072, -0.01]} rotation={[-0.5, 0, 0]}>
          <planeGeometry args={[0.058, 0.09]} />
          <meshStandardMaterial color="#f4f0e6" roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.034, 0.071, 0.05]}>
          <sphereGeometry args={[0.004, 8, 8]} />
          <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={2} toneMapped={false} />
        </mesh>
      </group>
      {hover === "printer" && <Label text="Print a project ticket" position={[-0.42, TOP + 0.16, -0.12]} />}
    </group>
  );
}

/* ---------- plant and cup (Khronos samples) ---------- */
function shadowsOn(root: THREE.Object3D) {
  root.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
}

function Plant() {
  const { scene } = useGLTF("/desk/plant.glb");
  useEffect(() => shadowsOn(scene), [scene]);
  return <primitive object={scene} position={[0.76, TOP, -0.25]} rotation={[0, -0.6, 0]} scale={0.46} />;
}

function Cup() {
  const { scene } = useGLTF("/desk/cup.glb");
  useEffect(() => shadowsOn(scene), [scene]);
  return <primitive object={scene} position={[-0.56, TOP, 0.16]} rotation={[0, 0.9, 0]} scale={0.95} />;
}

/* ---------- lights ---------- */
/* ---------- physics boundaries ---------- */
function Colliders() {
  return (
    <>
      <RigidBody type="fixed" name="desk" colliders={false}>
        <CuboidCollider args={[0.9, 0.02, 0.41]} position={[0, TOP - 0.02, 0]} restitution={0.6} friction={0.8} />
        {/* laptop base and lid */}
        <CuboidCollider args={[0.155, 0.007, 0.108]} position={[0, TOP + 0.007, -0.08]} />
        <CuboidCollider args={[0.45, 0.1, 0.01]} position={[0, TOP + 0.1, -0.2]} />
        <CylinderCollider args={[0.06, 0.04]} position={[0.3, TOP + 0.06, 0.24]} />
        <CuboidCollider args={[0.06, 0.035, 0.07]} position={[-0.42, TOP + 0.035, -0.12]} />
        <CylinderCollider args={[0.1, 0.07]} position={[0.76, TOP + 0.1, -0.25]} />
        <CylinderCollider args={[0.03, 0.075]} position={[-0.56, TOP + 0.03, 0.16]} />
      </RigidBody>
      <RigidBody type="fixed" name="floor" colliders={false}>
        <CuboidCollider args={[4, 0.05, 4]} position={[0, -0.05, 0]} restitution={0.72} friction={0.9} />
      </RigidBody>
      <RigidBody type="fixed" name="wall" colliders={false}>
        <CuboidCollider args={[4, 3, 0.05]} position={[0, 1.5, -0.51]} restitution={0.6} />
        <CuboidCollider args={[0.05, 3, 4]} position={[-1.55, 1.5, 0]} restitution={0.6} />
        <CuboidCollider args={[0.05, 3, 4]} position={[1.55, 1.5, 0]} restitution={0.6} />
        <CuboidCollider args={[4, 3, 0.05]} position={[0, 1.5, 0.95]} restitution={0.5} />
      </RigidBody>
    </>
  );
}

function Contents(props: DeskProps) {
  const { hover, bind } = useHover();
  const [focusObj, setFocusObj] = useState<THREE.Object3D | null>(null);
  const [diveObj, setDiveObj] = useState<THREE.Object3D | null>(null);
  const invalidate = useThree((s) => s.invalidate);
  const frames = useRef(0);

  useFrame(() => {
    if (frames.current < 3) {
      frames.current += 1;
      if (frames.current === 3) reportProgress(1);
    }
  });

  const onScreen = useCallback((id: ScreenId, obj: THREE.Object3D) => {
    if (id === "center") setDiveObj(obj);
  }, []);

  useEffect(() => {
    if (!props.focused) {
      const f = requestAnimationFrame(() => setFocusObj(null));
      kick(1500);
      invalidate();
      return () => cancelAnimationFrame(f);
    }
  }, [props.focused, invalidate]);

  return (
    <>
      <Driver />
      <CameraRig wide={props.wide} focusObj={focusObj} diveObj={diveObj} dive={props.dive} />
      <Lights phase={props.phase} tier={props.tier} top={TOP} />
      <Room phase={props.phase} tier={props.tier} />
      <Desk />
      <Plant />
      <Cup />
      <Physics gravity={[0, -9.81, 0]}>
        <Colliders />
        <Ball start={[0.55, TOP + 0.125, -0.27]} />
      </Physics>
      <group position={[0.02, TOP, -0.1]}>
        <LaptopRig
          night={props.night}
          screens={props.screens}
          focused={props.focused}
          onMount={onScreen}
          onFocus={(id, obj) => {
            setFocusObj(obj);
            props.setFocused(id);
            kick(1500);
          }}
        />
      </group>
      <Props tier={props.tier} bind={bind} hover={hover} onNavigate={props.onNavigate} />
      <ContactShadows position={[0, TOP + 0.0008, 0]} scale={[1.8, 0.82]} resolution={512} far={0.5} blur={2.4} opacity={props.night ? 0.55 : 0.42} color="#2a1608" />
      <Lamp night={props.night} onToggle={props.onToggleTheme} bind={bind} hover={hover} />
      {props.tier === "high" && <Post focus={[0.02, TOP + 0.1, -0.16]} sharp={!!props.focused} />}
    </>
  );
}

export default function DeskScene(props: DeskProps) {
  return (
    <Canvas
      frameloop={props.paused ? "never" : "demand"}
      shadows={props.tier === "high" ? "soft" : true}
      dpr={props.tier === "high" ? [1, 1.5] : [1, 1]}
      camera={{ fov: 34, near: 0.05, far: 20, position: [0, 1.5, 1.3] }}
      gl={{ antialias: props.tier !== "high", powerPreference: "high-performance" }}
      onCreated={(state) => {
        const { gl } = state;
        if (process.env.NODE_ENV !== "production") (window as unknown as { __desk: unknown }).__desk = state;
        // the high tier tone-maps in the post chain
        gl.toneMapping = props.tier === "high" ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1;
        reportProgress(0.6);
        kick(2500);
      }}
    >
      <Suspense fallback={null}>
        <Contents {...props} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/desk/plant.glb");
useGLTF.preload("/desk/cup.glb");
