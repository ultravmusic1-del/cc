import type { Metadata } from "next";
import WholesaleScreen from "@/components/screens/WholesaleScreen";

export const metadata: Metadata = {
  title: "Wholesale & Gifting | Candy Couture",
  description:
    "Wholesale oat bars and corporate gifting across Bahrain. Packs of 10, bulk and event orders handled personally over WhatsApp.",
  alternates: { canonical: "/wholesale" },
};

export default function WholesalePage() {
  return <WholesaleScreen />;
}
