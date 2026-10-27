import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/** A short pointer from the home page to the Lab. */
export default function LabTeaser() {
  const items = [
    { href: "/lab/model", title: "Stress a three-statement model", body: "Shock the cedi, rates or demand and watch the covenant." },
    { href: "/lab/car", title: "Take a car apart", body: "Flip it, explode it, learn the brakes, drive a lap." },
  ];
  return (
    <section aria-labelledby="lab-heading" className="px-4 md:px-6 py-20 md:py-24">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-4">
          <h2 id="lab-heading" className="font-display text-white" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1, letterSpacing: "-0.03em" }}>
            From the Lab
          </h2>
          <Link href="/lab" className="mt-4 inline-flex items-center gap-1 text-[14px] text-[var(--ink-2)] hover:text-white">
            Everything in the Lab <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <ul className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((x) => (
            <li key={x.href}>
              <Link href={x.href} className="group block h-full rounded-2xl border border-[var(--line-strong)] p-5 hover:bg-[var(--surface)] transition-colors">
                <span className="flex items-start justify-between gap-3">
                  <span className="font-display text-[21px] leading-tight text-white">{x.title}</span>
                  <ArrowUpRight className="w-5 h-5 shrink-0 text-[var(--ink-3)] group-hover:text-[var(--accent)]" />
                </span>
                <span className="mt-2 block text-[14.5px] text-[var(--ink-2)]">{x.body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
