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

const SITE_URL = "https://aadam.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aadam · Studio for product, data & engineering",
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
    title: "Aadam · Studio for product, data & engineering",
    description:
      "20+ production apps. 50+ SMEs evaluated. Independent studio building premium digital products.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aadam · Studio for product, data & engineering",
    description:
      "20+ production apps. 50+ SMEs evaluated. Independent studio building premium digital products.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0A08",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
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
    >
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
