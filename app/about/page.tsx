import type { Metadata } from "next";
import AboutScreen from "@/components/screens/AboutScreen";

export const metadata: Metadata = {
  title: "About | Candy Couture",
  description:
    "Why we started Candy Couture — small-batch oat bars baked fresh in Bahrain with whole grain oats, dark chocolate and no preservatives.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutScreen />;
}
