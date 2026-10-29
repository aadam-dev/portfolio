import Link from "next/link";

/** Section tabs as links, so each one has its own URL. */
export default function Tabs({ base, tabs, on }: { base: string; tabs: [string, string][]; on: string }) {
  return (
    <div className="seg mb-4 overflow-x-auto max-w-full" role="tablist">
      {tabs.map(([id, label]) => (
        <Link key={id} href={`${base}?tab=${id}`} role="tab" aria-selected={on === id} className="seg-item inline-flex items-center shrink-0">
          {label}
        </Link>
      ))}
    </div>
  );
}
