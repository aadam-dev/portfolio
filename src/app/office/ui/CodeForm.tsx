"use client";

import { useActionState } from "react";
import { setCode } from "../actions";

/** Change the sign-in code: current code, then the new one twice. Other devices are signed out. */
export default function CodeForm({ source }: { source: string }) {
  const [state, action, pending] = useActionState(setCode, null);
  return (
    <form action={action} className="space-y-3">
      <p className="text-[12.5px] text-[var(--ink-3)]">{source === "settings" ? "Your code is set here." : "You're using the first-run code from Vercel. Set your own."}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          ["current", "Current code"],
          ["next", "New code"],
          ["confirm", "New code again"],
        ].map(([n, l]) => (
          <label key={n} className="block">
            <span className="label">{l}</span>
            <input name={n} type="password" inputMode="numeric" pattern="\d{4,8}" minLength={4} maxLength={8} required autoComplete={n === "current" ? "current-password" : "new-password"} className="field mt-1 tracking-[0.3em]" />
          </label>
        ))}
      </div>
      {state && "error" in state && state.error && <p className="text-[13px] text-[#f08a8a]">{state.error}</p>}
      {state && "ok" in state && state.ok && <p className="text-[13px] text-[#7fd67f]">{state.ok}</p>}
      <button type="submit" disabled={pending} className="btn btn-solid !h-10 !px-4 !text-[13px]">
        {pending ? "Saving…" : "Change code"}
      </button>
    </form>
  );
}
