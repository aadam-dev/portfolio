"use client";

import { ABOUT_FACTS, ABOUT_INTRO, EDUCATION, EXPERIENCE, LEADERSHIP, RESEARCH, SKILLS } from "@/lib/about";

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-7 border-b border-black/10 pb-1 text-[15px] font-bold tracking-tight">{children}</h2>;
}

/** About.rtf: the whole About page as a TextEdit document. Same source as /about. */
export default function AboutDoc() {
  return (
    <div className="flex h-full flex-col bg-[#ecebe7]">
      <div className="flex items-center gap-3 border-b border-black/10 bg-[#f4f3ef] px-4 py-1.5 text-[12px] text-black/55" aria-hidden>
        <span className="rounded border border-black/15 bg-white px-2">Helvetica Neue</span>
        <span className="rounded border border-black/15 bg-white px-2">13</span>
        <b>B</b>
        <i>I</i>
        <u>U</u>
        <span>≡</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4" data-lenis-prevent>
        <article className="mx-auto max-w-[620px] bg-white px-5 py-7 sm:px-10 sm:py-9 text-[13.5px] leading-relaxed text-[#1f1e1c] shadow" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
          <h1 className="text-[26px] font-bold tracking-tight">Aadam</h1>
          <p className="text-black/55">Forward deployed engineer · Accra</p>
          {ABOUT_INTRO.map((p) => (
            <p key={p.slice(0, 16)} className="mt-3">
              {p}
            </p>
          ))}
          <dl className="mt-4 grid grid-cols-2 gap-3 text-[12px] sm:grid-cols-3">
            {ABOUT_FACTS.map(([k, v]) => (
              <div key={k}>
                <dt className="text-black/50">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>

          <H>Experience</H>
          {EXPERIENCE.map((e) => (
            <div key={e.role + e.when} className="mt-3">
              <p className="font-semibold">
                {e.role} · <span className="font-normal text-black/60">{e.org}</span>
              </p>
              <p className="text-[12px] text-black/45">{e.when}</p>
              {e.body && <p className="mt-1">{e.body}</p>}
            </div>
          ))}

          <H>Research</H>
          {RESEARCH.map((r) => (
            <div key={r.title} className="mt-3">
              <p className="font-semibold">{r.title}</p>
              <p className="text-[12px] text-black/50">{r.where}</p>
              <p className="mt-1">{r.body}</p>
            </div>
          ))}

          <H>Education</H>
          {EDUCATION.map((e) => (
            <div key={e.title} className="mt-3">
              <p className="font-semibold">
                {e.title} · <span className="font-normal text-black/60">{e.org}</span>
              </p>
              <p className="text-[12px] text-black/45">{e.when}</p>
              <p className="mt-1">{e.body}</p>
            </div>
          ))}

          <H>Leadership and programmes</H>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {LEADERSHIP.map((l) => (
              <li key={l.slice(0, 20)}>{l}</li>
            ))}
          </ul>

          <H>Skills</H>
          <dl className="mt-2 space-y-1">
            {SKILLS.map((s) => (
              <div key={s.group}>
                <dt className="inline font-semibold">{s.group}: </dt>
                <dd className="inline">{s.items}</dd>
              </div>
            ))}
          </dl>
        </article>
      </div>
    </div>
  );
}
