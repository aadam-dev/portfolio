"use client";

import { useTransition } from "react";
import { workoutTemplate } from "../actions";

export default function WorkoutStart() {
  const [pending, start] = useTransition();
  return (
    <button type="button" onClick={() => start(async () => void (await workoutTemplate()))} disabled={pending} className="btn btn-line !h-10 !px-4 !text-[13px]">
      {pending ? "Adding…" : "Start from a template week"}
    </button>
  );
}
