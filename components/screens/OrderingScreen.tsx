"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  MapPin,
  Truck,
  Gift,
  CreditCard,
  Clock,
  Store,
} from "lucide-react";
import ScreenShell from "../ScreenShell";
import WhatsAppButton from "../ui/WhatsAppButton";
import Footer from "../Footer";
import { ORDERING } from "@/lib/content";

const rules = [
  { icon: ShoppingBag, label: "Minimum order", value: ORDERING.minimum },
  { icon: MapPin, label: "Delivery area", value: ORDERING.deliveryArea },
  { icon: Truck, label: "Delivery fee", value: ORDERING.deliveryFee },
  { icon: Gift, label: "Free delivery over", value: ORDERING.freeDeliveryOver },
  { icon: CreditCard, label: "Payment", value: ORDERING.payment },
  { icon: Clock, label: "Order cutoff", value: "2:00 PM · next-day" },
];

export default function OrderingScreen() {
  return (
    <ScreenShell>
      <header className="text-center">
        <p className="eyebrow text-[rgba(233,173,190,0.8)]">How it works</p>
        <h1 className="mt-3 font-heading text-[2rem] font-semibold leading-tight text-cream">
          Ordering
        </h1>
        <p className="mt-2 text-[0.9rem] text-[rgba(227,210,194,0.72)]">
          Order before 2 PM for next-day delivery.
        </p>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {rules.map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card flex flex-col gap-2 rounded-2xl px-4 py-4"
          >
            <r.icon className="h-5 w-5 text-coral" strokeWidth={1.5} />
            <span className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-[rgba(227,210,194,0.58)]">
              {r.label}
            </span>
            <span className="font-heading text-[0.98rem] font-semibold leading-tight text-cream">
              {r.value}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="glass-card mt-3 flex items-center gap-3 rounded-2xl px-4 py-3.5">
        <Store className="h-5 w-5 shrink-0 text-olive" strokeWidth={1.5} />
        <p className="text-[0.82rem] text-[rgba(227,210,194,0.78)]">
          Wholesale orders are handled personally — just say hello on WhatsApp.
        </p>
      </div>

      <div className="mx-auto mt-6 w-full max-w-[24rem]">
        <WhatsAppButton intent="general" label="Order on WhatsApp" />
      </div>

      <Footer />
    </ScreenShell>
  );
}
