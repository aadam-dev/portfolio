import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Back office",
  robots: { index: false, follow: false },
};

export default function OfficeLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
