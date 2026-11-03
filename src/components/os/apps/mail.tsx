"use client";

import { useOsText } from "../l10n";
import { useState } from "react";
import { visitSession } from "@/components/site/Tracker";

/** Mail: a real message to me, through the same route as the contact form. */
export default function MailApp({ flat, subject }: { flat: boolean; subject?: string }) {
  const t = useOsText().mail;
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState("sending");
    try {
      // tie the message to this visit, like the contact form does
      const r = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: f.get("name"), contact: f.get("contact"), message: f.get("message"), kind: "contact", sid: visitSession() }),
      });
      setState(r.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  };
  if (state === "sent")
    return (
      <div className="grid h-full place-items-center p-8 text-center">
        <div>
          <p className="text-[18px] font-semibold">{t.sent}</p>
          <p className="mt-1 text-white/60">{t.sentBody}</p>
        </div>
      </div>
    );
  const field = "w-full rounded-md border border-white/10 bg-white/[0.06] px-3 py-2 text-[13px] text-white placeholder:text-white/35 outline-none focus:border-white/30";
  return (
    <form onSubmit={send} className="flex h-full flex-col gap-2.5 p-5 text-[13px]">
      <p className="text-white/60">
        {t.to}: <span className="text-white">Aadam</span> · <span dir="ltr">adam@aadambuilds.dev</span>
      </p>
      <input name="name" required placeholder={t.name} tabIndex={flat ? 0 : -1} className={field} />
      <input name="contact" required placeholder={t.contact} tabIndex={flat ? 0 : -1} className={field} />
      <textarea
        name="message"
        required
        rows={5}
        defaultValue={subject ? t.prefill(subject) : undefined}
        placeholder={t.placeholder}
        tabIndex={flat ? 0 : -1}
        className={`${field} flex-1 resize-none`}
      />
      <div className="flex items-center gap-3">
        <button type="submit" disabled={state === "sending"} tabIndex={flat ? 0 : -1} className="rounded-md bg-[var(--accent)] px-4 py-2 font-semibold text-black disabled:opacity-60">
          {state === "sending" ? t.sending : t.send}
        </button>
        {state === "error" && <span className="text-[#ff9b8a]">{t.error}</span>}
      </div>
    </form>
  );
}
