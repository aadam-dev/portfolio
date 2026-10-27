"use client";

import dynamic from "next/dynamic";

const PointsMap = dynamic(() => import("@/components/map/PointsMap"), { ssr: false });

export default function OfficeMap(props: { points: { lng: number; lat: number; n: number; label: string }[] }) {
  return <PointsMap {...props} />;
}
