import { NextResponse } from "next/server";

const TO = "aadamsays@gmail.com";

export async function POST(request: Request) {
  let body: { name?: string; contact?: string; budget?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = body.name?.trim().slice(0, 200);
  const contact = body.contact?.trim().slice(0, 200);
  const budget = body.budget?.trim().slice(0, 50) || "unspecified";
  const message = body.message?.trim().slice(0, 5000);
  if (!name || !contact || !message) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // No email provider configured — tell the client to use the WhatsApp fallback.
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.INQUIRY_FROM ?? "Portfolio <onboarding@resend.dev>",
      to: [TO],
      reply_to: contact.includes("@") ? contact : undefined,
      subject: `Project inquiry — ${name} (${budget})`,
      text: `Name: ${name}\nContact: ${contact}\nBudget: ${budget}\n\n${message}`,
    }),
  });

  if (!res.ok) {
    console.error("inquiry send failed", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
