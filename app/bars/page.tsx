import type { Metadata } from "next";
import BarsScreen from "@/components/screens/BarsScreen";

export const metadata: Metadata = {
  title: "Oat Bars | Candy Couture",
  description:
    "Two handcrafted oat bars made fresh in Bahrain — the Oat Cookie Bar and the high-protein Oat Protein Bar. 1.5 and 1.8 BD per bar, packs of 10.",
  alternates: { canonical: "/bars" },
};

export default function BarsPage() {
  return <BarsScreen />;
}
