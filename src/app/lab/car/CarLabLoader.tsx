"use client";

import dynamic from "next/dynamic";

const RockmotionLab = dynamic(() => import("@/components/lab/rockmotion/RockmotionLab"), {
  ssr: false,
  loading: () => <div className="theme-fixed card !bg-[#0c0d0f] h-[70svh] min-h-[480px] grid place-items-center text-[13px] text-white/50">Loading the car</div>,
});

export default function CarLabLoader() {
  return <RockmotionLab />;
}
