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
  title: "Aadam — Investment Analyst & Full-Stack Developer",
  description:
    "Portfolio of a multi-disciplinary builder operating at the intersection of investment analysis, software engineering, and business operations. 20+ production apps shipped across Ghana and West Africa.",
  keywords: ["developer", "full-stack", "investment analyst", "portfolio", "Next.js", "TypeScript", "Ghana", "West Africa", "fintech", "edtech"],
  openGraph: {
    title: "Aadam — Investment Analyst & Full-Stack Developer",
    description: "20+ production apps. 50+ SMEs evaluated. Real products, real code.",
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
      <body className="noise">{children}</body>
    </html>
  );
}
