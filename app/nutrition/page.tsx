import type { Metadata } from "next";
import NutritionScreen from "@/components/screens/NutritionScreen";

const title = "Nutrition | Candy Couture";
const description =
  "Full nutrition for both Candy Couture oat bars — calories, protein, sugar and fibre per 75–80g bar. Honest numbers for every bar.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/nutrition" },
  openGraph: { title, description, url: "/nutrition" },
};

export default function NutritionPage() {
  return <NutritionScreen />;
}
