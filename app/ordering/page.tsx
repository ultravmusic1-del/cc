import type { Metadata } from "next";
import OrderingScreen from "@/components/screens/OrderingScreen";

export const metadata: Metadata = {
  title: "Ordering & Delivery | Candy Couture",
  description:
    "How to order Candy Couture oat bars in Bahrain — minimum 10 bars, 2 BD delivery, free over 50 BD, BenefitPay, 2 PM cutoff for next-day delivery.",
  alternates: { canonical: "/ordering" },
};

export default function OrderingPage() {
  return <OrderingScreen />;
}
