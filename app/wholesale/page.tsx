import type { Metadata } from "next";
import WholesaleScreen from "@/components/screens/WholesaleScreen";

const title = "Wholesale & Gifting | Candy Couture";
const description =
  "Wholesale oat bars and corporate gifting across Bahrain. Packs of 10, bulk and event orders handled personally over WhatsApp.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/wholesale" },
  openGraph: { title, description, url: "/wholesale" },
};

export default function WholesalePage() {
  return <WholesaleScreen />;
}
