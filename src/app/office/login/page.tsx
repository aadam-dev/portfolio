import { redirect } from "next/navigation";
import { Lock } from "lucide-react";
import { signedIn } from "@/lib/office/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function Login() {
  if (await signedIn()) redirect("/office");
  return (
    <main className="theme-fixed relative min-h-screen grid place-items-center overflow-hidden bg-[var(--background)] px-4 text-[var(--foreground)]">
      {/* a quiet glow and grid behind the card */}
      <div aria-hidden className="pointer-events-none absolute inset-0 [background:radial-gradient(600px_circle_at_50%_30%,rgba(255,91,31,0.10),transparent_60%)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
        style={{ backgroundImage: "linear-gradient(rgba(242,238,230,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(242,238,230,0.05) 1px, transparent 1px)", backgroundSize: "44px 44px" }}
      />
      <div className="relative w-full max-w-[380px]">
        <p className="flex items-center justify-center gap-2 text-[15px] font-semibold">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)]" /> Aadam
        </p>
        <div className="card mt-6 p-6 md:p-7 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
          <span className="grid place-items-center w-10 h-10 rounded-full border border-[var(--line-strong)] text-[var(--ink-2)]">
            <Lock className="w-4 h-4" />
          </span>
          <h1 className="mt-4 text-[24px] font-semibold tracking-[-0.02em]">Office</h1>
          <p className="mt-1 text-[13.5px] text-[var(--ink-3)]">Projects, leads, outreach, plans and the site. Enter your code.</p>
          <LoginForm />
        </div>
        <p className="mt-5 text-center text-[12px] text-[var(--ink-4)]">Private. Five wrong codes lock sign-in for 15 minutes. Signing in also stops this browser from being counted as a visitor.</p>
      </div>
    </main>
  );
}
