"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, FolderKanban, Home, Megaphone, Settings, UserRoundPlus } from "lucide-react";

const LINKS = [
  { href: "/office", label: "Today", Icon: Home },
  { href: "/office/projects", label: "Projects", Icon: FolderKanban },
  { href: "/office/leads", label: "Leads", Icon: UserRoundPlus },
  { href: "/office/outreach", label: "Outreach", Icon: Megaphone },
  { href: "/office/life", label: "Life", Icon: BookOpen },
  { href: "/office/site", label: "Site", Icon: BarChart3 },
  { href: "/office/settings", label: "Settings", Icon: Settings },
];

export default function Nav() {
  const path = usePathname();
  const on = (h: string) => (h === "/office" ? path === "/office" : path.startsWith(h));
  return (
    <>
      <nav aria-label="Office" className="hidden md:block sticky top-14 self-start pt-7">
        <ul className="space-y-0.5">
          {LINKS.map(({ href, label, Icon }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={on(href) ? "page" : undefined}
                className={`flex items-center gap-2.5 h-10 px-3 rounded-xl text-[13.5px] transition-colors ${on(href) ? "bg-[var(--surface-2)] text-[var(--foreground)]" : "text-[var(--ink-3)] hover:text-[var(--foreground)] hover:bg-[var(--tint)]"}`}
              >
                <Icon className="w-4 h-4" aria-hidden /> {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* phones: a bottom tab bar, all targets 44px+ */}
      <nav aria-label="Office" className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--line)] bg-[#0b0a08]/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
        <ul className="grid grid-cols-7">
          {LINKS.map(({ href, label, Icon }) => (
            <li key={href}>
              <Link href={href} aria-current={on(href) ? "page" : undefined} className={`flex flex-col items-center justify-center gap-0.5 h-14 text-[10px] ${on(href) ? "text-[var(--foreground)]" : "text-[var(--ink-3)]"}`}>
                <Icon className="w-[18px] h-[18px]" aria-hidden />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
