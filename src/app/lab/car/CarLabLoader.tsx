"use client";

import dynamic from "next/dynamic";

const CarLab = dynamic(() => import("@/components/lab/car/CarLab"), {
  ssr: false,
  loading: () => <div className="theme-fixed h-[62svh] min-h-[440px] rounded-2xl bg-[#111214] grid place-items-center text-[13px] text-white/50">Loading the car…</div>,
});

export default function CarLabLoader() {
  return <CarLab />;
}
