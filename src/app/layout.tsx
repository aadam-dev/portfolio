import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono, Archivo } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import "./globals.css";
import SmoothScroll from "@/components/site/SmoothScroll";

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

const TITLE = "Aadam · Forward deployed engineer";
const DESCRIPTION =
  "Forward deployed engineer in Accra (GMT+0, overlaps EU and US East). I embed with operators, analysts and coaches, ship the system they run on, and stay until the numbers move. 20+ systems in production: POS, ERP and Odoo, finance models, commerce and data.";
const SHORT =
  "I embed with operators, ship the system they run on, and stay until the numbers move. 20+ systems in production.";

/** Runs before paint so the saved theme never flashes. Day is the default. */
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("fk-theme");if(t!=="light"&&t!=="dark")t="light";document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme="light";}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Aadam",
  },
  description: DESCRIPTION,
  keywords: [
    "forward deployed engineer",
    "remote software engineer",
    "full-stack engineer",
    "Odoo ERP",
    "point of sale",
    "financial modelling",
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
    title: TITLE,
    description: SHORT,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SHORT,
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
      data-theme="light"
      suppressHydrationWarning
      className={`${inter.variable} ${instrumentSerif.variable} ${jetBrainsMono.variable} ${archivo.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a href="#main" className="skip-link">
            {t("skipToContent")}
          </a>
          <SmoothScroll>{children}</SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
