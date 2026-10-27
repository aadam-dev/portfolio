"use client";

import dynamic from "next/dynamic";
import type { ModeId } from "./chapters";

const Loading = () => (
  <div className="h-full grid place-items-center font-mono text-[10px] tracking-[0.18em] uppercase text-white/30">
    loading module…
  </div>
);

const Counter = dynamic(() => import("./modes/CounterMode"), { ssr: false, loading: Loading });
const Laundry = dynamic(() => import("./modes/LaundryMode"), { ssr: false, loading: Loading });
const Atelier = dynamic(() => import("./modes/AtelierMode"), { ssr: false, loading: Loading });
const Analyst = dynamic(() => import("./modes/AnalystMode"), { ssr: false, loading: Loading });
const Ledger = dynamic(() => import("./modes/LedgerMode"), { ssr: false, loading: Loading });
const Court = dynamic(() => import("./modes/CourtMode"), { ssr: false, loading: Loading });
const Classroom = dynamic(() => import("./modes/ClassroomMode"), { ssr: false, loading: Loading });
const Build = dynamic(() => import("./modes/BuildMode"), { ssr: false, loading: Loading });

export default function ModeScreen({ mode }: { mode: ModeId }) {
  switch (mode) {
    case "counter":
      return <Counter />;
    case "laundry":
      return <Laundry />;
    case "atelier":
      return <Atelier />;
    case "analyst":
      return <Analyst />;
    case "ledger":
      return <Ledger />;
    case "court":
      return <Court />;
    case "classroom":
      return <Classroom />;
    case "build":
      return <Build />;
  }
}
