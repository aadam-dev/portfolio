"use client";

import { useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { kick } from "./activity";
import { plink } from "./sound";

/**
 * Water in a glass: a heightfield solved with the 2D wave equation. Touch
 * the surface and rings spread, reflect off the glass wall and die away.
 */
const N = 44;

function circleAlpha() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  g.fillStyle = "#000";
  g.fillRect(0, 0, 128, 128);
  g.fillStyle = "#fff";
  g.beginPath();
  g.arc(64, 64, 62, 0, Math.PI * 2);
  g.fill();
  return new THREE.CanvasTexture(c);
}

export function Glass({ radius, height, fancy }: { radius: number; height: number; fancy: boolean }) {
  const mat = useMemo(
    () =>
      fancy
        ? new THREE.MeshPhysicalMaterial({
            color: "#ffffff",
            transmission: 1,
            thickness: 0.004,
            roughness: 0.04,
            ior: 1.5,
            transparent: true,
            side: THREE.DoubleSide,
          })
        : new THREE.MeshPhysicalMaterial({ color: "#dfe9ee", transparent: true, opacity: 0.22, roughness: 0.05, side: THREE.DoubleSide }),
    [fancy],
  );
  return (
    <group>
      <mesh material={mat} position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[radius, radius * 0.92, height, 48, 1, true]} />
      </mesh>
      <mesh material={mat} position={[0, 0.003, 0]}>
        <cylinderGeometry args={[radius * 0.92, radius * 0.92, 0.006, 48]} />
      </mesh>
    </group>
  );
}

class Ripples {
  geo: THREE.PlaneGeometry;
  h = new Float32Array(N * N);
  v = new Float32Array(N * N);
  awake = 0;
  constructor(radius: number) {
    this.geo = new THREE.PlaneGeometry(radius * 2, radius * 2, N - 1, N - 1);
    this.geo.rotateX(-Math.PI / 2);
  }
  /** Returns true if this touch should make a sound. */
  poke(gx: number, gz: number, strong: boolean) {
    if (gx < 1 || gz < 1 || gx > N - 2 || gz > N - 2) return false;
    this.v[gz * N + gx] -= strong ? 0.006 : 0.0018;
    const loud = strong || this.awake < 0.3;
    this.awake = 2.5;
    return loud;
  }
  step() {
    if (this.awake <= 0) return;
    this.awake -= 1 / 60;
    const { h, v } = this;
    const c = 0.28;
    for (let z = 1; z < N - 1; z++) {
      for (let x = 1; x < N - 1; x++) {
        const i = z * N + x;
        const lap = h[i - 1] + h[i + 1] + h[i - N] + h[i + N] - 4 * h[i];
        v[i] = (v[i] + lap * c) * 0.985;
      }
    }
    const pos = this.geo.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const r2 = (N / 2 - 1.5) ** 2;
    for (let z = 0; z < N; z++) {
      for (let x = 0; x < N; x++) {
        const i = z * N + x;
        const dx = x - (N - 1) / 2;
        const dz = z - (N - 1) / 2;
        // the glass wall reflects the wave
        if (dx * dx + dz * dz > r2) {
          h[i] = 0;
          v[i] = 0;
        } else h[i] += v[i];
        arr[i * 3 + 1] = h[i];
      }
    }
    pos.needsUpdate = true;
    this.geo.computeVertexNormals();
  }
}

export default function Water({ radius, level }: { radius: number; level: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const sim = useMemo(() => new Ripples(radius), [radius]);
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#b9d6dc",
        roughness: 0.02,
        metalness: 0,
        transparent: true,
        opacity: 0.78,
        alphaMap: circleAlpha(),
        alphaTest: 0.5,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
      }),
    [],
  );

  const touch = (e: ThreeEvent<PointerEvent>, strong: boolean) => {
    if (!mesh.current) return;
    const p = mesh.current.worldToLocal(e.point.clone());
    const gx = Math.round(((p.x + radius) / (radius * 2)) * (N - 1));
    const gz = Math.round(((p.z + radius) / (radius * 2)) * (N - 1));
    if (sim.poke(gx, gz, strong)) plink(strong ? 0.8 : 0.35);
    kick(2500);
  };

  useFrame(() => sim.step());

  return (
    <mesh
      ref={mesh}
      geometry={sim.geo}
      material={mat}
      position={[0, level, 0]}
      onPointerMove={(e) => touch(e, false)}
      onPointerDown={(e) => touch(e, true)}
    />
  );
}
