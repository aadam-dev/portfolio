import { db } from "@/db";
import { officeGuests } from "@/lib/guests";
import GuestRow from "../../ui/GuestRow";

export const dynamic = "force-dynamic";

/** Notes and selfies left in Aadam OS and on the phone. Nothing is public until approved here. */
export default async function Guests() {
  const store = await db();
  if (!store) return <p>The database is not connected yet.</p>;
  const rows = await officeGuests(store);
  const pending = rows.filter((r) => r.status === "pending");
  const rest = rows.filter((r) => r.status !== "pending");
  return (
    <div>
      <h1 className="text-[26px] font-semibold tracking-[-0.02em] md:text-[30px]">Guests</h1>
      <p className="mb-5 mt-1 text-[13.5px] text-[var(--ink-3)]">
        Notes from the sticky in Aadam OS and selfies from the phone&apos;s camera. They go public only when you approve them.
      </p>
      <h2 className="mb-2 text-[13px] text-[var(--ink-3)]">Waiting for you · {pending.length}</h2>
      {pending.length ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pending.map((r) => (
            <GuestRow key={r.id} row={{ ...r, at: r.at.toISOString() }} />
          ))}
        </ul>
      ) : (
        <p className="py-4 text-[13px] text-[var(--ink-3)]">Nothing waiting.</p>
      )}
      <h2 className="mb-2 mt-8 text-[13px] text-[var(--ink-3)]">Decided · {rest.length}</h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((r) => (
          <GuestRow key={r.id} row={{ ...r, at: r.at.toISOString() }} />
        ))}
      </ul>
    </div>
  );
}
