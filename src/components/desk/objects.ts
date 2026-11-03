import type { Quad } from "./quad";

/** Wide plate: /public/workspace/wide.webp (1536×864). All boxes and quads are fractions of it. */
export const PLATE = { src: "/workspace/wide.webp", ar: 1536 / 864 };

/** Screens on the desk: tri-screen laptop (left extender, laptop, right extender). TL, TR, BR, BL. */
export const SCREENS: Record<"left" | "center" | "right", Quad> = {
  left: [
    [0.1927, 0.2766],
    [0.377, 0.2766],
    [0.377, 0.4873],
    [0.1908, 0.4873],
  ],
  center: [
    [0.3939, 0.2662],
    [0.6042, 0.2662],
    [0.6055, 0.4919],
    [0.3913, 0.4919],
  ],
  right: [
    [0.6198, 0.2766],
    [0.806, 0.2766],
    [0.8067, 0.4884],
    [0.6198, 0.4884],
  ],
};

export type Box = [number, number, number, number]; // x0, y0, x1, y1
export type Action =
  | { kind: "theme" }
  | { kind: "scroll"; target: string; label: string }
  | { kind: "link"; href: string; label: string }
  | { kind: "phone" }
  | { kind: "desktop" };

export interface Stop {
  id: string;
  label: string;
  /** Object box on the wide plate; null = the wide establishing shot. */
  box: Box | null;
  /** Close-up "insert" shot, cut in while the camera holds on the object. */
  insert?: string;
  /** Which side the copy sits on (the object sits on the other). */
  copy: "left" | "right";
  eyebrow: string;
  title: string;
  body: string;
  action?: Action;
}

/**
 * The scroll tour of the workspace. Every object sells one thing to a remote client.
 * Copy uses only facts that live elsewhere on the site (projects.ts, contact, fieldkit).
 */
export const STOPS: Stop[] = [
  {
    id: "desk",
    label: "Desk",
    box: null,
    copy: "left",
    eyebrow: "Aadam · Forward-deployed engineer",
    title: "I embed with your team and ship the system you run on.",
    body: "Product, design, engineering, data and brand from one desk in Accra, for teams anywhere. Scroll the desk.",
  },
  {
    id: "lamp",
    label: "Remote",
    box: [0, 0.156, 0.19, 0.665],
    insert: "/workspace/lamp.webp",
    copy: "left",
    eyebrow: "Remote · GMT+0",
    title: "Day in Accra, morning in New York.",
    body: "GMT+0 overlaps the full European workday and US East mornings. Written specs, weekly demos, async by default. Flip the lamp for night mode.",
    action: { kind: "theme" },
  },
  {
    id: "notebook",
    label: "Field notes",
    box: [0, 0.708, 0.236, 0.897],
    insert: "/workspace/notebook.webp",
    copy: "left",
    eyebrow: "Forward deployed",
    title: "I sit in. I watch the work. I write it down.",
    body: "Before any code: shadowing the floor, mapping how money and stock really move, and documenting it so your team owns it after I leave.",
    action: { kind: "link", href: "/about#research", label: "Read my research notes" },
  },
  {
    id: "books",
    label: "Books",
    box: [0.005, 0.451, 0.177, 0.631],
    insert: "/workspace/books.webp",
    copy: "left",
    eyebrow: "How I think",
    title: "Read widely. Ship narrowly.",
    body: "Product, systems, sport and history live on this shelf.",
  },
  {
    id: "device",
    label: "Deployments",
    box: [0.203, 0.625, 0.281, 0.708],
    insert: "/workspace/device.webp",
    copy: "right",
    eyebrow: "Deployments",
    title: "Running in the field: counters, laundries, analysts.",
    body: "Point-of-sale, garment tracking and finance tools that real staff use all day. Play with them yourself just below.",
    action: { kind: "scroll", target: "#deployments", label: "Play with the field kit" },
  },
  {
    id: "phone",
    label: "Mobile",
    box: [0.806, 0.752, 0.911, 0.882],
    insert: "/workspace/phone.webp",
    copy: "right",
    eyebrow: "Mobile",
    title: "Built for the phone in your pocket.",
    body: "Native-feeling flows for the people on the floor and the customers at home. Pick it up and try a few.",
    action: { kind: "phone" },
  },
  {
    id: "brand",
    label: "Studio",
    box: [0.799, 0.431, 0.949, 0.752],
    insert: "/workspace/brand.webp",
    copy: "right",
    eyebrow: "Studio · Brand, product & motion",
    title: "Brands people want to photograph.",
    body: "Art direction, packaging, copy and motion. Bloom Boba's photoreal film is on the shelf; Yeskoko's packs are on the bench.",
    action: { kind: "scroll", target: "#studio", label: "Open the Studio" },
  },
  {
    id: "ball",
    label: "Off the clock",
    box: [0.911, 0.44, 1, 0.631],
    insert: "/workspace/ball.webp",
    copy: "right",
    eyebrow: "Off the clock",
    title: "Teamwork, learned on the court.",
    body: "I co-lead Madina Basketball: we raised GHS 40K+ for a solar-lit community court. Same instincts at work: show up, communicate, finish.",
    action: { kind: "link", href: "/work/madinabasketball", label: "See the court project" },
  },
  {
    id: "screens",
    label: "The desktop",
    box: null,
    copy: "left",
    eyebrow: "Aadam OS",
    title: "Pull up a chair.",
    body: "Every project is an app. Open it, watch it run, try the live site.",
    action: { kind: "desktop" },
  },
];
