import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono, Archivo } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import "./globals.css";
import SmoothScroll from "@/components/site/SmoothScroll";
import { themeInitScript } from "@/components/fieldkit/useTheme";
import VisitTracker from "@/components/site/VisitTracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-archivo",
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

const SITE_URL = "https://aadambuilds.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aadam · Forward deployed engineer",
    template: "%s · Aadam",
  },
  description:
    "Forward deployed engineer in Accra. I embed with operators, analysts and coaches, ship the systems they run on, and stay until the numbers move. 20+ systems in production across POS, ERP, commerce and finance.",
  keywords: [
    "forward deployed engineer",
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
    title: "Aadam · Forward deployed engineer",
    description:
      "I embed with operators, analysts and coaches and ship the systems they run on. 20+ systems in production.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aadam · Forward deployed engineer",
    description:
      "I embed with operators, analysts and coaches and ship the systems they run on. 20+ systems in production.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ECE8DF" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0A08" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations("common");
  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${inter.variable} ${instrumentSerif.variable} ${jetBrainsMono.variable} ${archivo.variable}`}
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        {/* Applies the saved day/night choice before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a href="#main" className="skip-link">
            {t("skipToContent")}
          </a>
          <SmoothScroll>{children}</SmoothScroll>
        </NextIntlClientProvider>
        <VisitTracker />
      </body>
    </html>
  );
}
