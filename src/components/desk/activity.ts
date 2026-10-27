"use client";

/**
 * The desk renders on demand. Anything that moves (ball, water, curtain,
 * camera) calls kick(); a single loop keeps invalidating frames until every
 * kick has expired, then the canvas goes quiet and costs nothing.
 */
let until = 0;
export function kick(ms = 600) {
  until = Math.max(until, performance.now() + ms);
}
export const active = () => performance.now() < until;
