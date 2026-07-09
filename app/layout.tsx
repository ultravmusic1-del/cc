import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Hanken_Grotesk, Open_Sans, Cairo } from "next/font/google";
import "./globals.css";

const display = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const heading = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const body = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-body",
  display: "swap",
});

// Arabic face — the Latin families above have poor/fallback Arabic glyphs.
// Applied on <html dir="rtl"> via a rule in globals.css.
const arabic = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.candycouture.co"),
  title: "Candy Couture | Handcrafted Oat Bars in Bahrain",
  description:
    "Handcrafted oat bars made in Bahrain with whole grain oats, dark chocolate, and real ingredients. Choose from Oat Cookie Bar and Oat Protein Bar.",
  keywords: [
    "Candy Couture",
    "oat bars Bahrain",
    "protein oat bar",
    "oat cookie bar",
    "healthy treats Bahrain",
    "handmade oat bars",
  ],
  authors: [{ name: "Candy Couture" }],
  openGraph: {
    title: "Candy Couture | Handcrafted Oat Bars in Bahrain",
    description:
      "Wholesome oat bars, freshly baked in Bahrain. Choose from the Oat Cookie Bar and Oat Protein Bar.",
    type: "website",
    locale: "en_BH",
    siteName: "Candy Couture",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#611224",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${heading.variable} ${body.variable} ${arabic.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
