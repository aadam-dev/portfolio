import { redirect } from "next/navigation";
import { signedIn } from "@/lib/office/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function Login() {
  if (await signedIn()) redirect("/office");
  return (
    <main className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-[360px]">
        <p className="font-display text-[22px] text-white">Aadam</p>
        <h1 className="mt-6 font-display text-[32px] leading-none text-white">Back office</h1>
        <LoginForm />
      </div>
    </main>
  );
}
