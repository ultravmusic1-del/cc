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
import { useContent, useT } from "@/lib/i18n";

export default function OrderingScreen() {
  const c = useContent();
  const t = useT();

  const rules = [
    { icon: ShoppingBag, label: t.ordering.minimum, value: c.ordering.minimum },
    { icon: MapPin, label: t.ordering.deliveryArea, value: c.ordering.deliveryArea },
    { icon: Truck, label: t.ordering.deliveryFee, value: c.ordering.deliveryFee },
    {
      icon: Gift,
      label: t.ordering.freeOver,
      value: c.ordering.freeDeliveryOver,
    },
    { icon: CreditCard, label: t.ordering.payment, value: c.ordering.payment },
    { icon: Clock, label: t.ordering.cutoff, value: c.ordering.cutoff },
  ];

  return (
    <ScreenShell>
      <header className="text-center">
        <p className="eyebrow text-[rgba(233,173,190,0.8)]">
          {t.ordering.eyebrow}
        </p>
        <h1 className="mt-3 font-heading text-[2rem] font-semibold leading-tight text-cream lg:text-[2.75rem]">
          {t.ordering.title}
        </h1>
        <p className="mt-2 text-[0.9rem] text-[rgba(227,210,194,0.72)]">
          {t.ordering.subtitle}
        </p>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:mt-10 lg:grid-cols-3 lg:gap-5">
        {rules.map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card flex flex-col gap-2 rounded-2xl px-4 py-4 lg:px-6 lg:py-6"
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
        <Store className="h-5 w-5 shrink-0 text-pink" strokeWidth={1.5} />
        <p className="text-[0.82rem] text-[rgba(227,210,194,0.78)]">
          {t.ordering.wholesaleNote}
        </p>
      </div>

      <div className="mx-auto mt-6 w-full max-w-[24rem]">
        <WhatsAppButton intent="general" label={t.ordering.orderCta} />
      </div>

      <Footer />
    </ScreenShell>
  );
}
