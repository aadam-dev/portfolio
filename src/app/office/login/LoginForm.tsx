"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowRight, Delete } from "lucide-react";
import { login } from "../actions";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

/** A code pad: tap the digits or type them; Enter or the arrow signs in. */
export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  const [code, setCode] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (state?.error) {
      const t = window.setTimeout(() => setCode(""), 0);
      return () => window.clearTimeout(t);
    }
  }, [state]);
  const press = (k: string) => {
    if (k === "del") setCode((c) => c.slice(0, -1));
    else if (k) setCode((c) => (c.length < 8 ? c + k : c));
    input.current?.focus({ preventScroll: true });
  };
  return (
    <form ref={form} action={action} className="mt-6">
      <label className="sr-only" htmlFor="code">
        Sign-in code
      </label>
      <input
        ref={input}
        id="code"
        name="code"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus
        className="sr-only"
      />
      <button type="button" onClick={() => input.current?.focus()} className="w-full flex items-center justify-center gap-3 h-14 rounded-2xl border border-[var(--line-strong)] bg-[var(--surface-2)]" aria-hidden tabIndex={-1}>
        {Array.from({ length: Math.max(4, code.length) }, (_, i) => (
          <span key={i} className={`w-3 h-3 rounded-full transition-colors ${i < code.length ? "bg-[var(--foreground)]" : "border border-[var(--ink-4)]"}`} />
        ))}
      </button>
      {state?.error && <p className="mt-3 rounded-lg border border-[#d03b3b]/40 bg-[#d03b3b]/10 px-3 py-2 text-[13px] text-[#f08a8a]">{state.error}</p>}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {KEYS.map((k, i) =>
          k === "" ? (
            <span key={i} />
          ) : (
            <button
              key={i}
              type="button"
              onClick={() => press(k)}
              aria-label={k === "del" ? "Delete" : k}
              className="h-14 rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[20px] font-medium tabular-nums hover:bg-[var(--surface-2)] active:scale-[0.97] transition"
            >
              {k === "del" ? <Delete className="mx-auto w-5 h-5 text-[var(--ink-2)]" /> : k}
            </button>
          ),
        )}
      </div>
      <button type="submit" disabled={pending || code.length < 4} className="btn btn-solid w-full mt-4 !h-12">
        {pending ? "Checking…" : (
          <>
            Sign in <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
