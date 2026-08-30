import type { Metadata, Viewport } from "next";
import {
  Bodoni_Moda,
  Gabarito,
  Hanken_Grotesk,
  Caveat,
  Cairo,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import AppShell from "@/components/AppShell";
import "./globals.css";

/**
 * Display face — the chunky, slightly quirky grotesque the whole layout hangs
 * on. Stands in for the reference site's commercially-licensed Champ; Gabarito
 * has the same dense, rounded, high-weight character and goes to 900.
 */
const display = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const body = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

/** Handwritten marginalia. Always tilted, always short, never body copy. */
const note = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-note",
  display: "swap",
});

/** Kept only for the "Couture" half of the wordmark — brand equity. */
const couture = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["italic"],
  variable: "--font-couture",
  display: "swap",
});

/** Arabic face — the Latin families above have no real Arabic glyphs. */
const arabic = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Candy Couture | Handcrafted Oat Bars in Bahrain",
  description:
    "Handcrafted oat bars made in Bahrain with whole grain oats, dark chocolate, and real ingredients. Choose from Oat Cookie Bar and Oat Protein Bar.",
  alternates: { canonical: "/" },
  authors: [{ name: "Candy Couture" }],
  openGraph: {
    title: "Candy Couture | Handcrafted Oat Bars in Bahrain",
    description:
      "Wholesome oat bars, freshly baked in Bahrain. Choose from the Oat Cookie Bar and Oat Protein Bar.",
    url: "/",
    type: "website",
    locale: "en_BH",
    siteName: "Candy Couture",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  // Cream, not burgundy: the browser chrome should match the new ground.
  themeColor: "#f4e8dc",
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
      className={`${display.variable} ${body.variable} ${note.variable} ${couture.variable} ${arabic.variable}`}
    >
      <body className="antialiased">
        <JsonLd />
        <AppShell>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  );
}
