import type { Metadata } from "next";
import OrderingScreen from "@/components/screens/OrderingScreen";

const title = "Ordering & Delivery | Candy Couture";
const description =
  "How to order Candy Couture oat bars in Bahrain — minimum 10 bars, 2 BD delivery, free over 50 BD, BenefitPay, 2 PM cutoff for next-day delivery.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/ordering" },
  openGraph: { title, description, url: "/ordering" },
};

export default function OrderingPage() {
  return <OrderingScreen />;
}
