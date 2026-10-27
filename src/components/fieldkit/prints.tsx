/**
 * Procedural textile prints as SVG <pattern>s, garment silhouettes, and the
 * cloth filters (weave noise, drape warp, fold shading) that make flat
 * patterns read as fabric. No image assets.
 */

export type PrintId = "kente" | "adinkra" | "wax" | "bogolan" | "adire";
export type GarmentId = "kaftan" | "boubou" | "shirtdress" | "socks";

export interface Colourway {
  name: string;
  c: string[];
}

export const PRINTS: { id: PrintId; name: string; origin: string; ways: Colourway[] }[] = [
  {
    id: "kente",
    name: "Kente",
    origin: "Asante strip weave",
    ways: [
      { name: "Bonwire gold", c: ["#1a1410", "#e9b434", "#1f7a46", "#c0392b"] },
      { name: "Royal", c: ["#141b3a", "#e9b434", "#2c5fb0", "#9b2335"] },
      { name: "Ewe dusk", c: ["#2b1d14", "#d9a441", "#5c8a3a", "#7b3fa0"] },
    ],
  },
  {
    id: "adinkra",
    name: "Adinkra",
    origin: "Sankofa + Adinkrahene stamps",
    ways: [
      { name: "Funeral red", c: ["#8e2a1e", "#140d0a", "#b8432f"] },
      { name: "Undyed", c: ["#e8dcc6", "#1c1612", "#cdbd9f"] },
      { name: "Kuntunkuni", c: ["#2a2320", "#d8c7a6", "#3a302b"] },
    ],
  },
  {
    id: "wax",
    name: "Wax print",
    origin: "Dutch-wax bubbles & leaves",
    ways: [
      { name: "Indigo flame", c: ["#1d2f6f", "#ff6a2b", "#f3c623", "#1fa595"] },
      { name: "Lagos lime", c: ["#0f3d2e", "#c6e04b", "#ff8fb1", "#f6efe2"] },
      { name: "Hibiscus", c: ["#7a1238", "#ffb703", "#fb5607", "#ffe8d6"] },
    ],
  },
  {
    id: "bogolan",
    name: "Bogolan",
    origin: "Malian mudcloth",
    ways: [
      { name: "River mud", c: ["#3b2a1d", "#efe3cc"] },
      { name: "Rust", c: ["#7a3a1c", "#f2e6d0"] },
    ],
  },
  {
    id: "adire",
    name: "Adire",
    origin: "Yoruba indigo resist",
    ways: [
      { name: "Deep indigo", c: ["#142449", "#8fb3e8", "#2a4a8a"] },
      { name: "Faded", c: ["#2d4d7a", "#dfe9f7", "#46699d"] },
    ],
  },
];

export function PrintPattern({ id, print, c, scale = 1 }: { id: string; print: PrintId; c: string[]; scale?: number }) {
  const t = `scale(${scale})`;
  switch (print) {
    case "kente": {
      const [bg, a, b, r] = c;
      const stripesH = [a, b, a, r, bg, a, b];
      return (
        <pattern id={id} width={48} height={48} patternUnits="userSpaceOnUse" patternTransform={t}>
          <rect width={48} height={48} fill={bg} />
          {/* warp-faced block */}
          {stripesH.map((col, i) => (
            <rect key={`h${i}`} x={0} y={i * 3.4} width={24} height={2.6} fill={col} />
          ))}
          {stripesH.map((col, i) => (
            <rect key={`h2${i}`} x={24} y={24 + i * 3.4} width={24} height={2.6} fill={col} />
          ))}
          {/* weft-faced block */}
          {stripesH.map((col, i) => (
            <rect key={`v${i}`} x={24 + i * 3.4} y={0} width={2.6} height={24} fill={col} />
          ))}
          {stripesH.map((col, i) => (
            <rect key={`v2${i}`} x={i * 3.4} y={24} width={2.6} height={24} fill={col} />
          ))}
          {/* strip seams and float motifs */}
          <rect x={0} y={23} width={48} height={2} fill={bg} opacity={0.9} />
          <rect x={10} y={10} width={4} height={4} fill={r} transform="rotate(45 12 12)" />
          <rect x={34} y={34} width={4} height={4} fill={a} transform="rotate(45 36 36)" />
        </pattern>
      );
    }
    case "adinkra": {
      const [ground, ink, band] = c;
      return (
        <pattern id={id} width={44} height={44} patternUnits="userSpaceOnUse" patternTransform={t}>
          <rect width={44} height={44} fill={ground} />
          {/* stitched bands between stamped panels */}
          <rect x={0} y={42} width={44} height={2} fill={band} />
          <rect x={42} y={0} width={2} height={44} fill={band} />
          <path d="M0 43 h44" stroke={ink} strokeWidth={0.6} strokeDasharray="2 2" opacity={0.6} />
          {/* Adinkrahene: concentric rings */}
          <g fill="none" stroke={ink} opacity={0.88}>
            <circle cx={11} cy={11} r={8} strokeWidth={1.6} />
            <circle cx={11} cy={11} r={5} strokeWidth={1.6} />
            <circle cx={11} cy={11} r={2} strokeWidth={1.6} />
          </g>
          {/* Sankofa heart with curls */}
          <g fill={ink} opacity={0.88} transform="translate(22 22)">
            <path d="M11 18 C3 12 1.5 6 6 4 C8.5 3 11 5 11 7 C11 5 13.5 3 16 4 C20.5 6 19 12 11 18 Z" />
            <circle cx={7.5} cy={2.2} r={1.4} />
            <circle cx={14.5} cy={2.2} r={1.4} />
            <path d="M11 18 v3" stroke={ink} strokeWidth={1.4} />
          </g>
          <g opacity={0.45} fill={ink}>
            <circle cx={33} cy={11} r={1.2} />
            <circle cx={11} cy={33} r={1.2} />
          </g>
        </pattern>
      );
    }
    case "wax": {
      const [bg, big, dot, leaf] = c;
      return (
        <pattern id={id} width={64} height={64} patternUnits="userSpaceOnUse" patternTransform={t}>
          <rect width={64} height={64} fill={bg} />
          <ellipse cx={18} cy={46} rx={13} ry={5} fill={leaf} transform="rotate(-35 18 46)" />
          <ellipse cx={50} cy={14} rx={11} ry={4.5} fill={leaf} transform="rotate(25 50 14)" />
          <path d="M8 54 L28 38" stroke={bg} strokeWidth={1} opacity={0.7} />
          <circle cx={22} cy={18} r={13} fill={big} />
          <circle cx={22} cy={18} r={8.5} fill="none" stroke={bg} strokeWidth={2.4} />
          <circle cx={22} cy={18} r={3.5} fill={dot} />
          <circle cx={50} cy={44} r={9} fill={big} />
          <circle cx={50} cy={44} r={5} fill={dot} />
          {[
            [6, 6],
            [40, 28],
            [58, 58],
            [34, 58],
            [60, 26],
            [4, 30],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={2} fill={dot} />
          ))}
          {/* wax crackle */}
          <path d="M0 33 Q16 30 30 36 T64 31" stroke={dot} strokeWidth={0.5} fill="none" opacity={0.35} />
        </pattern>
      );
    }
    case "bogolan": {
      const [mud, chalk] = c;
      return (
        <pattern id={id} width={40} height={40} patternUnits="userSpaceOnUse" patternTransform={t}>
          <rect width={40} height={40} fill={mud} />
          <path d="M0 6 l5 -4 l5 4 l5 -4 l5 4 l5 -4 l5 4 l5 -4 l5 4" stroke={chalk} strokeWidth={1.4} fill="none" />
          <path d="M0 9 h40" stroke={chalk} strokeWidth={0.8} />
          {[4, 12, 20, 28, 36].map((x) => (
            <circle key={x} cx={x} cy={15} r={1.3} fill={chalk} />
          ))}
          <g stroke={chalk} strokeWidth={1.6}>
            <path d="M6 22 l8 8 M14 22 l-8 8" />
            <path d="M26 22 l8 8 M34 22 l-8 8" />
          </g>
          <rect x={17} y={21} width={6} height={10} fill="none" stroke={chalk} strokeWidth={1.1} />
          <path d="M0 35 h40" stroke={chalk} strokeWidth={0.8} strokeDasharray="3 2" />
        </pattern>
      );
    }
    case "adire": {
      const [indigo, resist, mid] = c;
      return (
        <pattern id={id} width={44} height={44} patternUnits="userSpaceOnUse" patternTransform={t}>
          <rect width={44} height={44} fill={indigo} />
          <rect x={0} y={0} width={22} height={22} fill={mid} opacity={0.55} />
          <rect x={22} y={22} width={22} height={22} fill={mid} opacity={0.55} />
          <g fill="none" stroke={resist} opacity={0.85}>
            <circle cx={11} cy={11} r={7.5} strokeWidth={1.2} strokeDasharray="1.5 1.8" />
            <circle cx={11} cy={11} r={3.5} strokeWidth={1.4} />
            <path d="M25 26 q4 -4 8 0 t8 0 M25 32 q4 -4 8 0 t8 0 M25 38 q4 -4 8 0 t8 0" strokeWidth={1.1} />
          </g>
          <g fill={resist} opacity={0.8}>
            {[
              [30, 6],
              [36, 12],
              [30, 18],
              [6, 30],
              [12, 36],
              [18, 30],
              [12, 30],
              [36, 6],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={1.1} />
            ))}
          </g>
        </pattern>
      );
    }
  }
}

/* ---------- garments ---------- */

export const GARMENTS: {
  id: GarmentId;
  name: string;
  /** Prices set per market (not converted). */
  price: { USD: number; GHS: number };
  paths: string[];
  seams: string[];
  scale: number;
}[] = [
  {
    id: "kaftan",
    name: "Kaftan",
    price: { USD: 120, GHS: 1350 },
    paths: ["M82 18 Q100 44 118 18 L150 24 L196 92 L178 114 L146 86 L152 250 L48 250 L54 86 L22 114 L4 92 L50 24 Z"],
    seams: ["M54 86 L50 24", "M146 86 L150 24", "M100 34 L100 96", "M52 236 L148 236"],
    scale: 1,
  },
  {
    id: "boubou",
    name: "Boubou",
    price: { USD: 160, GHS: 1800 },
    paths: ["M84 14 Q100 36 116 14 L142 20 Q190 80 198 198 L160 204 L166 252 L34 252 L40 204 L2 198 Q10 80 58 20 Z"],
    seams: ["M40 204 Q100 214 160 204", "M86 30 Q100 52 114 30", "M36 240 L164 240"],
    scale: 1.15,
  },
  {
    id: "shirtdress",
    name: "Shirt dress",
    price: { USD: 95, GHS: 1050 },
    paths: [
      "M86 14 L100 30 L114 14 L140 22 L170 56 L153 72 L138 60 L134 122 Q136 128 132 132 L164 240 Q100 252 36 240 L68 132 Q64 128 66 122 L62 60 L47 72 L30 56 L60 22 Z",
    ],
    seams: ["M100 30 L100 128", "M66 126 Q100 134 134 126", "M62 60 L60 22", "M138 60 L140 22", "M40 230 Q100 242 160 230"],
    scale: 0.85,
  },
  {
    id: "socks",
    name: "Kente socks",
    price: { USD: 18, GHS: 180 },
    paths: [
      "M30 16 L74 16 L74 150 Q74 168 94 180 L124 196 Q148 210 136 234 Q126 252 100 244 L44 212 Q30 204 32 188 Z",
      "M110 6 L154 6 L154 128 Q154 146 172 156 L188 166 Q204 180 194 204 Q184 222 160 214 L124 192 Q110 184 112 168 Z",
    ],
    seams: ["M30 32 L74 32", "M110 22 L154 22", "M96 182 Q116 210 104 244", "M174 158 Q192 182 180 216"],
    scale: 0.7,
  },
];

/** Fabric filters: fine weave noise + a gentle drape warp. */
export function ClothFilters({ id }: { id: string }) {
  return (
    <>
      <filter id={`${id}-drape`} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves={2} seed={4} result="warp" />
        <feDisplacementMap in="SourceGraphic" in2="warp" scale={9} xChannelSelector="R" yChannelSelector="G" result="draped" />
        <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves={2} seed={9} result="grain" />
        <feColorMatrix
          in="grain"
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.42 0 0 0 -0.12"
          result="weave"
        />
        <feComposite in="weave" in2="draped" operator="in" result="weaveIn" />
        <feMerge>
          <feMergeNode in="draped" />
          <feMergeNode in="weaveIn" />
        </feMerge>
      </filter>
      <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx={0} dy={10} stdDeviation={9} floodColor="#000" floodOpacity={0.55} />
      </filter>
      <linearGradient id={`${id}-folds`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stopColor="#000" stopOpacity={0.42} />
        <stop offset="12%" stopColor="#000" stopOpacity={0.06} />
        <stop offset="24%" stopColor="#fff" stopOpacity={0.1} />
        <stop offset="36%" stopColor="#000" stopOpacity={0.22} />
        <stop offset="50%" stopColor="#fff" stopOpacity={0.08} />
        <stop offset="62%" stopColor="#000" stopOpacity={0.2} />
        <stop offset="76%" stopColor="#fff" stopOpacity={0.12} />
        <stop offset="88%" stopColor="#000" stopOpacity={0.1} />
        <stop offset="100%" stopColor="#000" stopOpacity={0.45} />
      </linearGradient>
      <radialGradient id={`${id}-light`} cx="38%" cy="22%" r="80%">
        <stop offset="0%" stopColor="#fff" stopOpacity={0.16} />
        <stop offset="60%" stopColor="#fff" stopOpacity={0} />
        <stop offset="100%" stopColor="#000" stopOpacity={0.35} />
      </radialGradient>
    </>
  );
}
