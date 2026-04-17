import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aadam — Analyst & Full-Stack Developer",
  description:
    "Portfolio of a multi-disciplinary builder: investment and business analysis, data analysis, business development, and software engineering. 20+ production apps shipped across Africa and West Africa.",
  keywords: ["analyst", "developer", "full-stack", "investment analysis", "business analysis", "data analysis", "portfolio", "Next.js", "TypeScript", "Africa", "West Africa", "fintech", "edtech"],
  openGraph: {
    title: "Aadam — Analyst & Full-Stack Developer",
    description: "Investment & business analysis, data analysis, business development, software engineering. 20+ production apps. 50+ SMEs evaluated.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="noise antialiased">{children}</body>
    </html>
  );
}
