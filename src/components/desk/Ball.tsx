"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { BallCollider, RigidBody, type RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { basketballTexture } from "./textures";
import { kick } from "./activity";
import { setCursor } from "./cursor";
import { bounce } from "./sound";
import { emit } from "@/components/fieldkit/events";

const R = 0.12; // a size-7 ball

/**
 * The Madina ball. Tap it to dribble, or grab and fling it: it rolls off
 * the desk, bounces on the floor and off the walls, with the thump timed
 * to the physics contact and scaled by how hard it hit.
 */
export default function Ball({ start, onFirstPlay }: { start: [number, number, number]; onFirstPlay?: () => void }) {
  const body = useRef<RapierRigidBody>(null);
  const { camera, gl } = useThree();
  const map = useMemo(() => basketballTexture(), []);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ map, roughness: 0.62, bumpMap: map, bumpScale: 0.002 }), [map]);
  const drag = useRef<{ plane: THREE.Plane; last: THREE.Vector3; vel: THREE.Vector3; t: number; moved: boolean } | null>(null);
  const lastVel = useRef(new THREE.Vector3());
  const played = useRef(false);

  const firstPlay = () => {
    if (played.current) return;
    played.current = true;
    onFirstPlay?.();
    emit("court", "ball.played", "on the desk");
  };

  useEffect(() => {
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const hit = new THREE.Vector3();
    const move = (e: PointerEvent) => {
      const d = drag.current;
      const b = body.current;
      if (!d || !b) return;
      const r = gl.domElement.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      if (!ray.ray.intersectPlane(d.plane, hit)) return;
      hit.y = Math.max(hit.y, R + 0.002);
      const now = performance.now();
      const dt = Math.max(1, now - d.t) / 1000;
      d.vel.subVectors(hit, d.last).divideScalar(dt).multiplyScalar(0.6).add(d.vel.clone().multiplyScalar(0.4));
      d.last.copy(hit);
      d.t = now;
      d.moved = true;
      b.setNextKinematicTranslation(hit);
      kick(400);
    };
    const up = () => {
      const d = drag.current;
      const b = body.current;
      if (!d || !b) return;
      drag.current = null;
      b.setBodyType(0, true);
      if (d.moved) {
        const v = d.vel.clampLength(0, 7);
        b.setLinvel({ x: v.x, y: v.y, z: v.z }, true);
        b.setAngvel({ x: v.z * 4, y: 0, z: -v.x * 4 }, true);
      } else {
        // a tap is a dribble
        b.applyImpulse({ x: (Math.random() - 0.5) * 0.4, y: 2.6, z: (Math.random() - 0.5) * 0.3 }, true);
      }
      setCursor("");
      kick(4000);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [camera, gl]);

  const grab = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const b = body.current;
    if (!b) return;
    firstPlay();
    const t = b.translation();
    const p = new THREE.Vector3(t.x, t.y, t.z);
    const normal = new THREE.Vector3();
    camera.getWorldDirection(normal).negate();
    normal.y = 0;
    normal.normalize();
    drag.current = { plane: new THREE.Plane().setFromNormalAndCoplanarPoint(normal, p), last: p, vel: new THREE.Vector3(), t: performance.now(), moved: false };
    b.setBodyType(2, true);
    setCursor("grabbing");
    kick(1000);
  };

  useFrame(() => {
    const b = body.current;
    if (!b) return;
    const v = b.linvel();
    lastVel.current.set(v.x, v.y, v.z);
    // a resting body can jitter without ever sleeping; only real motion keeps the scene awake
    if (drag.current || (!b.isSleeping() && lastVel.current.lengthSq() > 0.0004)) kick(300);
  });

  return (
    <RigidBody
      ref={body}
      colliders={false}
      position={start}
      restitution={0.78}
      friction={0.9}
      linearDamping={0.12}
      angularDamping={0.5}
      ccd
      name="ball"
      onCollisionEnter={({ other }) => {
        const speed = lastVel.current.length();
        const name = other.rigidBodyObject?.name ?? "";
        bounce(speed / 5, name === "floor" ? "floor" : name === "wall" ? "hard" : "wood");
      }}
    >
      <BallCollider args={[R]} />
      <mesh
        material={mat}
        castShadow
        receiveShadow
        onPointerDown={grab}
        onPointerOver={() => setCursor("grab")}
        onPointerOut={() => !drag.current && setCursor("")}
      >
        <sphereGeometry args={[R, 64, 32]} />
      </mesh>
    </RigidBody>
  );
}
