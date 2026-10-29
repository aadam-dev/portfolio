import type { Metadata } from "next";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What aadambuilds.dev records about visits and messages, and what it does not.",
};

const ITEMS: [string, string][] = [
  ["What I record about a visit", "The pages you open, what you play with on the site (for example ringing up a sale on a replica or stressing the model), how long the visit lasts, the site that sent you, your browser, operating system and device type, and an approximate place (city and country) worked out by my host, Vercel, from your connection."],
  ["Your IP address", "I store the IP address your visit came from, with the visit record, so I can tell visits apart and spot abuse. Only I can see it, and it is deleted with the visit record."],
  ["What I do not record", "There are no advertising or third-party analytics scripts, no fingerprinting, and nothing is sold or shared."],
  ["How a visit is recognised", "Your browser keeps a random id in local storage so a second visit can be counted as a return. Clearing site data removes it. If your browser sends Do Not Track or Global Privacy Control, nothing is recorded at all."],
  ["Messages and briefs", "When you send a message or a brief, I keep what you wrote and the contact details you gave, so I can reply. If you left an email address, you may get a short confirmation."],
  ["Who sees it", "Only me: in my sign-in-protected office, and as private notifications to my Telegram. Records are stored in a database hosted by Supabase."],
  ["How long it is kept", "Visit records are kept for up to 12 months. Messages are kept while I am working with you and deleted on request."],
  ["Your choices", "Email adam@aadambuilds.dev to see or delete anything I hold about you."],
];

export default function Privacy() {
  return (
    <>
      <Nav />
      <main id="main" className="px-4 md:px-6 pt-32 pb-24">
        <div className="max-w-[760px] mx-auto">
          <h1 className="font-display text-white" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 1, letterSpacing: "-0.03em" }}>
            Privacy
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-[var(--ink-2)]">The short version: I keep enough to understand who visits and to answer messages, and nothing that identifies you to anyone else.</p>
          <dl className="mt-10 space-y-8">
            {ITEMS.map(([k, v]) => (
              <div key={k}>
                <dt className="font-display text-[20px] text-white">{k}</dt>
                <dd className="mt-2 text-[15.5px] leading-relaxed text-[var(--ink-2)]">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-12 text-[13px] text-[var(--ink-3)]">Updated October 2026.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
