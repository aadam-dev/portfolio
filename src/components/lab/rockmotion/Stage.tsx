"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { CameraControls, CameraControlsImpl, ContactShadows, Environment, Html, Lightformer, MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import CarModel, { LIFT_HEIGHT, type HingeId } from "./CarModel";
import { AREAS, type AreaId } from "@/lib/rockmotion";

export type View = "intro" | "vin" | AreaId | "walk" | "cost";

/** Camera position and target per view, in metres around the car. */
const VIEWS: Record<View, [number, number, number, number, number, number]> = {
  intro: [5.4, 1.9, 5.2, 0, 0.55, 0.2],
  vin: [0.95, 1.5, 2.95, 0.42, 0.82, 1.48],
  walk: [5.7, 2.15, 3.95, 0, 0.5, 0.15],
  body: [4.6, 1.3, 2.1, 0, 0.55, 0.1],
  engine: [2.5, 2.45, 3.9, 0, 0.45, 1.65],
  wheels: [2.75, 0.62, 2.95, 0.98, 0.38, 1.45],
  cabin: [2.45, 1.15, -1.45, 0, 0.6, 0.35],
  under: [2.3, 0.35, 3.5, 0, LIFT_HEIGHT + 0.1, 0.1],
  cost: [-4.6, 1.5, -4.8, 0, 0.6, -0.1],
};

function Studio() {
  return (
    <Environment frames={1} resolution={512}>
      {/* ceiling softboxes: the long reflections that read as paint */}
      {[-6, -2, 2, 6].map((z) => (
        <Lightformer key={z} form="rect" intensity={2.2} rotation-x={Math.PI / 2} position={[0, 5, z]} scale={[10, 1.2, 1]} />
      ))}
      <Lightformer form="rect" intensity={1.4} rotation-y={Math.PI / 2} position={[-12, 1.6, 0]} scale={[30, 1.4, 1]} />
      <Lightformer form="rect" intensity={1.4} rotation-y={-Math.PI / 2} position={[12, 1.6, 0]} scale={[30, 1.4, 1]} />
      <Lightformer form="rect" intensity={0.8} position={[0, 2, -12]} scale={[20, 4, 1]} />
      {/* a cool rim strip behind, a warm one in front */}
      <Lightformer form="rect" color="#7fa2ff" intensity={2.2} position={[-9, 2.4, -8]} scale={[1.2, 6, 1]} onUpdate={(s) => s.lookAt(0, 1, 0)} />
      <Lightformer form="rect" color="#ffd9b8" intensity={1.6} position={[9, 2.2, 8]} scale={[1.2, 5, 1]} onUpdate={(s) => s.lookAt(0, 1, 0)} />
    </Environment>
  );
}

/** A four-post lift that rises with the car for the underbody check. */
function Lift({ lifted }: { lifted: boolean }) {
  if (!lifted) return null;
  const post = (x: number, z: number) => (
    <mesh key={`${x}${z}`} position={[x, 1.25, z]} castShadow>
      <boxGeometry args={[0.16, 2.5, 0.16]} />
      <meshStandardMaterial color="#2d3036" metalness={0.6} roughness={0.45} />
    </mesh>
  );
  return <group>{[post(1.7, 2.9), post(-1.7, 2.9), post(1.7, -2.4), post(-1.7, -2.4)]}</group>;
}

function Runways() {
  return (
    <>
      {[0.98, -0.98].map((x) => (
        <mesh key={x} position={[x, -0.03, 0.2]} castShadow>
          <boxGeometry args={[0.46, 0.06, 4.9]} />
          <meshStandardMaterial color="#25282d" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
    </>
  );
}

const WIDE: View[] = ["intro", "walk", "body", "cost"];

function Rig({ view, reduce, under }: { view: View; reduce: boolean; under: boolean }) {
  const cc = useRef<CameraControlsImpl>(null);
  const { invalidate, size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  useEffect(() => {
    const c = cc.current;
    if (!c) return;
    c.maxPolarAngle = under ? Math.PI * 0.74 : Math.PI / 2 - 0.04;
    // step back on tall or narrow stages (phones) so the whole car stays in frame
    const k = Math.min(1.7, Math.max(1, 1.2 / aspect));
    const [px, py, pz, tx, ty, tz] = VIEWS[view];
    const f = WIDE.includes(view) ? k : Math.sqrt(k);
    c.setLookAt(tx + (px - tx) * f, ty + (py - ty) * f, tz + (pz - tz) * f, tx, ty, tz, !reduce);
    invalidate();
  }, [view, reduce, under, invalidate, aspect]);
  return (
    <CameraControls
      ref={cc}
      makeDefault
      minDistance={1.1}
      maxDistance={11}
      smoothTime={0.55}
      draggingSmoothTime={0.12}
      mouseButtons={{ left: CameraControlsImpl.ACTION.ROTATE, middle: CameraControlsImpl.ACTION.NONE, right: CameraControlsImpl.ACTION.NONE, wheel: CameraControlsImpl.ACTION.NONE }}
      touches={{ one: CameraControlsImpl.ACTION.TOUCH_ROTATE, two: CameraControlsImpl.ACTION.TOUCH_DOLLY, three: CameraControlsImpl.ACTION.NONE }}
    />
  );
}

export default function Stage({
  view,
  hq,
  paused,
  reduce,
  variant,
  open,
  lifted,
  damaged,
  marking,
  vin,
  hotspots,
  area,
  onArea,
  onPanel,
  onReady,
}: {
  view: View;
  /** Reflective floor and higher pixel ratio. */
  hq: boolean;
  paused: boolean;
  reduce: boolean;
  variant: number | null;
  open: Partial<Record<HingeId, boolean>>;
  lifted: boolean;
  damaged: Set<string>;
  marking: boolean;
  vin: string;
  hotspots: boolean;
  area: AreaId | null;
  onArea: (a: AreaId) => void;
  onPanel: (p: string) => void;
  onReady?: () => void;
}) {
  return (
    <Canvas
      shadows={false}
      dpr={hq ? [1, 1.75] : 1}
      frameloop={paused ? "never" : "always"}
      camera={{ position: VIEWS.intro.slice(0, 3) as [number, number, number], fov: 32, near: 0.05, far: 80 }}
      gl={{ antialias: true, toneMapping: THREE.AgXToneMapping, toneMappingExposure: 1.05 }}
    >
      <color attach="background" args={["#0c0d0f"]} />
      <fog attach="fog" args={["#0c0d0f", 11, 26]} />
      <ambientLight intensity={0.15} />
      <Studio />
      <Suspense fallback={null}>
        <CarModel variant={variant} open={open} lifted={lifted} damaged={damaged} marking={marking} vin={vin} onPanel={onPanel} onLoaded={onReady}>
          {lifted && <Runways />}
          {hotspots &&
            AREAS.map((a, i) => (
              <Html key={a.id} position={a.at} center zIndexRange={[20, 0]}>
                <button
                  type="button"
                  onClick={() => onArea(a.id)}
                  aria-label={a.label}
                  aria-pressed={area === a.id}
                  className={`group relative grid place-items-center w-8 h-8 rounded-full text-[12px] font-semibold tabular-nums shadow-[0_2px_12px_rgba(0,0,0,0.45)] transition-colors ${area === a.id ? "bg-[#2f6bff] text-white" : "bg-white text-black hover:bg-[#2f6bff] hover:text-white"}`}
                >
                  {i + 1}
                  <span className="pointer-events-none absolute left-10 whitespace-nowrap rounded-full bg-black/75 px-2.5 py-1 text-[11.5px] font-medium text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                    {a.label}
                  </span>
                </button>
              </Html>
            ))}
        </CarModel>
      </Suspense>
      <Lift lifted={lifted} />
      <ContactShadows position={[0, 0.001, 0.2]} opacity={lifted ? 0.35 : 0.75} scale={10} blur={2.2} far={lifted ? 3 : 1.4} resolution={512} color="#000000" />
      <mesh rotation-x={-Math.PI / 2} position-y={-0.002}>
        <planeGeometry args={[60, 60]} />
        {hq ? (
          <MeshReflectorMaterial
            blur={[300, 90]}
            resolution={1024}
            mixBlur={1}
            mixStrength={18}
            roughness={1}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.3}
            color="#121316"
            metalness={0.55}
            mirror={0}
          />
        ) : (
          <meshStandardMaterial color="#141518" roughness={0.85} metalness={0.2} />
        )}
      </mesh>
      <Rig view={view} reduce={reduce} under={view === "under"} />
    </Canvas>
  );
}
