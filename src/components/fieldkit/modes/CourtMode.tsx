"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Pause, Play, Printer, RotateCcw, Undo2 } from "lucide-react";
import { emit } from "../events";
import { usePrinter } from "../Receipt";

/**
 * Madina Basketball's live scorer, as used courtside at Libya Quarters:
 * scoreboard, clock, quarters and team fouls, with every basket credited to
 * a player. On top of the real tool's "who scored?", shots are placed on a
 * half court (2 or 3 is worked out from the spot), and the box score keeps
 * FG, 3PT and FT percentages live. Teams are public league names; players
 * are jersey numbers only.
 */

/* Half court in feet ×10: 50ft wide, 47ft deep, baseline at the top. */
const W = 500;
const H = 470;
const HOOP = { x: 250, y: 52 };
const CORNER_Y = 140;
const QUARTER = 10 * 60;
const ORANGE = "#ff6b35";
const BLUE = "#3b82f6";

type Side = "home" | "away";
type Kind = "FG" | "FT" | "REB" | "AST" | "STL" | "TO" | "PF";
interface Ev {
  id: number;
  side: Side;
  no: number;
  kind: Kind;
  made?: boolean;
  pts?: number;
  x?: number;
  y?: number;
  q: number;
  t: number;
}

const TEAMS: Record<Side, { name: string; short: string; color: string; roster: { no: number; pos: string }[] }> = {
  home: { name: "Madina Old Gees", short: "MOG", color: ORANGE, roster: [3, 7, 11, 23, 34].map((no, i) => ({ no, pos: ["G", "G", "F", "F", "C"][i] })) },
  away: { name: "Oyibi Eagles", short: "OYE", color: BLUE, roster: [2, 5, 9, 14, 21].map((no, i) => ({ no, pos: ["G", "G", "F", "F", "C"][i] })) },
};

function classify(x: number, y: number) {
  const d = Math.hypot(x - HOOP.x, y - HOOP.y) / 10;
  const corner = y < CORNER_Y && Math.abs(x - 250) > 220;
  return { d, three: corner || (y >= CORNER_Y && d > 23.75) };
}
const clock = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const pct = (m: number, a: number) => (a ? `${Math.round((m / a) * 100)}%` : "-");
const qLabel = (q: number) => (q <= 4 ? `Q${q}` : `OT${q - 4}`);

function CourtLines() {
  const s = "rgba(242,238,230,0.25)";
  return (
    <g fill="none" stroke={s} strokeWidth={2}>
      <rect x={1} y={1} width={W - 2} height={H - 2} />
      <rect x={170} y={0} width={160} height={190} />
      <circle cx={250} cy={190} r={60} />
      <path d={`M 210 ${HOOP.y} A 40 40 0 0 0 290 ${HOOP.y}`} />
      <path d={`M 30 0 L 30 ${CORNER_Y} A 237.5 237.5 0 0 0 470 ${CORNER_Y} L 470 0`} />
      <path d="M 190 470 A 60 60 0 0 1 310 470" />
      <line x1={220} x2={280} y1={40} y2={40} stroke="rgba(242,238,230,0.6)" strokeWidth={3} />
      <circle cx={HOOP.x} cy={HOOP.y} r={9} stroke={ORANGE} strokeWidth={2.5} />
    </g>
  );
}

function statLine(evs: Ev[], side: Side, no?: number) {
  const mine = evs.filter((e) => e.side === side && (no === undefined || e.no === no));
  const fg = mine.filter((e) => e.kind === "FG");
  const ft = mine.filter((e) => e.kind === "FT");
  const three = fg.filter((e) => e.pts === 3 || (e.made === false && e.x !== undefined && classify(e.x, e.y!).three));
  const n = (k: Kind) => mine.filter((e) => e.kind === k).length;
  return {
    pts: mine.reduce((a, e) => a + (e.made ? (e.pts ?? 0) : 0), 0),
    fgm: fg.filter((e) => e.made).length,
    fga: fg.length,
    tpm: three.filter((e) => e.made).length,
    tpa: three.length,
    ftm: ft.filter((e) => e.made).length,
    fta: ft.length,
    reb: n("REB"),
    ast: n("AST"),
    stl: n("STL"),
    to: n("TO"),
    pf: n("PF"),
  };
}

export default function CourtMode() {
  const reduce = useReducedMotion();
  const print = usePrinter();
  const svgRef = useRef<SVGSVGElement>(null);
  const seq = useRef(0);
  const [tab, setTab] = useState<"game" | "box">("game");
  const [evs, setEvs] = useState<Ev[]>([]);
  const [side, setSide] = useState<Side>("home");
  const [no, setNo] = useState<number>(TEAMS.home.roster[0].no);
  const [q, setQ] = useState(1);
  const [left, setLeft] = useState(QUARTER);
  const [running, setRunning] = useState(false);
  const [pending, setPending] = useState<{ x: number; y: number; three: boolean } | null>(null);
  const [final, setFinal] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [running]);
  // the clock stops itself at 0:00, like the real board
  if (running && left === 0) setRunning(false);

  const score = (s: Side) => evs.filter((e) => e.side === s && e.made).reduce((a, e) => a + (e.pts ?? 0), 0);
  const fouls = (s: Side) => evs.filter((e) => e.side === s && e.kind === "PF" && e.q === q).length;
  const byQuarter = useMemo(
    () => Array.from({ length: Math.max(4, q) }, (_, i) => ({ q: i + 1, home: evs.filter((e) => e.side === "home" && e.q === i + 1 && e.made).reduce((a, e) => a + (e.pts ?? 0), 0), away: evs.filter((e) => e.side === "away" && e.q === i + 1 && e.made).reduce((a, e) => a + (e.pts ?? 0), 0) })),
    [evs, q],
  );

  const log = (e: Omit<Ev, "id" | "q" | "t" | "side" | "no">) => {
    if (final) return;
    const ev: Ev = { ...e, id: ++seq.current, side, no, q, t: QUARTER - left };
    setEvs((all) => [...all, ev]);
    const who = `${TEAMS[side].short} #${no}`;
    if (e.kind === "FG" || e.kind === "FT") emit("court", e.made ? "shot.made" : "shot.missed", `${who} · ${e.kind === "FT" ? "FT" : e.pts === 3 ? "3PT" : "2PT"} · ${qLabel(q)} ${clock(left)}`);
    else emit("court", "stat", `${who} · ${e.kind} · ${qLabel(q)} ${clock(left)}`);
  };

  const place = (ev: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm || final) return;
    const p = new DOMPoint(ev.clientX, ev.clientY).matrixTransform(ctm.inverse());
    const x = Math.max(6, Math.min(W - 6, p.x));
    const y = Math.max(6, Math.min(H - 6, p.y));
    setPending({ x, y, three: classify(x, y).three });
  };
  const shot = (made: boolean) => {
    if (!pending) return;
    log({ kind: "FG", made, pts: pending.three ? 3 : 2, x: pending.x, y: pending.y });
    setPending(null);
  };

  const undo = () => setEvs((all) => all.slice(0, -1));
  const endQuarter = () => {
    setRunning(false);
    if (q >= 4 && score("home") !== score("away")) {
      setFinal(true);
      setTab("box");
      emit("court", "game.final", `${TEAMS.home.short} ${score("home")}-${score("away")} ${TEAMS.away.short}`);
      return;
    }
    setQ((v) => v + 1);
    setLeft(q >= 4 ? 5 * 60 : QUARTER);
  };
  const reset = () => {
    setEvs([]);
    setQ(1);
    setLeft(QUARTER);
    setRunning(false);
    setFinal(false);
    setTab("game");
  };

  const last = evs[evs.length - 1];
  const team = TEAMS[side];
  const shots = evs.filter((e) => e.kind === "FG" && e.side === side && e.x !== undefined);

  const printBox = () =>
    print({
      head: "Madina Basketball",
      sub: `${TEAMS.home.name} ${score("home")}, ${TEAMS.away.name} ${score("away")}${final ? " · final" : ` · ${qLabel(q)}`}`,
      lines: (["home", "away"] as Side[]).flatMap((s) => [
        { l: TEAMS[s].name.toUpperCase() },
        ...TEAMS[s].roster.map((p) => {
          const st = statLine(evs, s, p.no);
          return { l: `#${p.no} ${st.fgm}/${st.fga} FG, ${st.reb} REB, ${st.ast} AST`, r: `${st.pts} PTS` };
        }),
      ]),
      total: { l: "Final", r: `${score("home")} - ${score("away")}` },
      foot: ["Your Game. Your Stats. Your Community.", "madinabball.vercel.app/tools"],
    });

  return (
    <div className="@container absolute inset-0 flex flex-col bg-[#111827] text-white font-body select-none">
      {/* top bar */}
      <div className="h-[28px] shrink-0 flex items-center gap-2 px-2.5 border-b border-white/10 bg-[#0b1220]">
        <span className="text-[10px] font-bold tracking-[0.02em]">
          MADINA <span style={{ color: ORANGE }}>BASKETBALL</span>
        </span>
        <span className="hidden @[480px]:inline text-[8px] text-white/45">Live scoreboard · Libya Quarters court</span>
        <div className="ml-auto flex items-center gap-0.5 rounded-full bg-white/5 p-0.5" role="tablist">
          {(["game", "box"] as const).map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`h-[18px] px-2 rounded-full text-[8.5px] font-semibold ${tab === t ? "bg-white text-[#0b1220]" : "text-white/60 hover:text-white"}`}>
              {t === "game" ? "Game" : "Box score"}
            </button>
          ))}
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-1.5 h-[16px] text-[7.5px] font-bold ${final ? "bg-white/10 text-white/70" : "bg-red-600/90"}`}>
          {!final && <span className="w-1 h-1 rounded-full bg-white animate-pulse" />} {final ? "FINAL" : "LIVE"}
        </span>
      </div>

      {/* scoreboard */}
      <div className="shrink-0 grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-2.5 py-1.5 bg-black/60 border-b border-white/10">
        {(["home", "away"] as Side[]).map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setSide(s);
              setNo(TEAMS[s].roster[0].no);
            }}
            aria-pressed={side === s}
            className={`flex items-center gap-2 rounded-[10px] border-2 px-2 py-1 ${i === 1 ? "order-3 flex-row-reverse text-right" : ""} ${side === s ? "bg-white/[0.04]" : "border-transparent opacity-70 hover:opacity-100"}`}
            style={{ borderColor: side === s ? TEAMS[s].color : undefined }}
          >
            <span className="min-w-0">
              <span className="block text-[8.5px] font-semibold truncate" style={{ color: TEAMS[s].color }}>
                {TEAMS[s].name}
              </span>
              <span className="flex gap-0.5 mt-0.5" aria-label={`${fouls(s)} team fouls`}>
                {Array.from({ length: 5 }, (_, k) => (
                  <span key={k} className="w-1.5 h-1.5 rounded-full" style={{ background: k < fouls(s) ? "#ffd23f" : "rgba(255,255,255,0.15)" }} />
                ))}
                {fouls(s) >= 5 && <span className="ml-1 text-[7px] font-bold text-[#ffd23f]">BONUS</span>}
              </span>
            </span>
            <motion.span key={score(s)} initial={reduce ? false : { scale: 1.25 }} animate={{ scale: 1 }} className="ml-auto font-mono text-[28px] leading-none font-bold tabular-nums" style={{ color: TEAMS[s].color, textShadow: `0 0 12px ${TEAMS[s].color}66`, marginLeft: i === 1 ? 0 : "auto", marginRight: i === 1 ? "auto" : 0 }}>
              {score(s)}
            </motion.span>
          </button>
        ))}
        <div className="order-2 flex flex-col items-center gap-0.5">
          <span className={`font-mono text-[17px] font-bold tabular-nums leading-none ${left <= 60 ? "text-red-400" : left <= 120 ? "text-[#ffd23f]" : "text-emerald-400"}`}>{clock(left)}</span>
          <span className="flex items-center gap-1">
            <span className="rounded-full bg-white/10 px-1.5 text-[8px] font-bold">{qLabel(q)}</span>
            <button type="button" onClick={() => setRunning((r) => !r)} disabled={final || left === 0} aria-label={running ? "Pause the clock" : "Start the clock"} className="w-[18px] h-[18px] rounded-full bg-white/10 grid place-items-center disabled:opacity-30 hover:bg-white/20">
              {running ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
            </button>
          </span>
        </div>
      </div>

      {tab === "game" ? (
        <div className="flex-1 min-h-0 grid grid-cols-1 grid-rows-[minmax(0,1fr)_auto] @[480px]:grid-rows-1 @[480px]:grid-cols-[minmax(0,1fr)_178px]">
          {/* court: tap to place a shot */}
          <div className="relative min-h-0 p-2 flex items-start justify-center">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              onClick={place}
              className="max-w-full max-h-full cursor-crosshair rounded-[8px]"
              style={{ background: "linear-gradient(180deg, #1f2937, #111827)", aspectRatio: `${W} / ${H}` }}
              role="img"
              aria-label={`Half court for ${team.name}. Tap where #${no} shot from.`}
            >
              <CourtLines />
              {shots.map((s) =>
                s.made ? (
                  <circle key={s.id} cx={s.x} cy={s.y} r={9} fill={team.color} fillOpacity={s.no === no ? 0.95 : 0.4} />
                ) : (
                  <g key={s.id} stroke={s.no === no ? "rgba(242,238,230,0.75)" : "rgba(242,238,230,0.3)"} strokeWidth={3}>
                    <line x1={s.x! - 7} y1={s.y! - 7} x2={s.x! + 7} y2={s.y! + 7} />
                    <line x1={s.x! + 7} y1={s.y! - 7} x2={s.x! - 7} y2={s.y! + 7} />
                  </g>
                ),
              )}
              {pending && <circle cx={pending.x} cy={pending.y} r={14} fill="none" stroke="#ffd23f" strokeWidth={3} strokeDasharray="6 5" />}
              {!shots.length && !pending && (
                <text x={250} y={320} textAnchor="middle" fontSize={20} fill="rgba(242,238,230,0.4)" fontFamily="var(--font-mono)">
                  tap where #{no} shot from
                </text>
              )}
            </svg>
            <AnimatePresence>
              {pending && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute left-1/2 bottom-3 -translate-x-1/2 flex items-center gap-1 rounded-full bg-black/85 p-1 shadow-xl">
                  <span className="px-1.5 text-[8.5px] text-white/70">
                    #{no} · {pending.three ? "3PT" : "2PT"}
                  </span>
                  <button type="button" onClick={() => shot(true)} className="h-[22px] px-3 rounded-full text-[9px] font-bold text-white" style={{ background: team.color }}>
                    Made +{pending.three ? 3 : 2}
                  </button>
                  <button type="button" onClick={() => shot(false)} className="h-[22px] px-3 rounded-full bg-white/15 text-[9px] font-bold">
                    Missed
                  </button>
                  <button type="button" onClick={() => setPending(null)} aria-label="Cancel" className="h-[22px] w-[22px] rounded-full text-white/50 hover:text-white text-[10px]">
                    ✕
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* roster and the other stats */}
          <div className="min-h-0 flex flex-col gap-1.5 p-2 border-t @[480px]:border-t-0 @[480px]:border-l border-white/10 bg-[#0f172a]">
            <p className="text-[8px] uppercase tracking-[0.12em] text-white/45">{team.name}</p>
            <div className="grid grid-cols-5 @[480px]:grid-cols-1 gap-1">
              {team.roster.map((p) => {
                const st = statLine(evs, side, p.no);
                const on = p.no === no;
                return (
                  <button
                    key={p.no}
                    type="button"
                    onClick={() => setNo(p.no)}
                    aria-pressed={on}
                    className={`flex items-center gap-1.5 rounded-[8px] border px-1.5 py-1 text-left ${on ? "bg-white/10" : "border-white/10 hover:bg-white/5"}`}
                    style={{ borderColor: on ? team.color : undefined }}
                  >
                    <span className="w-[20px] h-[18px] rounded-[5px] grid place-items-center text-[8.5px] font-bold text-white" style={{ background: team.color }}>
                      {p.no}
                    </span>
                    <span className="hidden @[480px]:block text-[8px] text-white/45">{p.pos}</span>
                    <span className="ml-auto font-mono text-[9px] font-bold tabular-nums">{st.pts}</span>
                    <span className="hidden @[480px]:block w-[34px] text-right font-mono text-[7.5px] text-white/45 tabular-nums">
                      {st.fgm}/{st.fga}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="grid grid-cols-4 gap-1">
              {(
                [
                  ["FT", "FT ✓", { kind: "FT", made: true, pts: 1 }],
                  ["FTx", "FT ✗", { kind: "FT", made: false, pts: 1 }],
                  ["REB", "REB", { kind: "REB" }],
                  ["AST", "AST", { kind: "AST" }],
                  ["STL", "STL", { kind: "STL" }],
                  ["TO", "TO", { kind: "TO" }],
                  ["PF", "Foul", { kind: "PF" }],
                ] as const
              ).map(([k, label, ev]) => (
                <button key={k} type="button" onClick={() => log(ev as Omit<Ev, "id" | "q" | "t" | "side" | "no">)} disabled={final} className="h-[22px] rounded-[6px] bg-white/[0.07] text-[8.5px] font-semibold hover:bg-white/15 disabled:opacity-30">
                  {label}
                </button>
              ))}
              <button type="button" onClick={undo} disabled={!evs.length} className="h-[22px] rounded-[6px] bg-white/[0.07] text-[8.5px] font-semibold hover:bg-white/15 disabled:opacity-30 inline-flex items-center justify-center gap-0.5">
                <Undo2 className="w-2.5 h-2.5" /> Undo
              </button>
            </div>
            <p className="min-h-[14px] text-[8px] text-white/55 truncate" aria-live="polite">
              {last
                ? `${qLabel(last.q)} ${clock(QUARTER - last.t)} · ${TEAMS[last.side].short} #${last.no} ${last.kind === "FG" ? `${last.made ? "made" : "missed"} a ${last.pts === 3 ? "three" : "two"}` : last.kind === "FT" ? `${last.made ? "made" : "missed"} a free throw` : last.kind === "PF" ? "foul" : last.kind}`
                : "Pick a player, then tap the court or a stat."}
            </p>
            <button type="button" onClick={endQuarter} disabled={final} className="mt-auto h-[24px] rounded-[8px] bg-[#ffd23f] text-[#111827] text-[9px] font-bold disabled:opacity-40">
              {q >= 4 && score("home") !== score("away") ? "END GAME" : `END ${qLabel(q)} → NEXT`}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none p-2 space-y-2">
          <div className="flex items-center gap-1 text-[8px]">
            {byQuarter.map((b) => (
              <span key={b.q} className={`rounded-full px-1.5 py-0.5 tabular-nums ${b.q === q && !final ? "bg-white/15" : "bg-white/5 text-white/60"}`}>
                {qLabel(b.q)} {b.home}-{b.away}
              </span>
            ))}
            <span className="ml-auto inline-flex gap-1">
              <button type="button" onClick={printBox} className="inline-flex items-center gap-1 h-[18px] px-2 rounded-full bg-white/10 hover:bg-white/20">
                <Printer className="w-2.5 h-2.5" /> Print
              </button>
              <button type="button" onClick={reset} className="inline-flex items-center gap-1 h-[18px] px-2 rounded-full bg-white/10 hover:bg-white/20">
                <RotateCcw className="w-2.5 h-2.5" /> New game
              </button>
            </span>
          </div>
          {(["home", "away"] as Side[]).map((s) => {
            const tot = statLine(evs, s);
            return (
              <table key={s} className="w-full text-[8.5px] tabular-nums">
                <thead>
                  <tr className="text-white/45">
                    <th className="text-left font-semibold py-0.5" style={{ color: TEAMS[s].color }}>
                      {TEAMS[s].name}
                    </th>
                    {["PTS", "FG", "3PT", "FT", "REB", "AST", "STL", "TO", "PF"].map((h) => (
                      <th key={h} className="font-normal text-right px-1">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TEAMS[s].roster.map((p) => {
                    const st = statLine(evs, s, p.no);
                    return (
                      <tr key={p.no} className="border-t border-white/[0.06]">
                        <td className="py-0.5">
                          #{p.no} <span className="text-white/40">{p.pos}</span>
                        </td>
                        <td className="text-right px-1 font-bold">{st.pts}</td>
                        <td className="text-right px-1">{st.fgm}-{st.fga}</td>
                        <td className="text-right px-1">{st.tpm}-{st.tpa}</td>
                        <td className="text-right px-1">{st.ftm}-{st.fta}</td>
                        <td className="text-right px-1">{st.reb}</td>
                        <td className="text-right px-1">{st.ast}</td>
                        <td className="text-right px-1">{st.stl}</td>
                        <td className="text-right px-1">{st.to}</td>
                        <td className="text-right px-1">{st.pf}</td>
                      </tr>
                    );
                  })}
                  <tr className="border-t border-white/20 font-semibold">
                    <td className="py-0.5">Team</td>
                    <td className="text-right px-1">{tot.pts}</td>
                    <td className="text-right px-1">{pct(tot.fgm, tot.fga)}</td>
                    <td className="text-right px-1">{pct(tot.tpm, tot.tpa)}</td>
                    <td className="text-right px-1">{pct(tot.ftm, tot.fta)}</td>
                    <td className="text-right px-1">{tot.reb}</td>
                    <td className="text-right px-1">{tot.ast}</td>
                    <td className="text-right px-1">{tot.stl}</td>
                    <td className="text-right px-1">{tot.to}</td>
                    <td className="text-right px-1">{tot.pf}</td>
                  </tr>
                </tbody>
              </table>
            );
          })}
        </div>
      )}
    </div>
  );
}
