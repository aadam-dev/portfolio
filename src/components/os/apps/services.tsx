"use client";

import { useLocale } from "next-intl";
import { localServices } from "@/lib/services";

/** Services.notes: the six disciplines as a plain-text note. */
export default function NotesApp() {
  const SERVICES = localServices(useLocale()).services;
  return (
    <div className="space-y-4 p-6 font-mono text-[12.5px] leading-relaxed text-white/80">
      <p className="text-white/45"># services.notes · forward deployed</p>
      {SERVICES.map((s) => (
        <p key={s.n}>
          <span className="text-[var(--accent-2)]">
            ## {s.n} {s.title}
          </span>
          <br />
          {s.short}
        </p>
      ))}
    </div>
  );
}
