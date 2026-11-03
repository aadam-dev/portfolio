"use client";

/**
 * The visitor's own photos, kept in this browser (IndexedDB) so they survive a reload.
 * Each one remembers whether it was sent to me and what came of it.
 */
export type MyPhoto = { id?: number; src: string; at: string; status: "local" | "pending" | "approved" | "failed"; serverId?: number };

const DB = "aadam-phone";
const STORE = "yours";

function open(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

function tx<T>(mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return open().then(
    (db) =>
      new Promise<T>((res, rej) => {
        const req = run(db.transaction(STORE, mode).objectStore(STORE));
        req.onsuccess = () => res(req.result);
        req.onerror = () => rej(req.error);
      }),
  );
}

const listeners = new Set<() => void>();
const changed = () => listeners.forEach((l) => l());

export const myPhotos = {
  list: () => tx<MyPhoto[]>("readonly", (s) => s.getAll() as IDBRequest<MyPhoto[]>).then((a) => a.reverse()).catch(() => [] as MyPhoto[]),
  add: (p: MyPhoto) => tx<IDBValidKey>("readwrite", (s) => s.add(p)).then((k) => (changed(), Number(k))),
  put: (p: MyPhoto) => tx<IDBValidKey>("readwrite", (s) => s.put(p)).then(changed),
  remove: (id: number) => tx<undefined>("readwrite", (s) => s.delete(id)).then(changed),
  subscribe: (fn: () => void) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

/** Draw an image or video frame into a JPEG no longer than `max` px, small enough to upload. */
export function shrink(src: CanvasImageSource, w: number, h: number, opts: { mirror?: boolean; stamp?: string; max?: number } = {}) {
  const max = opts.max ?? 900;
  const k = Math.min(1, max / Math.max(w, h));
  const c = document.createElement("canvas");
  c.width = Math.round(w * k);
  c.height = Math.round(h * k);
  const g = c.getContext("2d")!;
  if (opts.mirror) {
    g.translate(c.width, 0);
    g.scale(-1, 1);
  }
  g.drawImage(src, 0, 0, c.width, c.height);
  g.setTransform(1, 0, 0, 1, 0, 0);
  if (opts.stamp) {
    // a small date stamp, like a disposable camera, so it reads as a visit
    const fs = Math.round(c.width / 30);
    g.font = `600 ${fs}px ui-monospace, Menlo, monospace`;
    g.textAlign = "right";
    g.fillStyle = "rgba(0,0,0,0.35)";
    g.fillText(opts.stamp, c.width - fs * 0.8 + 1, c.height - fs * 0.9 + 1);
    g.fillStyle = "#ffb070";
    g.fillText(opts.stamp, c.width - fs * 0.8, c.height - fs * 0.9);
  }
  let q = 0.84;
  let out = c.toDataURL("image/jpeg", q);
  // the server takes up to about 450 KB; base64 is 4/3 of the bytes
  while (out.length * 0.75 > 420_000 && q > 0.4) {
    q -= 0.12;
    out = c.toDataURL("image/jpeg", q);
  }
  return out;
}
