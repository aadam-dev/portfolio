"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mt-6 space-y-3">
      <label className="block">
        <span className="text-[13px] text-[var(--ink-3)]">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className="mt-1 w-full h-11 rounded-xl bg-[var(--surface)] border border-[var(--line-strong)] px-3 text-white outline-none focus:border-[var(--accent)]"
        />
      </label>
      {state?.error && <p className="text-[13px] text-[var(--accent)]">{state.error}</p>}
      <button type="submit" disabled={pending} className="w-full h-11 rounded-xl bg-white text-black font-medium disabled:opacity-60">
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
