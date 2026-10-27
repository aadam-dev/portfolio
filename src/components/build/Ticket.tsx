"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import QRCode from "qrcode";

export interface TicketData {
  head: string;
  sub: string;
  lines: { l: string; r: string }[];
  total: { l: string; r: string };
  note?: string;
  url: string;
}

function useQr(url: string) {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    let live = true;
    QRCode.toString(url, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#1d1a16", light: "#0000" } })
      .then((s) => live && setSvg(s))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [url]);
  return svg;
}

/** Thermal paper fed from the slot at a constant speed, with a QR to the brief. */
export default function Ticket({ data, id }: { data: TicketData; id: number }) {
  const reduce = useReducedMotion();
  const qr = useQr(data.url);
  return (
    <div className="overflow-hidden">
      <motion.div
        key={id}
        initial={reduce ? false : { y: "-100%" }}
        animate={{ y: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 1.4, ease: "linear" }}
        className="fk-paper mx-auto w-full max-w-[340px] px-4 pt-4 pb-5 font-mono text-[11px] leading-[1.5] text-[#1d1a16] shadow-[0_18px_30px_-18px_rgba(0,0,0,0.5)]"
      >
        <p className="text-center text-[12.5px] font-bold tracking-[0.12em] uppercase">{data.head}</p>
        <p className="text-center opacity-60">{data.sub}</p>
        <p className="my-2 border-t border-dashed border-current opacity-30" />
        <ul>
          {data.lines.map((l, i) => (
            <li key={i} className="flex justify-between gap-3">
              <span className="truncate">{l.l}</span>
              <span className="shrink-0">{l.r}</span>
            </li>
          ))}
        </ul>
        <p className="my-2 border-t border-dashed border-current opacity-30" />
        <p className="flex justify-between font-bold text-[12.5px]">
          <span>{data.total.l}</span>
          <span>{data.total.r}</span>
        </p>
        {data.note && <p className="mt-2 opacity-70 text-[10.5px]">{data.note}</p>}
        <div className="mt-3 flex items-center gap-3">
          <span className="w-[76px] h-[76px] shrink-0 [&>svg]:w-full [&>svg]:h-full" dangerouslySetInnerHTML={{ __html: qr }} aria-hidden="true" />
          <span className="text-[10.5px] leading-snug opacity-75">
            Scan or open the link to share this brief with your team.
            <a href={data.url} target="_blank" rel="noreferrer" className="block mt-1 underline underline-offset-2 break-all opacity-90">
              {data.url.replace(/^https?:\/\//, "")}
            </a>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
