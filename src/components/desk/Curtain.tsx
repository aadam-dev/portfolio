"use client";

import { useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { kick } from "./activity";
import { rustle } from "./sound";

/**
 * A linen curtain as a Verlet cloth: a grid of particles pinned along the
 * rod, held together by distance constraints. The cursor pushes the cloth
 * where it touches; it sways, then settles and the sim stops.
 */
const COLS = 22;
const ROWS = 30;

class Cloth {
  pos: Float32Array;
  prev: Float32Array;
  rest: number;
  restY: number;
  geo: THREE.PlaneGeometry;
  awake = 0;
  constructor(width: number, height: number, folds: number) {
    const n = COLS * ROWS;
    this.pos = new Float32Array(n * 3);
    this.prev = new Float32Array(n * 3);
    this.rest = width / (COLS - 1);
    this.restY = height / (ROWS - 1);
    for (let j = 0; j < ROWS; j++) {
      for (let i = 0; i < COLS; i++) {
        const k = (j * COLS + i) * 3;
        // gathered pleats: the rod holds the top in folds
        this.pos[k] = i * this.rest - width / 2;
        this.pos[k + 1] = -j * this.restY;
        this.pos[k + 2] = Math.sin((i / (COLS - 1)) * Math.PI * folds) * 0.025;
      }
    }
    this.prev.set(this.pos);
    this.geo = new THREE.PlaneGeometry(width, height, COLS - 1, ROWS - 1);
    (this.geo.attributes.position.array as Float32Array).set(this.pos);
    this.geo.computeVertexNormals();
  }

  /** Push the cloth where the pointer touches (local coordinates). */
  push(local: THREE.Vector3, dir: THREE.Vector3) {
    const { pos, prev } = this;
    let moved = false;
    for (let j = 1; j < ROWS; j++) {
      for (let i = 0; i < COLS; i++) {
        const k = (j * COLS + i) * 3;
        const dx = pos[k] - local.x;
        const dy = pos[k + 1] - local.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 0.018) {
          const f = (1 - d2 / 0.018) * 0.012;
          prev[k] -= dir.x * f;
          prev[k + 2] -= dir.z * f + f * 0.6;
          moved = true;
        }
      }
    }
    const wasAsleep = this.awake < 0.2;
    if (moved) this.awake = 3;
    return moved && wasAsleep;
  }

  step(dtRaw: number) {
    if (this.awake <= 0) return;
    const dt = Math.min(dtRaw, 1 / 30);
    this.awake -= dt;
    const { pos, prev, rest, restY } = this;
    const g = -9.81 * dt * dt * 0.35;
    for (let j = 1; j < ROWS; j++) {
      for (let i = 0; i < COLS; i++) {
        const k = (j * COLS + i) * 3;
        for (let a = 0; a < 3; a++) {
          const v = (pos[k + a] - prev[k + a]) * 0.975;
          prev[k + a] = pos[k + a];
          pos[k + a] += v + (a === 1 ? g : 0);
        }
      }
    }
    const solve = (a: number, b: number, len: number, pinA: boolean) => {
      const dx = pos[b] - pos[a];
      const dy = pos[b + 1] - pos[a + 1];
      const dz = pos[b + 2] - pos[a + 2];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
      const diff = (d - len) / d;
      const s = pinA ? 1 : 0.5;
      if (!pinA) {
        pos[a] += dx * diff * s;
        pos[a + 1] += dy * diff * s;
        pos[a + 2] += dz * diff * s;
      }
      pos[b] -= dx * diff * s;
      pos[b + 1] -= dy * diff * s;
      pos[b + 2] -= dz * diff * s;
    };
    for (let it = 0; it < 4; it++) {
      for (let j = 0; j < ROWS; j++) {
        for (let i = 0; i < COLS; i++) {
          const k = (j * COLS + i) * 3;
          if (i < COLS - 1) solve(k, k + 3, rest, j === 0);
          if (j < ROWS - 1) solve(k, k + COLS * 3, restY, j === 0);
        }
      }
      // keep the cloth off the wall behind it
      for (let k = 0; k < pos.length; k += 3) if (pos[k + 2] < -0.02) pos[k + 2] = -0.02;
    }
    const attr = this.geo.attributes.position as THREE.BufferAttribute;
    (attr.array as Float32Array).set(pos);
    attr.needsUpdate = true;
    this.geo.computeVertexNormals();
  }
}

export default function Curtain({
  width = 0.62,
  height = 1.05,
  position = [0, 0, 0] as [number, number, number],
  color = "#efe6d6",
  folds = 7,
}: {
  width?: number;
  height?: number;
  position?: [number, number, number];
  color?: string;
  folds?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const cloth = useMemo(() => new Cloth(width, height, folds), [width, height, folds]);
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color, roughness: 0.92, side: THREE.DoubleSide, transparent: true, opacity: 0.94 }),
    [color],
  );

  const push = (e: ThreeEvent<PointerEvent>) => {
    if (!mesh.current) return;
    const local = mesh.current.worldToLocal(e.point.clone());
    if (cloth.push(local, e.ray.direction.clone().normalize())) rustle(0.6);
    kick(3000);
  };

  useFrame((_, dt) => cloth.step(dt));

  return (
    <mesh
      ref={mesh}
      geometry={cloth.geo}
      material={mat}
      position={position}
      castShadow
      receiveShadow
      onPointerMove={push}
      onPointerDown={push}
    />
  );
}
