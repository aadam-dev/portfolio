"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block">
        <span className="label">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className="field mt-1"
        />
      </label>
      {state?.error && <p className="rounded-lg border border-[#d03b3b]/40 bg-[#d03b3b]/10 px-3 py-2 text-[13px] text-[#f08a8a]">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-solid w-full">
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
