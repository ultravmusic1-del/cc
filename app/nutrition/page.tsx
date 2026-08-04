import type { Metadata } from "next";
import NutritionScreen from "@/components/screens/NutritionScreen";

export const metadata: Metadata = {
  title: "Nutrition | Candy Couture",
  description:
    "Full nutrition for both Candy Couture oat bars — calories, protein, sugar and fibre per 75–80g bar. Honest numbers for every bar.",
  alternates: { canonical: "/nutrition" },
};

export default function NutritionPage() {
  return <NutritionScreen />;
}
