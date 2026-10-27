"use client";

import * as THREE from "three";

/**
 * Every surface on the desk is painted on a canvas at runtime: no image
 * downloads, sharp at any size, and the same look in day and night.
 */

const cache = new Map<string, THREE.Texture>();

function make(key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void, srgb = true) {
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  cache.set(key, t);
  return t;
}

// deterministic pseudo-random so textures are identical every load
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Oiled iroko-style desk top: long grain, slow colour drift, a few pores. */
export function woodTexture() {
  return make("wood", 2048, 1024, (g, w, h) => {
    const r = rng(7);
    const grad = g.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#9c6a3f");
    grad.addColorStop(0.5, "#b07a49");
    grad.addColorStop(1, "#946036");
    g.fillStyle = grad;
    g.fillRect(0, 0, w, h);
    // planks
    const planks = 4;
    for (let p = 0; p < planks; p++) {
      const y0 = (p * h) / planks;
      g.fillStyle = `rgba(${90 + r() * 40},${55 + r() * 25},${28 + r() * 15},${0.12 + r() * 0.1})`;
      g.fillRect(0, y0, w, h / planks);
      g.fillStyle = "rgba(40,22,10,0.35)";
      g.fillRect(0, y0, w, 2);
    }
    // grain lines
    for (let i = 0; i < 900; i++) {
      const y = r() * h;
      const amp = 2 + r() * 10;
      const freq = 0.002 + r() * 0.006;
      const phase = r() * 10;
      g.strokeStyle = `rgba(${50 + r() * 40},${28 + r() * 20},${12 + r() * 10},${0.05 + r() * 0.12})`;
      g.lineWidth = 0.6 + r() * 1.8;
      g.beginPath();
      for (let x = 0; x <= w; x += 16) g.lineTo(x, y + Math.sin(x * freq + phase) * amp + Math.sin(x * freq * 3.1) * amp * 0.3);
      g.stroke();
    }
    // pores
    for (let i = 0; i < 5000; i++) {
      g.fillStyle = `rgba(30,16,6,${0.08 + r() * 0.12})`;
      g.fillRect(r() * w, r() * h, 1 + r() * 3, 1);
    }
  });
}

/** Wall: warm limewash with soft mottling. */
export function wallTexture() {
  return make("wall", 1024, 1024, (g, w, h) => {
    const r = rng(11);
    g.fillStyle = "#e9e1d3";
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) {
      const x = r() * w;
      const y = r() * h;
      const rad = 40 + r() * 160;
      const grd = g.createRadialGradient(x, y, 0, x, y, rad);
      const a = 0.03 + r() * 0.05;
      grd.addColorStop(0, r() > 0.5 ? `rgba(255,250,240,${a})` : `rgba(170,150,120,${a})`);
      grd.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = grd;
      g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
  });
}

/** Composite leather: pebbled orange with the eight black seams of a size-7 ball. */
export function basketballTexture() {
  return make("ball", 1024, 512, (g, w, h) => {
    const r = rng(3);
    g.fillStyle = "#d4652a";
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 22000; i++) {
      const x = r() * w;
      const y = r() * h;
      g.fillStyle = r() > 0.5 ? "rgba(255,190,140,0.10)" : "rgba(90,30,8,0.14)";
      g.beginPath();
      g.arc(x, y, 0.8 + r() * 1.6, 0, Math.PI * 2);
      g.fill();
    }
    g.strokeStyle = "#1d1410";
    g.lineWidth = 7;
    g.lineCap = "round";
    // equator and the meridian pair
    g.beginPath();
    g.moveTo(0, h / 2);
    g.lineTo(w, h / 2);
    g.stroke();
    for (const u of [0.25, 0.75]) {
      g.beginPath();
      g.moveTo(u * w, 0);
      g.lineTo(u * w, h);
      g.stroke();
    }
    // the two curved panels
    for (const side of [0, 0.5]) {
      g.beginPath();
      for (let i = 0; i <= 200; i++) {
        const u = i / 200;
        const x = ((u * 0.5 + side) % 1) * w;
        const y = h / 2 + Math.sin(u * Math.PI) * (h * 0.36) * (side ? -1 : 1);
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.stroke();
    }
  });
}

/** Woven kente strip: warp-faced blocks and weft stripes. */
export function kenteTexture() {
  return make("kente", 512, 512, (g, w, h) => {
    const cols = ["#e9b434", "#1f7a46", "#c0392b", "#141210"];
    g.fillStyle = "#141210";
    g.fillRect(0, 0, w, h);
    const block = 64;
    for (let by = 0; by < h; by += block) {
      for (let bx = 0; bx < w; bx += block) {
        const vertical = ((bx + by) / block) % 2 === 0;
        for (let i = 0; i < block; i += 6) {
          g.fillStyle = cols[(i / 6 + bx / block) % cols.length | 0];
          if (vertical) g.fillRect(bx + i, by, 4, block);
          else g.fillRect(bx, by + i, block, 4);
        }
      }
    }
    // thread texture
    for (let y = 0; y < h; y += 2) {
      g.fillStyle = "rgba(0,0,0,0.08)";
      g.fillRect(0, y, w, 1);
    }
  });
}

/** Research notebook: ruled paper, the wavelet, a tiny network, a margin note. */
export function notebookTexture() {
  return make("notebook", 1024, 1400, (g, w, h) => {
    g.fillStyle = "#f6f1e3";
    g.fillRect(0, 0, w, h);
    g.strokeStyle = "rgba(80,120,180,0.25)";
    g.lineWidth = 2;
    for (let y = 120; y < h; y += 56) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(w, y);
      g.stroke();
    }
    g.strokeStyle = "rgba(200,60,60,0.35)";
    g.beginPath();
    g.moveTo(110, 0);
    g.lineTo(110, h);
    g.stroke();
    const ink = "#1f2a44";
    g.fillStyle = ink;
    g.font = "italic 46px Georgia, serif";
    g.fillText("Wavelet-ANN, diesel prices", 140, 100);
    g.font = "italic 40px Georgia, serif";
    g.fillText("ψa,b(t) = |a|^-½ ψ((t − b) / a)", 140, 220);
    g.fillText("x(t) = A3 + D3 + D2 + D1", 140, 330);
    // signal and its approximation
    g.strokeStyle = ink;
    g.lineWidth = 3;
    g.beginPath();
    for (let x = 0; x <= 760; x += 4) {
      const t = x / 760;
      const y = 520 - Math.sin(t * 9) * 40 - Math.sin(t * 31) * 14 - t * 90;
      if (x === 0) g.moveTo(150 + x, y);
      else g.lineTo(150 + x, y);
    }
    g.stroke();
    g.strokeStyle = "#c2410c";
    g.lineWidth = 4;
    g.beginPath();
    for (let x = 0; x <= 760; x += 4) {
      const t = x / 760;
      const y = 520 - Math.sin(t * 9) * 40 - t * 90;
      if (x === 0) g.moveTo(150 + x, y);
      else g.lineTo(150 + x, y);
    }
    g.stroke();
    // a 3-4-1 network
    const layers = [3, 4, 1];
    const pts: [number, number][][] = layers.map((n, li) =>
      Array.from({ length: n }, (_, i) => [220 + li * 260, 720 + (i - (n - 1) / 2) * 110] as [number, number]),
    );
    g.strokeStyle = "rgba(31,42,68,0.5)";
    g.lineWidth = 2;
    for (let l = 0; l < pts.length - 1; l++) for (const a of pts[l]) for (const b of pts[l + 1]) {
      g.beginPath();
      g.moveTo(a[0], a[1]);
      g.lineTo(b[0], b[1]);
      g.stroke();
    }
    for (const layer of pts) for (const [x, y] of layer) {
      g.fillStyle = "#f6f1e3";
      g.beginPath();
      g.arc(x, y, 26, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = ink;
      g.lineWidth = 3;
      g.stroke();
    }
    g.fillStyle = ink;
    g.font = "italic 38px Georgia, serif";
    g.fillText("decompose, then let the net", 140, 1060);
    g.fillText("learn each band", 140, 1140);
  });
}

/** ICIS 2026 presenter badge on its lanyard card. */
export function badgeTexture() {
  return make("badge", 512, 720, (g, w, h) => {
    g.fillStyle = "#ffffff";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#0f2a4a";
    g.fillRect(0, 0, w, 210);
    g.fillStyle = "#ffffff";
    g.font = "bold 78px Arial, sans-serif";
    g.fillText("ICIS 2026", 40, 120);
    g.font = "26px Arial, sans-serif";
    g.fillText("8th International Conference", 40, 166);
    g.fillText("on Integrated Sciences", 40, 196);
    g.fillStyle = "#0f2a4a";
    g.font = "bold 60px Arial, sans-serif";
    g.fillText("Aadam", 40, 360);
    g.font = "30px Arial, sans-serif";
    g.fillStyle = "#475569";
    g.fillText("Co-author, presenter", 40, 410);
    g.fillStyle = "#e9b434";
    g.fillRect(40, 470, 200, 56);
    g.fillStyle = "#0f2a4a";
    g.font = "bold 30px Arial, sans-serif";
    g.fillText("PRESENTER", 52, 508);
    g.fillStyle = "#94a3b8";
    g.font = "24px Arial, sans-serif";
    g.fillText("29 to 30 Aug 2026", 40, 640);
  });
}

/** Phone lock screen with order notifications stacking up. */
export function phoneTexture() {
  return make("phone", 512, 1040, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, w, h);
    grd.addColorStop(0, "#1b2a4a");
    grd.addColorStop(1, "#3a1d3a");
    g.fillStyle = grd;
    g.fillRect(0, 0, w, h);
    g.fillStyle = "rgba(255,255,255,0.92)";
    g.font = "200 150px Arial, sans-serif";
    g.textAlign = "center";
    g.fillText("9:41", w / 2, 250);
    g.font = "30px Arial, sans-serif";
    g.fillText("Tuesday, Accra", w / 2, 300);
    g.textAlign = "left";
    const notes = [
      ["WhatsApp", "Zaina's Couture", "New order: Naa Corset Midi (L), GH₵395"],
      ["Messages", "An-Nur Royal Laundry", "Order #0001 is ready for pickup"],
      ["Al Boyut", "Cashier queue", "New order from Baria, GHS 250.00"],
    ];
    notes.forEach(([app, title, body], i) => {
      const y = 380 + i * 190;
      g.fillStyle = "rgba(255,255,255,0.82)";
      g.beginPath();
      g.roundRect(24, y, w - 48, 166, 34);
      g.fill();
      g.fillStyle = app === "WhatsApp" ? "#25d366" : app === "Messages" ? "#34c759" : "#ea580c";
      g.beginPath();
      g.roundRect(48, y + 24, 44, 44, 12);
      g.fill();
      g.fillStyle = "rgba(0,0,0,0.5)";
      g.font = "24px Arial, sans-serif";
      g.fillText(app.toUpperCase(), 108, y + 56);
      g.fillStyle = "#000";
      g.font = "bold 30px Arial, sans-serif";
      g.fillText(title, 48, y + 108);
      g.font = "26px Arial, sans-serif";
      g.fillStyle = "rgba(0,0,0,0.78)";
      g.fillText(body.length > 34 ? body.slice(0, 33) + "…" : body, 48, y + 144);
    });
  });
}
