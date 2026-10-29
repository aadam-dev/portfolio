/** Run once the browser is idle (or after a timeout); returns a cancel function. */
export function onIdle(cb: () => void, timeout = 3000) {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(cb, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(cb, Math.min(timeout, 1500));
  return () => clearTimeout(id);
}
