/**
 * What each kind of Office item is: its stages (board columns) and its
 * fields. Shared by the server (validation, seeding) and the client
 * (boards, the editor), so a kind is described once.
 */
export type Kind = "project" | "task" | "ship" | "lead" | "outreach" | "template" | "book" | "workout" | "grad" | "note";

export type Field =
  | { key: string; label: string; type: "text" | "url" | "email" | "tel" | "money" | "textarea"; placeholder?: string }
  | { key: string; label: string; type: "select"; options: string[] }
  | { key: string; label: string; type: "checklist" };

export interface KindDef {
  label: string;
  plural: string;
  stages: { id: string; label: string; tone?: "good" | "warn" | "muted" | "accent" }[];
  fields: Field[];
  /** what the due date means for this kind, if it has one */
  due?: string;
  project?: boolean;
}

export const KINDS: Record<Kind, KindDef> = {
  project: {
    label: "Project",
    plural: "Projects",
    stages: [
      { id: "idea", label: "Idea", tone: "muted" },
      { id: "building", label: "Building", tone: "accent" },
      { id: "live", label: "Live", tone: "good" },
      { id: "maintaining", label: "Maintaining" },
      { id: "paused", label: "Paused", tone: "muted" },
    ],
    fields: [
      { key: "client", label: "Client", type: "text" },
      { key: "url", label: "Live site", type: "url", placeholder: "https://" },
      { key: "repo", label: "Repository", type: "url", placeholder: "https://github.com/aadam-dev/…" },
      { key: "stack", label: "Stack", type: "text", placeholder: "Next.js, Postgres, Odoo…" },
      { key: "value", label: "Contract value (GHS)", type: "money" },
      { key: "notes", label: "Notes", type: "textarea" },
    ],
    due: "Next milestone",
  },
  task: {
    label: "Task",
    plural: "Tasks",
    stages: [
      { id: "todo", label: "To do", tone: "muted" },
      { id: "doing", label: "Doing", tone: "accent" },
      { id: "done", label: "Done", tone: "good" },
    ],
    fields: [{ key: "notes", label: "Notes", type: "textarea" }],
    due: "Due",
    project: true,
  },
  ship: {
    label: "Shipped",
    plural: "Shipped",
    stages: [{ id: "", label: "Shipped" }],
    fields: [
      { key: "link", label: "Link", type: "url", placeholder: "https://" },
      { key: "notes", label: "What went out", type: "textarea" },
    ],
    due: "Shipped on",
    project: true,
  },
  lead: {
    label: "Lead",
    plural: "Leads",
    stages: [
      { id: "new", label: "New", tone: "accent" },
      { id: "replied", label: "Replied" },
      { id: "call", label: "Call booked" },
      { id: "proposal", label: "Proposal sent", tone: "warn" },
      { id: "won", label: "Won", tone: "good" },
      { id: "lost", label: "Lost", tone: "muted" },
    ],
    fields: [
      { key: "contact", label: "Email or WhatsApp", type: "text" },
      { key: "source", label: "Came from", type: "select", options: ["Website", "Referral", "Outreach", "WhatsApp", "LinkedIn", "Other"] },
      { key: "value", label: "Value (GHS)", type: "money" },
      { key: "next", label: "Next step", type: "text" },
      { key: "brief", label: "Brief", type: "url" },
      { key: "notes", label: "Notes", type: "textarea" },
    ],
    due: "Follow up",
  },
  outreach: {
    label: "Business",
    plural: "Outreach",
    stages: [
      { id: "to-contact", label: "To contact", tone: "muted" },
      { id: "contacted", label: "Contacted", tone: "accent" },
      { id: "replied", label: "Replied" },
      { id: "meeting", label: "Meeting" },
      { id: "proposal", label: "Proposal", tone: "warn" },
      { id: "won", label: "Won", tone: "good" },
      { id: "lost", label: "Lost", tone: "muted" },
      { id: "not-now", label: "Not now", tone: "muted" },
    ],
    fields: [
      { key: "person", label: "Contact person", type: "text" },
      { key: "sector", label: "Sector", type: "select", options: ["Retail", "Building materials", "Restaurant", "Fitness", "Fashion", "Pharmacy", "School", "Hospitality", "Logistics", "Finance", "Church or mosque", "NGO", "Other"] },
      { key: "area", label: "Area", type: "text", placeholder: "East Legon, Madina…" },
      { key: "channel", label: "Best channel", type: "select", options: ["WhatsApp", "Email", "Call", "Visit", "Instagram", "LinkedIn"] },
      { key: "phone", label: "Phone / WhatsApp", type: "tel", placeholder: "+233…" },
      { key: "email", label: "Email", type: "email" },
      { key: "pitch", label: "What I could build them", type: "text" },
      { key: "notes", label: "Notes", type: "textarea" },
    ],
    due: "Next follow-up",
  },
  template: {
    label: "Template",
    plural: "Templates",
    stages: [{ id: "", label: "Templates" }],
    fields: [
      { key: "channel", label: "Channel", type: "select", options: ["WhatsApp", "Email"] },
      { key: "subject", label: "Email subject", type: "text" },
      { key: "body", label: "Message ({name}, {business}, {pitch})", type: "textarea" },
    ],
  },
  book: {
    label: "Book",
    plural: "Reading",
    stages: [
      { id: "to-read", label: "To read", tone: "muted" },
      { id: "reading", label: "Reading", tone: "accent" },
      { id: "done", label: "Read", tone: "good" },
    ],
    fields: [
      { key: "author", label: "Author", type: "text" },
      { key: "takeaway", label: "One thing to keep", type: "textarea" },
    ],
  },
  workout: {
    label: "Session",
    plural: "Workout",
    stages: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => ({ id: d.toLowerCase(), label: d })),
    fields: [
      { key: "exercises", label: "Exercises (one per line, e.g. Bench press 4×8)", type: "textarea" },
      { key: "minutes", label: "Minutes", type: "text" },
    ],
  },
  grad: {
    label: "Programme",
    plural: "Grad school",
    stages: [
      { id: "researching", label: "Researching", tone: "muted" },
      { id: "shortlisted", label: "Shortlisted" },
      { id: "applying", label: "Applying", tone: "accent" },
      { id: "submitted", label: "Submitted", tone: "warn" },
      { id: "admitted", label: "Admitted", tone: "good" },
      { id: "declined", label: "Not this time", tone: "muted" },
    ],
    fields: [
      { key: "school", label: "School", type: "text" },
      { key: "country", label: "Country", type: "text" },
      { key: "funding", label: "Funding", type: "text", placeholder: "Scholarship, assistantship…" },
      { key: "link", label: "Programme page", type: "url" },
      { key: "checklist", label: "Requirements", type: "checklist" },
      { key: "notes", label: "Notes", type: "textarea" },
    ],
    due: "Deadline",
  },
  note: {
    label: "Note",
    plural: "Notes",
    stages: [{ id: "", label: "Notes" }],
    fields: [{ key: "body", label: "Note", type: "textarea" }],
  },
};

export const KIND_IDS = Object.keys(KINDS) as Kind[];
export const isKind = (k: unknown): k is Kind => typeof k === "string" && (KIND_IDS as string[]).includes(k);

/** A requirements list for a new grad school programme: a structure, not facts about anyone. */
export const GRAD_CHECKLIST = ["Shortlist and compare the programme", "Check entry requirements", "GRE / GMAT if required", "English test if required", "Statement of purpose", "CV", "Two or three recommenders asked", "Transcripts requested", "Funding or scholarship application", "Application fee paid", "Submitted"];

/** Fill {name}, {business} and {pitch} in an outreach template. */
export function fillTemplate(body: string, it: { title: string; data: Record<string, unknown> }) {
  const person = String(it.data.person ?? "").trim();
  return body
    .replaceAll("{name}", person ? person.split(/\s+/)[0] : "there")
    .replaceAll("{business}", it.title)
    .replaceAll("{pitch}", String(it.data.pitch ?? "a system that runs the day-to-day").trim());
}

export const waLink = (phone: string, text: string) => `https://wa.me/${phone.replace(/[^\d]/g, "").replace(/^0/, "233")}?text=${encodeURIComponent(text)}`;
export const mailLink = (to: string, subject: string, body: string) => `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
