import type { Metadata } from "next";
import BarsScreen from "@/components/screens/BarsScreen";

const title = "Oat Bars | Candy Couture";
const description =
  "Two handcrafted oat bars made fresh in Bahrain — the Oat Cookie Bar and the high-protein Oat Protein Bar. 1.5 and 1.8 BD per bar, packs of 10.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/bars" },
  // Per-page OG is not optional here. Without it Next inherits the root
  // layout's openGraph wholesale, so every route shares the homepage card AND
  // og:url — and WhatsApp/Facebook treat og:url as canonical identity, so every
  // share would consolidate onto one homepage object. On a storefront where
  // ordering happens by pasting links into WhatsApp, that defeats the point of
  // having per-page URLs at all.
  openGraph: { title, description, url: "/bars" },
};

export default function BarsPage() {
  return <BarsScreen />;
}
