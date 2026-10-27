"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Environment, Html, Lightformer } from "@react-three/drei";
import { CuboidCollider, CylinderCollider, Physics, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { active, kick } from "./activity";
import { setCursor } from "./cursor";
import { badgeTexture, kenteTexture, notebookTexture, phoneTexture, wallTexture, woodTexture } from "./textures";
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
    return () => window.removeEventListener("pointermove", move);
  }, [invalidate]);
  return null;
}

/* ---------- camera ---------- */
function CameraRig({ wide, focusObj }: { wide: boolean; focusObj: THREE.Object3D | null }) {
  const { camera, pointer, size } = useThree();
  const pos = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());
  const ready = useRef(false);

  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const tPos = new THREE.Vector3();
    const tLook = new THREE.Vector3();
    if (focusObj) {
      const c = new THREE.Vector3();
      const q = new THREE.Quaternion();
      focusObj.getWorldPosition(c);
      focusObj.getWorldQuaternion(q);
      const n = new THREE.Vector3(0, 0, 1).applyQuaternion(q);
      const halfH = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
      const dH = 0.095 / halfH / 0.86;
      const dW = 0.155 / (halfH * (size.width / size.height)) / 0.9;
      tLook.copy(c);
      tPos.copy(c).addScaledVector(n, Math.max(dH, dW));
    } else {
      tLook.set(0.04 + pointer.x * 0.03, TOP + 0.08 + pointer.y * 0.015, -0.1);
      tPos.set(0.08 + pointer.x * 0.08, wide ? 1.36 : 1.5, wide ? 1.42 : 1.62);
    }
    if (!ready.current) {
      pos.current.copy(tPos);
      look.current.copy(tLook);
      ready.current = true;
    }
    const k = focusObj ? 0.09 : 0.06;
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
function Room({ night, tier }: { night: boolean; tier: Tier }) {
  const wall = useMemo(() => new THREE.MeshStandardMaterial({ map: wallTexture(), roughness: 0.95 }), []);
  const sky = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 512;
    const g = c.getContext("2d")!;
    const grd = g.createLinearGradient(0, 0, 0, 512);
    if (night) {
      grd.addColorStop(0, "#0a1024");
      grd.addColorStop(1, "#24304f");
    } else {
      grd.addColorStop(0, "#9cc3e6");
      grd.addColorStop(0.7, "#f3e3c2");
      grd.addColorStop(1, "#f7d9a6");
    }
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
  }, [night]);
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
      <mesh material={wall} position={[(L - 3) / 2, 1.5, Z]} receiveShadow>
        <planeGeometry args={[L + 3, 3]} />
      </mesh>
      <mesh material={wall} position={[(R + 3) / 2, 1.5, Z]} receiveShadow>
        <planeGeometry args={[3 - R, 3]} />
      </mesh>
      <mesh material={wall} position={[WIN.x, (WIN.y - WIN.h / 2) / 2, Z]} receiveShadow>
        <planeGeometry args={[WIN.w, WIN.y - WIN.h / 2]} />
      </mesh>
      <mesh material={wall} position={[WIN.x, (3 + WIN.y + WIN.h / 2) / 2, Z]} receiveShadow>
        <planeGeometry args={[WIN.w, 3 - (WIN.y + WIN.h / 2)]} />
      </mesh>
      {/* the view, a little behind the wall */}
      <mesh position={[WIN.x, WIN.y, Z - 0.12]}>
        <planeGeometry args={[WIN.w + 0.4, WIN.h + 0.3]} />
        <meshBasicMaterial map={sky} toneMapped={false} />
      </mesh>
      {!night && (
        <mesh position={[WIN.x - 0.15, TOP + 0.02, -0.12]} rotation={[-Math.PI / 2, 0, 0.35]}>
          <planeGeometry args={[0.9, 0.5]} />
          <meshBasicMaterial color="#ffd9a0" transparent opacity={0.1} depthWrite={false} />
        </mesh>
      )}
      {/* frame and sill */}
      <mesh position={[WIN.x, WIN.y - WIN.h / 2 - 0.012, Z + 0.04]} castShadow receiveShadow>
        <boxGeometry args={[WIN.w + 0.08, 0.025, 0.1]} />
        <meshStandardMaterial color="#f4efe6" roughness={0.6} />
      </mesh>
      <mesh position={[WIN.x, WIN.y, Z - 0.01]}>
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
function Desk() {
  const top = useMemo(() => {
    const m = woodTexture();
    return new THREE.MeshStandardMaterial({ map: m, roughness: 0.55 });
  }, []);
  const steel = useMemo(() => new THREE.MeshStandardMaterial({ color: "#2a2a2c", metalness: 0.7, roughness: 0.45 }), []);
  return (
    <group>
      <mesh material={top} position={[0, TOP - 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.04, 0.82]} />
      </mesh>
      {[-0.82, 0.82].map((x) => (
        <group key={x}>
          <mesh material={steel} position={[x, (TOP - 0.04) / 2, -0.32]} castShadow>
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
  const metal = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1c1c1e", metalness: 0.7, roughness: 0.35 }), []);
  const target = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(-0.32, TOP, 0.05);
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
          <meshStandardMaterial color="#fff6dd" emissive="#ffd99a" emissiveIntensity={night ? 4 : 0.2} toneMapped={false} />
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

/* ---------- lights ---------- */
function Lights({ night, tier }: { night: boolean; tier: Tier }) {
  const sun = useRef<THREE.DirectionalLight>(null);
  return (
    <>
      <ambientLight intensity={night ? 0.06 : 0.35} color={night ? "#8ea2ff" : "#fff4e6"} />
      <hemisphereLight intensity={night ? 0.08 : 0.45} color={night ? "#5266a8" : "#fff2dc"} groundColor="#5a4636" />
      {!night && (
        <directionalLight
          ref={sun}
          position={[1.6, 2.4, -1.2]}
          intensity={3.2}
          color="#ffdcae"
          castShadow={tier === "high"}
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-1.4}
          shadow-camera-right={1.4}
          shadow-camera-top={1.4}
          shadow-camera-bottom={-1.4}
          shadow-bias={-0.0004}
        />
      )}
      {night && <pointLight position={[0.05, TOP + 0.2, 0.0]} intensity={0.6} distance={1.2} color="#9fc4ff" />}
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={night ? 0.4 : 2} position={[1.5, 2, -1]} scale={[3, 2, 1]} color={night ? "#33405f" : "#fff1dc"} />
        <Lightformer form="rect" intensity={night ? 0.2 : 0.8} position={[-2, 1.5, 2]} scale={[2, 2, 1]} color="#ffffff" />
      </Environment>
    </>
  );
}

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
  const invalidate = useThree((s) => s.invalidate);
  const frames = useRef(0);

  useFrame(() => {
    if (frames.current < 3) {
      frames.current += 1;
      if (frames.current === 3) reportProgress(1);
    }
  });

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
      <CameraRig wide={props.wide} focusObj={focusObj} />
      <Lights night={props.night} tier={props.tier} />
      <Room night={props.night} tier={props.tier} />
      <Desk />
      <Physics gravity={[0, -9.81, 0]}>
        <Colliders />
        <Ball start={[0.55, TOP + 0.125, -0.27]} />
      </Physics>
      <group position={[0.02, TOP, -0.1]}>
        <LaptopRig
          night={props.night}
          screens={props.screens}
          focused={props.focused}
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
    </>
  );
}

export default function DeskScene(props: DeskProps) {
  return (
    <Canvas
      frameloop={props.paused ? "never" : "demand"}
      shadows={props.tier === "high" ? "soft" : false}
      dpr={props.tier === "high" ? [1, 1.5] : [1, 1]}
      camera={{ fov: 36, near: 0.05, far: 20, position: [0, 1.5, 1.3] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = props.night ? 0.9 : 1.05;
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
