import type { Metadata } from "next";
import GiftingScreen from "@/components/screens/GiftingScreen";

const title = "Gifting | Candy Couture";
const description =
  "Candy Couture gift boxes, handmade in Bahrain: a box of 6 bars for 12 BD or 12 bars for 20 BD, with Oat Cookie and Oat Protein Bars individually wrapped. Delivered across Bahrain.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/gifting" },
  // Per-page OG so a gifting link pasted into WhatsApp renders its own card
  // and og:url — see app/bars/page.tsx for why this is not optional.
  openGraph: { title, description, url: "/gifting" },
};

export default function GiftingPage() {
  return <GiftingScreen />;
}
