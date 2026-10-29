import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import Gantt from "@/components/build/Gantt";
import Schematic from "@/components/map/Schematic";
import { PLACES } from "@/components/map/places";
import { ROLES, STACK, STARTS, TRACK_TONE, decodeBrief, fmtW, plan } from "@/lib/brief";

export const metadata: Metadata = {
  title: "Project brief",
  robots: { index: false, follow: false },
};

export default async function BriefPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const brief = decodeBrief(code);
  if (!brief) notFound();

  return (
    <>
      <Nav />
      <main id="main" className="px-4 md:px-6 pt-32 pb-24">
        <div className="max-w-[960px] mx-auto">
          <p className="text-[13px] text-[var(--ink-3)]">
            <Link href="/" className="hover:text-white">Aadam</Link> / Brief
          </p>
          {brief.kind === "build" ? <BuildBrief ids={brief.ids} /> : <HireBrief role={brief.role} start={brief.start} stack={brief.stack} />}
          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/#build" className="btn btn-solid">
              Change this brief <ArrowUpRight className="w-4 h-4" />
            </Link>
            <a href={`mailto:adam@aadambuilds.dev?subject=${encodeURIComponent("About a brief")}&body=${encodeURIComponent(`Brief: https://aadambuilds.dev/brief/${code}`)}`} className="btn btn-line">
              Email Aadam about it
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function BuildBrief({ ids }: { ids: string[] }) {
  const p = plan(ids);
  return (
    <>
      <h1 className="mt-4 font-display text-white text-balance" style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)", lineHeight: 1, letterSpacing: "-0.03em" }}>
        A {Number.isInteger(p.weeks) ? p.weeks : p.weeks.toFixed(1)}-week build
      </h1>
      <p className="mt-4 max-w-[620px] text-[16px] leading-relaxed text-[var(--ink-2)]">
        Week one is discovery: I sit with your team and map how the business runs. Then the tracks below run side by side. One after another, the same work would take about {fmtW(p.serial)}.
      </p>
      <div className="theme-fixed card mt-8 p-5 md:p-6">
        <Gantt lanes={p.lanes} weeks={p.weeks} still />
      </div>
      <h2 className="mt-12 font-display text-[26px] text-white">What is in it, and where I built it before</h2>
      <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {p.chosen.map((s) => (
          <li key={s.id} className="card">
            <div className="card-media">
              {s.thumb === "map" ? <Schematic places={PLACES} selected="alboyut" interactive={false} /> : <Image src={s.thumb} alt="" fill sizes="300px" className="object-cover object-top" />}
            </div>
            <div className="card-pad">
              <p className="card-title">{s.label}</p>
              <p className="mt-2 card-meta">
                <span className="card-dot" style={{ background: TRACK_TONE[s.track] }} />
                {fmtW(s.weeks)}, {s.track}. Built for {s.proof}.
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function HireBrief({ role, start, stack }: { role: number; start: number; stack: number[] }) {
  return (
    <>
      <h1 className="mt-4 font-display text-white text-balance" style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)", lineHeight: 1, letterSpacing: "-0.03em" }}>
        Hiring Aadam: {ROLES[role].toLowerCase()}, starting {STARTS[start].toLowerCase()}
      </h1>
      <p className="mt-4 max-w-[620px] text-[16px] leading-relaxed text-[var(--ink-2)]">
        Based in Accra on GMT, working 08:00 to 20:00, which overlaps most of the working day in Europe and the US East Coast.
      </p>
      {stack.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {stack.map((i) => (
            <li key={i} className="pill" aria-pressed="true">
              {STACK[i]}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
