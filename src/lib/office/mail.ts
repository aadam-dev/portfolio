import "server-only";

/** The owner's inbox. Every form, ticket and notable visit lands here. */
export const OWNER = "aadamsays@gmail.com";
const FROM = () => process.env.INQUIRY_FROM ?? "Aadam <onboarding@resend.dev>";

export function mailConfigured() {
  return !!process.env.RESEND_API_KEY;
}

export async function sendMail(m: { to: string | string[]; subject: string; html: string; text: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false as const, error: "not_configured" };
  try {
    // RESEND_BASE lets a test point mail at a local capture server
    const res = await fetch(`${process.env.RESEND_BASE ?? "https://api.resend.com"}/emails`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM(),
        to: Array.isArray(m.to) ? m.to : [m.to],
        reply_to: m.replyTo,
        subject: m.subject,
        html: m.html,
        text: m.text,
      }),
    });
    if (!res.ok) {
      console.error("mail failed", res.status, await res.text().catch(() => ""));
      return { ok: false as const, error: "send_failed" };
    }
    return { ok: true as const };
  } catch (e) {
    console.error("mail error", e);
    return { ok: false as const, error: "network" };
  }
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** A plain, branded email: a heading, rows of label and value, an optional block of text and a button. */
export function layout(o: { title: string; intro?: string; rows?: [string, string][]; body?: string; cta?: { href: string; label: string } }) {
  const rows = (o.rows ?? [])
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#7a746b;font-size:13px;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;color:#121110;font-size:14px">${esc(v)}</td></tr>`,
    )
    .join("");
  const html = `<!doctype html><html><body style="margin:0;background:#ece8df;font-family:-apple-system,Segoe UI,Inter,Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:28px 20px">
  <p style="margin:0 0 18px;font-size:15px;font-weight:700;color:#121110"><span style="display:inline-block;width:8px;height:8px;border-radius:8px;background:#ff5b1f;margin-right:8px"></span>Aadam</p>
  <div style="background:#f7f4ee;border:1px solid #ddd6ca;border-radius:14px;padding:22px">
    <h1 style="margin:0 0 6px;font-size:20px;line-height:1.25;color:#121110">${esc(o.title)}</h1>
    ${o.intro ? `<p style="margin:0 0 14px;color:#4a463f;font-size:14px;line-height:1.5">${esc(o.intro)}</p>` : ""}
    ${rows ? `<table style="border-collapse:collapse;margin:6px 0 10px">${rows}</table>` : ""}
    ${o.body ? `<pre style="white-space:pre-wrap;font-family:ui-monospace,Menlo,monospace;font-size:13px;line-height:1.5;background:#ece8df;border-radius:10px;padding:14px;color:#121110;margin:10px 0 0">${esc(o.body)}</pre>` : ""}
    ${o.cta ? `<p style="margin:18px 0 0"><a href="${esc(o.cta.href)}" style="display:inline-block;background:#121110;color:#fff;text-decoration:none;padding:10px 16px;border-radius:999px;font-size:14px">${esc(o.cta.label)}</a></p>` : ""}
  </div>
  <p style="margin:14px 0 0;color:#7a746b;font-size:12px">aadambuilds.dev, Accra</p>
</div></body></html>`;
  const text = [o.title, o.intro ?? "", ...(o.rows ?? []).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`), o.body ?? "", o.cta ? `${o.cta.label}: ${o.cta.href}` : ""]
    .filter(Boolean)
    .join("\n\n");
  return { html, text };
}
