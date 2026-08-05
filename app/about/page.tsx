import type { Metadata } from "next";
import AboutScreen from "@/components/screens/AboutScreen";

const title = "About | Candy Couture";
const description =
  "Why we started Candy Couture — small-batch oat bars baked fresh in Bahrain with whole grain oats, dark chocolate and no preservatives.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: { title, description, url: "/about" },
};

export default function AboutPage() {
  return <AboutScreen />;
}
