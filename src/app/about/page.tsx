import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import { EDUCATION, EXPERIENCE, LEADERSHIP, RESEARCH, SKILLS } from "@/lib/about";

export const metadata: Metadata = {
  title: "About Aadam",
  description:
    "Software engineer and analyst in Accra. Mathematics at UMaT, IT at IOU, three years of PE and VC analysis, now building operating systems for 17 businesses.",
};

function H2({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <h2 id={id} className="font-display text-white text-[26px] md:text-[32px] tracking-[-0.02em]">
      {children}
    </h2>
  );
}

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main id="main" className="px-4 md:px-6 pt-32 pb-24">
        <div className="max-w-[1080px] mx-auto">
          <h1 className="font-display text-white text-balance" style={{ fontSize: "clamp(2.75rem, 8vw, 6rem)", lineHeight: 0.95, letterSpacing: "-0.04em" }}>
            Aadam
          </h1>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 space-y-4 text-[17px] md:text-[18px] leading-[1.65] text-[var(--ink-2)] text-pretty">
              <p>
                I&apos;m a software engineer and analyst in Accra. I studied mathematics, spent three years evaluating businesses for investors, and now build the systems those businesses run on.
              </p>
              <p>
                The studio is me. You work with one person who can read the books, map the stockroom, write the code and stay for the stock count.
              </p>
            </div>
            <dl className="md:col-span-4 md:col-start-9 grid grid-cols-2 md:grid-cols-1 gap-4 text-[14px]">
              <div>
                <dt className="text-[var(--ink-3)]">Based in</dt>
                <dd className="text-white">Accra, GMT</dd>
              </div>
              <div>
                <dt className="text-[var(--ink-3)]">Businesses on my systems</dt>
                <dd className="text-white">17, seven end to end</dd>
              </div>
              <div>
                <dt className="text-[var(--ink-3)]">Email</dt>
                <dd>
                  <a href="mailto:adam@aadambuilds.dev" className="text-white underline underline-offset-4">adam@aadambuilds.dev</a>
                </dd>
              </div>
              <div>
                <dt className="text-[var(--ink-3)]">Elsewhere</dt>
                <dd className="flex gap-3">
                  <a href="https://linkedin.com/in/aadamsays" target="_blank" rel="noreferrer" className="hit text-white underline underline-offset-4">LinkedIn</a>
                  <a href="https://github.com/aadam-dev" target="_blank" rel="noreferrer" className="hit text-white underline underline-offset-4">GitHub</a>
                </dd>
              </div>
            </dl>
          </div>

          <nav aria-label="On this page" className="mt-12 flex flex-wrap gap-2 text-[13px]">
            {[
              ["experience", "Experience"],
              ["research", "Research"],
              ["education", "Education"],
              ["leadership", "Leadership"],
              ["skills", "Skills"],
            ].map(([id, label]) => (
              <a key={id} href={`#${id}`} className="pill">
                {label}
              </a>
            ))}
          </nav>

          <section aria-labelledby="experience" className="mt-16 scroll-mt-28">
            <H2 id="experience">Experience</H2>
            <ol className="mt-6 border-l border-[var(--line-strong)]">
              {EXPERIENCE.map((x) => (
                <li key={x.role + x.when} className="relative pl-6 pb-9 last:pb-0">
                  <span className="absolute -left-[5px] top-2 w-[9px] h-[9px] rounded-full bg-[var(--accent)]" />
                  <p className="text-[13px] text-[var(--ink-3)] tabular-nums">{x.when}</p>
                  <h3 className="mt-1 text-[18px] font-medium text-white">{x.role}</h3>
                  <p className="text-[14.5px] text-[var(--ink-2)]">{x.org}</p>
                  {x.body && <p className="mt-2 max-w-[680px] text-[15px] leading-relaxed text-[var(--ink-2)] text-pretty">{x.body}</p>}
                  {x.link && (
                    <Link href={x.link.href} className="hit mt-2 inline-flex items-center gap-1 text-[14px] text-white underline-offset-4 hover:underline">
                      {x.link.label} <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="research" className="mt-20 scroll-mt-28">
            <H2 id="research">Research</H2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {RESEARCH.map((r) => (
                <article key={r.title} className="card card-pad">
                  <h3 className="card-title text-balance">{r.title}</h3>
                  <p className="mt-2 card-meta">{r.where}</p>
                  <p className="card-text">{r.body}</p>
                  {r.link && (
                    <Link href={r.link.href} className="mt-auto pt-5 inline-flex items-center gap-1 text-[13px] text-white underline-offset-4 hover:underline">
                      {r.link.label} <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="education" className="mt-20 scroll-mt-28">
            <H2 id="education">Education</H2>
            <ul className="mt-6 divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {EDUCATION.map((e) => (
                <li key={e.title} className="grid grid-cols-1 md:grid-cols-[160px_minmax(0,1fr)] gap-2 py-5">
                  <p className="text-[13px] text-[var(--ink-3)] tabular-nums">{e.when}</p>
                  <div>
                    <h3 className="text-[17px] font-medium text-white">{e.title}</h3>
                    <p className="text-[14.5px] text-[var(--ink-2)]">{e.org}</p>
                    <p className="mt-1 text-[15px] text-[var(--ink-2)]">{e.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="leadership" className="mt-20 scroll-mt-28">
            <H2 id="leadership">Leadership, volunteering and programmes</H2>
            <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-[15px] leading-relaxed text-[var(--ink-2)]">
              {LEADERSHIP.map((l) => (
                <li key={l} className="pl-4 border-l-2 border-[var(--line-strong)]">
                  {l}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="skills" className="mt-20 scroll-mt-28">
            <H2 id="skills">Skills</H2>
            <dl className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {SKILLS.map((s) => (
                <div key={s.group}>
                  <dt className="text-[13px] text-[var(--ink-3)]">{s.group}</dt>
                  <dd className="mt-1 text-[15.5px] text-white leading-relaxed">{s.items}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="card mt-20 p-6 md:p-8 md:!flex-row md:items-center justify-between gap-5">
            <div>
              <p className="card-title">Hiring, or need the full CV?</p>
              <p className="mt-1 text-[15px] text-[var(--ink-2)]">I send the CV on request, usually the same day.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="mailto:adam@aadambuilds.dev?subject=CV%20request" className="btn btn-solid">
                Ask for the CV
              </a>
              <Link href="/#build" className="btn btn-line">
                Hire Aadam
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
