"use client";

import { useEffect, useMemo, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { GLTF, GLTFParser } from "three/examples/jsm/loaders/GLTFLoader.js";
import { PANELS } from "@/lib/rockmotion";

export const CAR_URL = "/lab/car.glb";

/** Positions are taken from the model: the car points along +z, its left side is +x. */
const HINGES = {
  doorL: { node: "BodyDoorLColor1", at: [1.05, 0.6, 0.97], axis: [0, 1, 0], open: -1.05 },
  doorR: { node: "BodyDoorRColor1", at: [-1.05, 0.6, 0.97], axis: [0, 1, 0], open: 1.05 },
  hood: { node: "BodyHood", at: [0, 0.87, 1.17], axis: [1, 0, 0], open: -0.72 },
  steerL: { node: "WheelFrontL", at: [0.975, 0.384, 1.486], axis: [0, 1, 0], open: 0.42 },
  steerR: { node: "WheelFrontR", at: [-0.977, 0.384, 1.484], axis: [0, 1, 0], open: 0.42 },
} as const;
export type HingeId = keyof typeof HINGES;

interface Hinge {
  pivot: THREE.Group;
  axis: THREE.Vector3;
  open: number;
  value: number;
}

interface Paintable {
  mesh: THREE.Mesh;
  panel: string | null;
  base: THREE.Material;
  /** Material index per variant, from KHR_materials_variants. */
  variants: Map<number, number>;
}

/** Calm the flake normal maps (they shimmer at a distance) and brush the chrome rims. */
function tune(m: THREE.Material) {
  const p = m as THREE.MeshPhysicalMaterial;
  if (/^Paint/.test(m.name) && p.normalMap) p.normalScale.set(0.12, 0.12);
  if (m.name === "Rim2") {
    p.color.set("#b9bdc4");
    p.roughness = 0.28;
  }
  return m;
}

/** Builds pivots once per loaded model; holds the animated state outside React. */
class Rig {
  hinges = new Map<HingeId, Hinge>();
  paintable: Paintable[] = [];
  variantNames: string[] = [];
  lift = 0;
  group: THREE.Group | null = null;
  private shown = false;

  hold(g: THREE.Group | null) {
    this.group = g;
  }

  /** True once, on the first frame the car is drawn. */
  firstFrame() {
    if (this.shown) return false;
    this.shown = true;
    return true;
  }
  damage = new THREE.MeshPhysicalMaterial({ color: "#e8a13a", metalness: 0.35, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.08 });
  /** Tinted glass without the transmission pass: same look on every GPU, and cheaper. */
  glass = new THREE.MeshPhysicalMaterial({ color: "#0c1014", metalness: 0, roughness: 0.04, transparent: true, opacity: 0.42, envMapIntensity: 1.6, depthWrite: false });

  constructor(gltf: GLTF) {
    const scene = gltf.scene;
    scene.updateMatrixWorld(true);
    for (const [id, h] of Object.entries(HINGES) as [HingeId, (typeof HINGES)[HingeId]][]) {
      const node = scene.getObjectByName(h.node);
      const parent = node?.parent;
      if (!node || !parent) continue;
      const pivot = new THREE.Group();
      pivot.name = `${h.node}Hinge`;
      parent.add(pivot);
      pivot.position.copy(parent.worldToLocal(new THREE.Vector3(...h.at)));
      pivot.updateMatrixWorld(true);
      pivot.attach(node);
      // the axis in the parent's own frame (the model is authored Z-up)
      const inv = parent.getWorldQuaternion(new THREE.Quaternion()).invert();
      this.hinges.set(id, { pivot, axis: new THREE.Vector3(...h.axis).applyQuaternion(inv).normalize(), open: h.open, value: 0 });
    }
    const ext = (gltf.userData?.gltfExtensions as Record<string, { variants?: { name: string }[] }> | undefined)?.KHR_materials_variants;
    this.variantNames = ext?.variants?.map((v) => v.name) ?? [];
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      const map = (mesh.userData.gltfExtensions as Record<string, { mappings?: { material: number; variants: number[] }[] }> | undefined)?.KHR_materials_variants;
      const variants = new Map<number, number>();
      map?.mappings?.forEach((m) => m.variants.forEach((v) => variants.set(v, m.material)));
      let mat = mesh.material as THREE.Material;
      if (mat.name === "Glass") {
        mesh.material = mat = this.glass;
        mesh.renderOrder = 2;
      }
      tune(mat);
      let panel: string | null = null;
      if (/^Paint/.test(mat.name)) {
        for (let p: THREE.Object3D | null = mesh; p; p = p.parent)
          if (PANELS[p.name]) {
            panel = p.name;
            break;
          }
      }
      if (variants.size || panel) this.paintable.push({ mesh, panel, base: mat, variants });
    });
  }

  /** Swap every mapped material to a variant (null restores the originals), keeping damaged panels amber. */
  async paint(parser: GLTFParser, variant: number | null, damaged: Set<string>) {
    for (const p of this.paintable) {
      const idx = variant == null ? undefined : p.variants.get(variant);
      const mat = idx == null ? p.base : tune((await parser.getDependency("material", idx)) as THREE.Material);
      p.mesh.material = p.panel && damaged.has(p.panel) ? this.damage : mat;
    }
  }

  step(targets: Partial<Record<HingeId, boolean>>, lifted: boolean, dt: number) {
    let moving = false;
    for (const [id, h] of this.hinges) {
      const goal = targets[id] ? h.open : 0;
      const next = THREE.MathUtils.damp(h.value, goal, 4.2, dt);
      if (Math.abs(next - goal) > 1e-4) moving = true;
      h.value = Math.abs(next - goal) < 1e-4 ? goal : next;
      h.pivot.quaternion.setFromAxisAngle(h.axis, h.value);
    }
    const lift = THREE.MathUtils.damp(this.lift, lifted ? 1 : 0, 2.6, dt);
    this.lift = Math.abs(lift - (lifted ? 1 : 0)) < 1e-4 ? (lifted ? 1 : 0) : lift;
    if (this.group) this.group.position.y = this.lift * LIFT_HEIGHT;
    return moving || this.lift !== (lifted ? 1 : 0);
  }
}

/** One rig per loaded model, so remounts don't hinge the doors twice. */
const rigFor = (gltf: GLTF) => (gltf.scene.userData.rig ??= new Rig(gltf)) as Rig;

export const LIFT_HEIGHT = 1.45;

/** A stamped VIN tag on the dash, driver's side, readable through the windscreen. */
function VinTag({ vin }: { vin: string }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 160;
    const g = c.getContext("2d")!;
    const grad = g.createLinearGradient(0, 0, 0, 160);
    grad.addColorStop(0, "#c9ccd1");
    grad.addColorStop(1, "#9ea3aa");
    g.fillStyle = grad;
    g.fillRect(0, 0, 1024, 160);
    g.fillStyle = "#1d2026";
    g.font = "600 30px ui-monospace, Menlo, monospace";
    g.fillText("VEHICLE IDENTIFICATION NUMBER", 36, 44);
    g.font = "700 74px ui-monospace, Menlo, monospace";
    (g as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "4px";
    g.fillText(vin.padEnd(17, "·").slice(0, 17), 36, 128, 952);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [vin]);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh position={[0.42, 0.845, 1.5]} rotation={[-Math.PI / 2 + 0.32, 0, 0]}>
      <planeGeometry args={[0.32, 0.05]} />
      <meshStandardMaterial map={tex} metalness={0.6} roughness={0.35} />
    </mesh>
  );
}

export default function CarModel({
  variant,
  open,
  lifted,
  damaged,
  marking,
  vin,
  onPanel,
  onLoaded,
  children,
}: {
  variant: number | null;
  open: Partial<Record<HingeId, boolean>>;
  lifted: boolean;
  damaged: Set<string>;
  marking: boolean;
  vin: string;
  onPanel?: (panel: string) => void;
  onLoaded?: () => void;
  children?: React.ReactNode;
}) {
  const gltf = useGLTF(CAR_URL) as unknown as GLTF;
  const [rig] = useState(() => rigFor(gltf));
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") (window as unknown as { __car: unknown }).__car = gltf;
  }, [gltf]);

  useEffect(() => {
    rig.paint(gltf.parser, variant, damaged);
  }, [rig, gltf, variant, damaged]);

  useFrame(() => {
    if (rig.firstFrame()) requestAnimationFrame(() => onLoaded?.());
  });

  useEffect(() => {
    document.body.style.cursor = hover && marking ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hover, marking]);

  useFrame((state, dt) => {
    const moving = rig.step(open, lifted, Math.min(dt, 1 / 20));
    if (moving) state.invalidate();
  });

  const panelOf = (e: ThreeEvent<PointerEvent | MouseEvent>) =>
    rig.paintable.find((p) => p.mesh === e.object)?.panel ?? null;

  return (
    <group ref={(g) => rig.hold(g)}>
      <primitive
        object={gltf.scene}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          if (!marking) return;
          const p = panelOf(e);
          if (!p) return;
          e.stopPropagation();
          onPanel?.(p);
        }}
        onPointerMove={(e: ThreeEvent<PointerEvent>) => marking && setHover(!!panelOf(e))}
        onPointerOut={() => setHover(false)}
      />
      <VinTag vin={vin} />
      {children}
    </group>
  );
}

useGLTF.preload(CAR_URL);
