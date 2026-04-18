import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://aadam.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aadam — Studio for product, data & engineering",
    template: "%s · Aadam",
  },
  description:
    "Independent studio designing and shipping premium digital products across EdTech, FinTech, PropTech, e-commerce and enterprise ERP. 20+ production apps. 50+ SMEs evaluated. Available globally.",
  keywords: [
    "product studio",
    "full-stack developer",
    "investment analysis",
    "business analysis",
    "data & business analysis",
    "data strategy",
    "data rooms",
    "documentation",
    "Next.js",
    "TypeScript",
    "Africa",
    "Ghana",
    "fintech",
    "edtech",
  ],
  authors: [{ name: "Aadam" }],
  creator: "Aadam",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Aadam",
    title: "Aadam — Studio for product, data & engineering",
    description:
      "20+ production apps. 50+ SMEs evaluated. Independent studio building premium digital products.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aadam — Studio for product, data & engineering",
    description:
      "20+ production apps. 50+ SMEs evaluated. Independent studio building premium digital products.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#08080C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetBrainsMono.variable}`}
    >
      <body className="antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
