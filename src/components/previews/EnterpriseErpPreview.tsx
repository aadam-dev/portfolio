"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  Package,
  Receipt,
  Truck,
  Users,
  BarChart3,
  Lock,
  CheckCircle2,
} from "lucide-react";

interface Props {
  screen: string;
}

const MODULES = [
  { icon: ShoppingBag, label: "Point of Sale", status: "Active" },
  { icon: Package, label: "Inventory", status: "Active" },
  { icon: Truck, label: "Purchase", status: "Active" },
  { icon: Receipt, label: "Accounting", status: "Active" },
  { icon: Users, label: "HR", status: "Active" },
  { icon: BarChart3, label: "Reporting", status: "Active" },
];

const METRICS = [
  { label: "Modules live", value: "6" },
  { label: "Branches unified", value: "Multi" },
  { label: "Manual reconciliations", value: "0" },
  { label: "Data loss on migration", value: "Zero" },
];

const REPORTS = [
  "P&L · Real-time",
  "Cash flow · Daily",
  "Inventory valuation",
  "Purchase cycles",
  "Sales by category",
  "Payroll & HR",
];

export default function EnterpriseErpPreview({ screen }: Props) {
  return (
    <div className="w-full h-full min-h-[520px] bg-[#08080C] text-white flex flex-col">
      {/* Confidential banner */}
      <div className="flex items-center justify-between gap-4 px-5 md:px-8 py-3 border-b border-white/5 bg-white/[0.015]">
        <div className="flex items-center gap-2.5">
          <Lock className="w-3 h-3 text-[#8B5CF6]" />
          <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-white/60">
            Confidential deployment · Illustrative preview
          </span>
        </div>
        <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
          Odoo 17
        </span>
      </div>

      {screen === "overview" && <Overview />}
      {screen === "modules" && <Modules />}
      {screen === "reports" && <Reports />}
    </div>
  );
}

function Overview() {
  return (
    <div className="flex-1 p-5 md:p-8 overflow-hidden">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
        Workspace · Overview
      </p>
      <h3
        className="mt-2 font-serif text-white"
        style={{
          fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
          fontFamily: "var(--font-serif), Georgia, serif",
        }}
      >
        A single source of truth<br />
        <span className="italic text-white/60">replacing eight disconnected ones.</span>
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6 md:mt-8">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
            className="rounded-xl border border-white/5 bg-white/[0.015] p-3 md:p-4"
          >
            <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.16em] text-white/40">
              {m.label}
            </p>
            <p
              className="mt-1 font-serif text-white"
              style={{
                fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                letterSpacing: "-0.02em",
                fontFamily: "var(--font-serif), Georgia, serif",
              }}
            >
              {m.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 md:mt-8 rounded-xl border border-white/5 bg-white/[0.015] p-4 md:p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 mb-3">
          System health
        </p>
        <div className="space-y-2">
          {["POS sync", "Inventory ledger", "Bank reconciliation", "Payroll"].map(
            (row, i) => (
              <div
                key={row}
                className="flex items-center justify-between gap-4 text-[12px] md:text-[13px]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4ade80] shrink-0" />
                  <span className="truncate text-white/75">{row}</span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
                  Healthy · {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function Modules() {
  return (
    <div className="flex-1 p-5 md:p-8 overflow-hidden">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
        Application · Modules
      </p>
      <h3
        className="mt-2 font-serif text-white"
        style={{
          fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
          fontFamily: "var(--font-serif), Georgia, serif",
        }}
      >
        Every module configured<br />
        <span className="italic text-white/60">around real workflows.</span>
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-6 md:mt-8">
        {MODULES.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.05, duration: 0.5 }}
            className="group rounded-xl border border-white/5 bg-white/[0.015] p-4 md:p-5 transition-colors hover:border-[#8B5CF6]/30"
          >
            <div
              className="inline-flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg mb-3"
              style={{
                background: "rgba(139,92,246,0.12)",
                border: "1px solid rgba(139,92,246,0.25)",
                color: "#C7BDFF",
              }}
            >
              <m.icon className="w-4 h-4 md:w-[18px] md:h-[18px]" />
            </div>
            <p className="text-[13px] md:text-[14px] text-white">{m.label}</p>
            <p className="mt-0.5 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-[#4ade80]">
              {m.status}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Reports() {
  return (
    <div className="flex-1 p-5 md:p-8 overflow-hidden">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
        Analytics · Reports
      </p>
      <h3
        className="mt-2 font-serif text-white"
        style={{
          fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
          fontFamily: "var(--font-serif), Georgia, serif",
        }}
      >
        Numbers that reconcile<br />
        <span className="italic text-white/60">on the first try.</span>
      </h3>

      <ul className="mt-6 md:mt-8 divide-y divide-white/5 border-y border-white/5">
        {REPORTS.map((r, i) => (
          <motion.li
            key={r}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 + i * 0.04, duration: 0.45 }}
            className="flex items-center justify-between gap-4 py-3 md:py-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[13px] md:text-[14px] text-white/85 truncate">
                {r}
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30">
              Generated · live
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
