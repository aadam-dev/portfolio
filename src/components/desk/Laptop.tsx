"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export type ScreenId = "left" | "center" | "right";

function keyboardTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = "#1a1a1c";
  g.fillRect(0, 0, 1024, 512);
  const rows = [14, 14, 13, 12, 9];
  rows.forEach((n, r) => {
    const kw = 940 / 14;
    const off = (14 - n) * kw * 0.5;
    for (let i = 0; i < n; i++) {
      const w = r === 4 && i === 4 ? kw * 5 : kw - 8;
      g.fillStyle = "#0d0d0e";
      g.beginPath();
      g.roundRect(42 + off + i * kw + (r === 4 && i > 4 ? kw * 4 : 0), 28 + r * 70, w, 60, 8);
      g.fill();
    }
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/**
 * One live screen: real DOM rendered onto a plane with drei's CSS3D
 * transform. Until it is focused, a transparent cover turns a click into
 * "zoom to this screen"; once focused the app inside is fully usable.
 */
export function Screen({
  id,
  width,
  height,
  px,
  focused,
  onFocus,
  children,
  label,
  onMount,
}: {
  onMount?: (id: ScreenId, obj: THREE.Object3D) => void;
  id: ScreenId;
  width: number;
  height: number;
  px: number;
  focused: boolean;
  onFocus: (id: ScreenId, obj: THREE.Object3D) => void;
  children: ReactNode;
  label: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const pxH = Math.round((px * height) / width);
  useEffect(() => {
    if (ref.current) onMount?.(id, ref.current);
  }, [id, onMount]);
  return (
    <mesh ref={ref} position={[0, 0, 0.0012]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial color="#000" />
      <Html
        transform
        distanceFactor={(400 * width) / px}
        position={[0, 0, 0.0005]}
        zIndexRange={[5, 0]}
        style={{ width: px, height: pxH }}
      >
        <div className="theme-fixed relative overflow-hidden bg-white select-none" style={{ width: px, height: pxH }}>
          {children}
          {!focused && (
            <button
              type="button"
              aria-label={`Open the ${label} screen`}
              className="absolute inset-0 cursor-zoom-in bg-transparent"
              onClick={() => ref.current && onFocus(id, ref.current)}
            />
          )}
        </div>
      </Html>
    </mesh>
  );
}

/** Laptop with two clip-on extender screens, all open on the desk. */
export function LaptopRig({
  night,
  screens,
  focused,
  onFocus,
  onMount,
}: {
  onMount?: (id: ScreenId, obj: THREE.Object3D) => void;
  night: boolean;
  screens: { left: { node: ReactNode; label: string }; center: { node: ReactNode; label: string }; right: { node: ReactNode; label: string } };
  focused: ScreenId | null;
  onFocus: (id: ScreenId, obj: THREE.Object3D) => void;
}) {
  // bead-blasted aluminium: brushed highlights come from anisotropy, not colour
  const alu = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#c6c7cb", metalness: 1, roughness: 0.36, anisotropy: 0.45, anisotropyRotation: Math.PI / 2 }), []);
  const bezel = useMemo(() => new THREE.MeshStandardMaterial({ color: "#0b0b0c", roughness: 0.4, metalness: 0.2 }), []);
  const keys = useMemo(() => new THREE.MeshStandardMaterial({ map: keyboardTexture(), roughness: 0.7 }), []);

  const W = 0.31;
  const D = 0.215;
  const LID_H = 0.2;
  const open = THREE.MathUtils.degToRad(-14); // lid leans back 14° past vertical
  const EXT_W = 0.27;

  return (
    <group>
      {/* base */}
      <mesh material={alu} position={[0, 0.007, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, 0.014, D]} />
      </mesh>
      <mesh material={keys} position={[0, 0.0142, -0.012]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W * 0.9, D * 0.48]} />
      </mesh>
      <mesh position={[0, 0.0142, 0.072]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.11, 0.06]} />
        <meshPhysicalMaterial color={night ? "#4d4d52" : "#b9b9bd"} metalness={0.9} roughness={0.22} />
      </mesh>

      {/* lid, hinged at the back edge */}
      <group position={[0, 0.014, -D / 2]} rotation={[open, 0, 0]}>
        <mesh material={bezel} position={[0, LID_H / 2, -0.003]} castShadow>
          <boxGeometry args={[W, LID_H, 0.005]} />
        </mesh>
        <mesh material={alu} position={[0, LID_H / 2, -0.0058]}>
          <boxGeometry args={[W, LID_H, 0.0012]} />
        </mesh>
        <group position={[0, LID_H / 2 + 0.002, 0]}>
          <Screen id="center" width={0.29} height={0.181} px={640} focused={focused === "center"} onFocus={onFocus} onMount={onMount} label={screens.center.label}>
            {screens.center.node}
          </Screen>
        </group>

        {/* extenders clip to the lid's sides and angle toward you */}
        {([-1, 1] as const).map((side) => (
          <group key={side} position={[(side * W) / 2, LID_H / 2, -0.004]} rotation={[0, side * THREE.MathUtils.degToRad(-24), 0]}>
            <mesh material={bezel} position={[(side * EXT_W) / 2, 0, 0]} castShadow>
              <boxGeometry args={[EXT_W, 0.175, 0.006]} />
            </mesh>
            <mesh material={alu} position={[side * 0.004, 0, -0.004]}>
              <boxGeometry args={[0.012, 0.06, 0.008]} />
            </mesh>
            <group position={[(side * EXT_W) / 2, 0, 0.0031]}>
              <Screen
                id={side < 0 ? "left" : "right"}
                width={EXT_W - 0.012}
                height={0.162}
                px={600}
                focused={focused === (side < 0 ? "left" : "right")}
                onFocus={onFocus}
                label={side < 0 ? screens.left.label : screens.right.label}
              >
                {side < 0 ? screens.left.node : screens.right.node}
              </Screen>
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}
