"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, FlipVertical2, Volume2, VolumeX } from "lucide-react";
import Car from "./Car";
import Race, { Hud, type Controls } from "./Race";
import { PAINTS, SYSTEMS, type SystemId } from "./systems";
import { useSound } from "@/components/desk/sound";
import { emit } from "@/components/fieldkit/events";

type Mode = "showroom" | "anatomy" | "race";

function Turntable({ flipped, spin, children }: { flipped: boolean; spin: boolean; children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  const flip = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (g.current && spin) g.current.rotation.y += dt * 0.18;
    if (flip.current) flip.current.rotation.x += ((flipped ? Math.PI : 0) - flip.current.rotation.x) * Math.min(1, dt * 3);
  });
  return (
    <group ref={g}>
      <group position={[0, 0.78, 0]}>
        <group ref={flip}>
          <group position={[0, -0.78, 0]}>{children}</group>
        </group>
      </group>
    </group>
  );
}

function Studio() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 7, 3]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[-5, 2, 2]} rotation={[0, Math.PI / 2, 0]} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[5, 2, -2]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 2, 1]} />
        <Lightformer form="ring" color="#ffb38a" intensity={1.5} position={[0, 1, -6]} scale={3} />
      </Environment>
    </>
  );
}

export default function CarLab() {
  const [mode, setMode] = useState<Mode>("showroom");
  const [paint, setPaint] = useState(PAINTS[0].hex);
  const [flipped, setFlipped] = useState(false);
  const [explode, setExplode] = useState(0);
  const [focus, setFocus] = useState<SystemId | null>(null);
  const [step, setStep] = useState(0);
  const [touched, setTouched] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const [sound, setSound] = useSound();
  const reduce = useReducedMotion();
  const controls = useRef<Controls>({ up: false, down: false, left: false, right: false });
  const [hud] = useState(() => new Hud());
  const { bindSpeed, bindTime } = hud;
  const sys = SYSTEMS.find((s) => s.id === focus) ?? null;

  // steps advance on their own; the visitor can step through by hand
  useEffect(() => {
    if (!sys) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % sys.steps.length), 3600);
    return () => window.clearInterval(id);
  }, [sys, step]);

  // keyboard driving
  useEffect(() => {
    if (mode !== "race") return;
    const map: Record<string, keyof Controls> = { ArrowUp: "up", w: "up", W: "up", ArrowDown: "down", s: "down", S: "down", ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right" };
    const set = (on: boolean) => (e: KeyboardEvent) => {
      const k = map[e.key];
      if (!k) return;
      e.preventDefault();
      controls.current[k] = on;
    };
    const down = set(true);
    const up = set(false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      controls.current = { up: false, down: false, left: false, right: false };
    };
  }, [mode]);

  const pick = (id: SystemId) => {
    setFocus((f) => (f === id ? null : id));
    setStep(0);
    emit("kit", "car.system", id);
  };

  const pedal = (k: keyof Controls, label: string, cls: string) => (
    <button
      type="button"
      aria-label={label}
      className={`pointer-events-auto select-none touch-none w-14 h-14 rounded-2xl bg-white/15 backdrop-blur text-white text-[20px] active:bg-white/30 ${cls}`}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        controls.current[k] = true;
      }}
      onPointerUp={() => (controls.current[k] = false)}
      onPointerCancel={() => (controls.current[k] = false)}
    >
      {label === "Accelerate" ? "▲" : label === "Brake" ? "▼" : label === "Steer left" ? "◀" : "▶"}
    </button>
  );

  const best = laps.length ? Math.min(...laps) : null;

  return (
    <div className="theme-fixed rounded-2xl overflow-hidden bg-[#111214] text-white">
      <div className="flex flex-wrap items-center gap-2 px-3 py-3 border-b border-white/10">
        <div className="inline-flex rounded-full bg-white/[0.07] p-1" role="tablist" aria-label="Mode">
          {(["showroom", "anatomy", "race"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => {
                setMode(m);
                if (m !== "anatomy") {
                  setFocus(null);
                  setExplode(0);
                }
                if (m === "race") emit("kit", "car.race", "started");
              }}
              className={`px-4 h-9 rounded-full text-[13.5px] ${mode === m ? "bg-white text-black" : "text-white/70 hover:text-white"}`}
            >
              {m === "anatomy" ? "How it works" : m === "race" ? "Race" : "Showroom"}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {PAINTS.map((p) => (
            <button
              key={p.hex}
              type="button"
              aria-label={`Paint: ${p.name}`}
              aria-pressed={paint === p.hex}
              onClick={() => setPaint(p.hex)}
              className={`w-7 h-7 rounded-full border-2 ${paint === p.hex ? "border-white" : "border-white/20"}`}
              style={{ background: p.hex }}
            />
          ))}
          {mode === "race" && (
            <button type="button" onClick={() => setSound(!sound)} aria-pressed={sound} className="ml-1 inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-white/[0.07] text-[13px]">
              {sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              {sound ? "Engine on" : "Engine off"}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="relative h-[62svh] min-h-[440px] max-h-[760px]" onPointerDown={() => setTouched(true)}>
          <Canvas shadows dpr={[1, 1.75]} camera={{ position: [5.6, 2.6, 6.2], fov: 38 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
            <color attach="background" args={[mode === "race" ? "#9cc3d9" : "#111214"]} />
            {mode === "race" && <fog attach="fog" args={["#9cc3d9", 40, 140]} />}
            <Suspense fallback={null}>
              <Studio />
              {mode === "race" ? (
                <Race controls={controls} paint={paint} hud={hud} onLap={(ms) => setLaps((l) => [...l, ms].slice(-5))} />
              ) : (
                <>
                  <Turntable flipped={flipped} spin={mode === "showroom" && !touched && !reduce}>
                    <Car paint={paint} explode={mode === "anatomy" ? explode : 0} focus={mode === "anatomy" ? focus : null} step={step} />
                  </Turntable>
                  <ContactShadows position={[0, 0, 0]} opacity={0.55} scale={9} blur={2.4} far={2} />
                  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
                    <circleGeometry args={[6, 64]} />
                    <meshStandardMaterial color="#1a1b1e" roughness={0.9} />
                  </mesh>
                  <OrbitControls enablePan={false} minDistance={3.5} maxDistance={12} maxPolarAngle={Math.PI / 2 - 0.04} target={[0, 0.7, 0]} enableDamping />
                </>
              )}
            </Suspense>
          </Canvas>

          {mode === "showroom" && (
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <p className="rounded-full bg-black/55 px-3.5 py-2 text-[12.5px] text-white/85">Drag to turn it. Scroll or pinch to zoom.</p>
              <button type="button" onClick={() => { setFlipped((f) => !f); emit("kit", "car.flipped", "showroom"); }} className="pointer-events-auto inline-flex items-center gap-2 h-10 px-4 rounded-full bg-white text-black text-[13.5px] font-medium">
                <FlipVertical2 className="w-4 h-4" /> {flipped ? "Turn it back" : "Flip it"}
              </button>
            </div>
          )}

          {mode === "race" && (
            <>
              <div className="absolute top-3 left-3 rounded-xl bg-black/60 px-4 py-2.5 font-mono tabular-nums">
                <p className="text-[26px] leading-none">
                  <span ref={bindSpeed}>0</span>
                  <span className="text-[12px] text-white/60"> km/h</span>
                </p>
                <p className="mt-1 text-[12px] text-white/70">
                  Lap <span ref={bindTime}>0.0</span>s{best != null && <> · best {(best / 1000).toFixed(1)}s</>}
                </p>
              </div>
              <p className="hidden md:block absolute top-3 right-3 rounded-full bg-black/55 px-3.5 py-2 text-[12.5px]">Arrow keys or WASD</p>
              <div className="md:hidden absolute inset-x-3 bottom-3 flex justify-between pointer-events-none">
                <div className="flex gap-2">
                  {pedal("left", "Steer left", "")}
                  {pedal("right", "Steer right", "")}
                </div>
                <div className="flex gap-2">
                  {pedal("down", "Brake", "")}
                  {pedal("up", "Accelerate", "bg-[var(--accent)]/80")}
                </div>
              </div>
            </>
          )}
        </div>

        {/* side panel */}
        <aside className="border-t lg:border-t-0 lg:border-l border-white/10 p-4 lg:max-h-[760px] lg:overflow-y-auto">
          {mode === "anatomy" ? (
            <>
              <label className="block">
                <span className="flex justify-between text-[13px]">
                  <span className="text-white/70">Take it apart</span>
                  <span className="tabular-nums">{Math.round(explode * 100)}%</span>
                </span>
                <input type="range" min={0} max={1} step={0.01} value={explode} onChange={(e) => setExplode(Number(e.target.value))} onPointerUp={() => explode > 0.5 && emit("kit", "car.exploded", "anatomy")} className="mt-1 w-full accent-[var(--accent)]" />
              </label>
              <ul className="mt-4 grid grid-cols-2 lg:grid-cols-1 gap-1.5">
                {SYSTEMS.map((s) => (
                  <li key={s.id}>
                    <button type="button" aria-pressed={focus === s.id} onClick={() => pick(s.id)} className={`w-full text-left rounded-xl border px-3 py-2.5 transition-colors ${focus === s.id ? "border-[var(--accent)] bg-[var(--accent)]/10" : "border-white/10 hover:border-white/30"}`}>
                      <span className="block text-[13.5px] font-medium">{s.name}</span>
                      <span className="hidden lg:block text-[12px] text-white/50">{s.summary}</span>
                    </button>
                  </li>
                ))}
              </ul>
              {sys && (
                <div className="mt-4 rounded-xl bg-white/[0.05] p-4" aria-live="polite">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] text-white/50 tabular-nums">
                      Step {step + 1} of {sys.steps.length}
                    </p>
                    <div className="flex gap-1">
                      <button type="button" aria-label="Previous step" onClick={() => setStep((s) => (s - 1 + sys.steps.length) % sys.steps.length)} className="w-8 h-8 rounded-lg bg-white/10 grid place-items-center">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button type="button" aria-label="Next step" onClick={() => setStep((s) => (s + 1) % sys.steps.length)} className="w-8 h-8 rounded-lg bg-white/10 grid place-items-center">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-[14.5px] leading-relaxed">{sys.steps[step]}</p>
                  <div className="mt-3 flex gap-1">
                    {sys.steps.map((_, i) => (
                      <span key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-[var(--accent)]" : "bg-white/15"}`} />
                    ))}
                  </div>
                </div>
              )}
              {!sys && <p className="mt-4 text-[13px] text-white/50">Pick a system to see it on its own, step by step.</p>}
            </>
          ) : mode === "race" ? (
            <div>
              <p className="font-medium">One lap of the oval</p>
              <p className="mt-1 text-[13px] text-white/60">Off the tarmac the laterite slows you down. The brakes glow when you lean on them.</p>
              <ol className="mt-4 space-y-1 font-mono text-[13px] tabular-nums">
                {laps.length === 0 && <li className="text-white/40">No laps yet.</li>}
                {laps.map((l, i) => (
                  <li key={i} className={`flex justify-between ${l === best ? "text-[var(--accent)]" : "text-white/75"}`}>
                    <span>Lap {i + 1}</span>
                    <span>{(l / 1000).toFixed(2)}s</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <div>
              <p className="font-medium">A car in the round</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-white/65">
                Built in code from separate parts: panels, frame, engine, brakes, springs, pipes and seats. Flip it to see the underside, then open How it works to take it apart.
              </p>
              <button type="button" onClick={() => { setMode("anatomy"); setExplode(0.6); }} className="mt-4 h-10 px-4 rounded-full bg-white text-black text-[13.5px] font-medium">
                Take it apart
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
