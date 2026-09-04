import type { Metadata } from "next";
import WholesaleScreen from "@/components/screens/WholesaleScreen";

const title = "Wholesale | Candy Couture";
const description =
  "Wholesale oat bars across Bahrain. Packs of 10, bulk, event and business orders handled personally over WhatsApp.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/wholesale" },
  openGraph: { title, description, url: "/wholesale" },
};

export default function WholesalePage() {
  return <WholesaleScreen />;
}
