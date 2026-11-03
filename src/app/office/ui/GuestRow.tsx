"use client";

import { useTransition } from "react";
import { Check, Trash2, X } from "lucide-react";
import { moderateGuest, removeGuest } from "../actions";

export interface GuestRowData {
  id: number;
  kind: string;
  name: string;
  body: string;
  rating: number | null;
  status: string;
  ip: string | null;
  at: string;
}

const TONE: Record<string, string> = { pending: "text-[#fab219]", approved: "text-[#3ec46d]", rejected: "text-[#f08a8a]" };

export default function GuestRow({ row }: { row: GuestRowData }) {
  const [busy, start] = useTransition();
  const act = (fn: () => Promise<void>) => start(fn);
  return (
    <li className={`card overflow-hidden ${busy ? "opacity-60" : ""}`}>
      {row.kind === "photo" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/office/guest-image/${row.id}`} alt={`Photo from ${row.name || "a visitor"}`} className="aspect-[4/3] w-full bg-black object-cover" />
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 text-[12px]">
          <span className="rounded-full border border-[var(--line)] px-2 py-0.5 text-[var(--ink-3)]">{row.kind === "photo" ? "Photo" : "Note"}</span>
          <span className={`capitalize ${TONE[row.status] ?? ""}`}>{row.status}</span>
          <span className="ml-auto text-[var(--ink-4)] tabular-nums">{new Date(row.at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <p className="mt-2 text-[14px] font-medium">
          {row.name || "Someone"} {row.rating ? <span className="text-[#fab219]">{"★".repeat(row.rating)}</span> : null}
        </p>
        {row.body && <p className="mt-1 whitespace-pre-wrap text-[13.5px] text-[var(--ink-2)]">{row.body}</p>}
        {row.ip && <p className="mt-2 text-[11.5px] text-[var(--ink-4)]">{row.ip}</p>}
        <div className="mt-3 flex items-center gap-2">
          {row.status !== "approved" && (
            <button type="button" onClick={() => act(() => moderateGuest(row.id, "approved"))} className="btn btn-solid !h-9 !px-3 text-[12.5px]">
              <Check className="h-3.5 w-3.5" /> Approve
            </button>
          )}
          {row.status !== "rejected" && (
            <button type="button" onClick={() => act(() => moderateGuest(row.id, "rejected"))} className="btn btn-line !h-9 !px-3 text-[12.5px]">
              <X className="h-3.5 w-3.5" /> {row.status === "approved" ? "Hide" : "Reject"}
            </button>
          )}
          <button
            type="button"
            onClick={() => window.confirm("Delete this for good?") && act(() => removeGuest(row.id))}
            aria-label="Delete"
            className="ml-auto grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] text-[var(--ink-3)] hover:text-[#f08a8a]"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </li>
  );
}
