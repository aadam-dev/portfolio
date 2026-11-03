"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { visitSession } from "@/components/site/Tracker";
import { useOsText, intlLocale } from "../l10n";
import { myPhotos, shrink } from "./store";

type Stage = "intro" | "live" | "review" | "sending";

/**
 * Camera: a selfie (or a photo from the library) for my Visitors album. It is saved on this phone
 * first; sending it is a separate, explicit choice, and nothing shows publicly until I approve it.
 */
export default function CameraApp({ onSaved }: { onSaved: () => void }) {
  const t = useOsText().camera;
  const locale = useLocale();
  const [stage, setStage] = useState<Stage>("intro");
  const [blocked, setBlocked] = useState(false);
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const [shot, setShot] = useState<string | null>(null);
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const picker = useRef<HTMLInputElement>(null);
  const stamp = () => t.stamp(new Intl.DateTimeFormat(intlLocale(locale), { day: "numeric", month: "short", year: "numeric" }).format(new Date()));

  const stop = () => {
    stream.current?.getTracks().forEach((tr) => tr.stop());
    stream.current = null;
  };
  // the camera light goes off when the app closes
  useEffect(() => stop, []);

  const start = async (mode = facing) => {
    stop();
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 1280 } }, audio: false });
      stream.current = s;
      setStage("live");
      setBlocked(false);
      // the video element mounts with the live stage
      requestAnimationFrame(() => {
        if (video.current) {
          video.current.srcObject = s;
          video.current.play().catch(() => {});
        }
      });
    } catch {
      setBlocked(true);
      setStage("intro");
    }
  };

  const capture = () => {
    const v = video.current;
    if (!v || !v.videoWidth) return;
    setShot(shrink(v, v.videoWidth, v.videoHeight, { mirror: facing === "user", stamp: stamp() }));
    stop();
    setStage("review");
  };

  const fromFile = (f?: File) => {
    if (!f) return;
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setShot(shrink(img, img.naturalWidth, img.naturalHeight, { stamp: stamp() }));
      URL.revokeObjectURL(url);
      setStage("review");
    };
    img.src = url;
  };

  const save = async (send: boolean, name: string) => {
    if (!shot) return;
    const at = new Date().toISOString();
    if (!send) {
      await myPhotos.add({ src: shot, at, status: "local" }).catch(() => {});
      onSaved();
      return;
    }
    setStage("sending");
    const r = await fetch("/api/guest", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind: "photo", name, image: shot, sid: visitSession() }),
    })
      .then((x) => (x.ok ? x.json() : null))
      .catch(() => null);
    // saved either way; a failed send shows as "Not sent" in Photos, with a button to try again
    await myPhotos.add({ src: shot, at, status: r?.ok ? "pending" : "failed", serverId: r?.id }).catch(() => {});
    onSaved();
  };

  return (
    <div className="relative flex h-full flex-col bg-black text-white">
      <input ref={picker} type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => fromFile(e.target.files?.[0])} />

      {stage === "intro" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-7 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full border-2 border-white/70 text-[30px]" aria-hidden>
            ◉
          </span>
          <h3 className="text-[20px] font-semibold">{t.title}</h3>
          <p className="text-[14px] leading-relaxed text-white/70">{t.body}</p>
          {blocked && <p className="rounded-lg bg-white/10 px-3 py-2 text-[13px] text-[#ffcf9a]">{t.blocked}</p>}
          <button onClick={() => start()} className="mt-2 w-full rounded-full bg-white py-3 text-[15px] font-semibold text-black">
            {t.turnOn}
          </button>
          <button onClick={() => picker.current?.click()} className="w-full rounded-full border border-white/25 py-3 text-[15px]">
            {t.choose}
          </button>
        </div>
      )}

      {stage === "live" && (
        <>
          <div className="relative min-h-0 flex-1 overflow-hidden">
            <video ref={video} playsInline muted className={`absolute inset-0 h-full w-full object-cover ${facing === "user" ? "-scale-x-100" : ""}`} />
            {/* a thirds grid, like the real one */}
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,transparent_33.2%,rgba(255,255,255,.18)_33.3%,transparent_33.5%,transparent_66.5%,rgba(255,255,255,.18)_66.6%,transparent_66.8%),linear-gradient(to_bottom,transparent_33.2%,rgba(255,255,255,.18)_33.3%,transparent_33.5%,transparent_66.5%,rgba(255,255,255,.18)_66.6%,transparent_66.8%)]" />
          </div>
          <div className="flex h-28 shrink-0 items-center justify-between px-8">
            <button
              onClick={() => {
                stop();
                setStage("intro");
              }}
              className="w-16 text-left text-[14px] text-[#ffd60a]"
            >
              {t.cancel}
            </button>
            <button onClick={capture} aria-label={t.shutter} className="grid h-[70px] w-[70px] place-items-center rounded-full border-[3px] border-white">
              <span className="h-[56px] w-[56px] rounded-full bg-white transition-transform active:scale-90" />
            </button>
            <button
              onClick={() => {
                const next = facing === "user" ? "environment" : "user";
                setFacing(next);
                start(next);
              }}
              aria-label={t.flip}
              className="grid h-11 w-16 place-items-center text-[22px]"
            >
              ⟲
            </button>
          </div>
        </>
      )}

      {(stage === "review" || stage === "sending") && shot && (
        <Review
          shot={shot}
          sending={stage === "sending"}
          onRetake={() => {
            setShot(null);
            setStage("intro");
          }}
          onSave={save}
        />
      )}
    </div>
  );
}

function Review({ shot, sending, onRetake, onSave }: { shot: string; sending: boolean; onRetake: () => void; onSave: (send: boolean, name: string) => void }) {
  const t = useOsText().camera;
  const [name, setName] = useState("");
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid min-h-0 flex-1 place-items-center p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shot} alt="" className="max-h-full max-w-full rounded-lg object-contain shadow-2xl" />
      </div>
      <div className="space-y-2.5 px-5 pb-5">
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder={t.name} className="w-full rounded-xl bg-white/10 px-3.5 py-2.5 text-[14px] outline-none placeholder:text-white/40" />
        <p className="text-[11.5px] leading-snug text-white/55">{t.consent}</p>
        <button disabled={sending} onClick={() => onSave(true, name)} className="w-full rounded-full bg-[var(--accent)] py-3 text-[15px] font-semibold text-black disabled:opacity-60">
          {sending ? t.sending : t.send}
        </button>
        <div className="flex gap-2">
          <button disabled={sending} onClick={onRetake} className="flex-1 rounded-full border border-white/25 py-2.5 text-[14px]">
            {t.retake}
          </button>
          <button disabled={sending} onClick={() => onSave(false, name)} className="flex-1 rounded-full border border-white/25 py-2.5 text-[14px]">
            {t.keep}
          </button>
        </div>
      </div>
    </div>
  );
}
