"use client";

import { motion } from "framer-motion";
import { Boxes, Gift, MapPin, Store } from "lucide-react";
import ScreenShell from "../ScreenShell";
import WhatsAppButton from "../ui/WhatsAppButton";
import Footer from "../Footer";

const points = [
  { icon: Store, title: "Wholesale orders", note: "Available through WhatsApp" },
  { icon: Boxes, title: "Box quantity", note: "10 bars per box" },
  { icon: Gift, title: "Premium gift boxes", note: "Coming soon" },
  { icon: MapPin, title: "Delivery", note: "Bahrain only" },
];

export default function WholesaleScreen() {
  return (
    <ScreenShell>
      <header className="text-center">
        <p className="eyebrow text-[rgba(233,173,190,0.8)]">For business & gifting</p>
        <h1 className="mt-3 font-heading text-[2rem] font-semibold leading-tight text-cream">
          Wholesale & Gifting
        </h1>
        <p className="mt-2 text-[0.9rem] text-[rgba(227,210,194,0.72)]">
          Boutique bars, at scale.
        </p>
      </header>

      <div className="mt-6 flex flex-col gap-3">
        {points.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card flex items-center gap-4 rounded-2xl px-4 py-4"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[rgba(233,173,190,0.35)]">
              <p.icon className="h-5 w-5 text-pink" strokeWidth={1.5} />
            </span>
            <span className="flex-1">
              <span className="block font-heading text-[1.02rem] font-semibold text-cream">
                {p.title}
              </span>
              <span className="block text-[0.78rem] text-[rgba(227,210,194,0.64)]">
                {p.note}
              </span>
            </span>
          </motion.div>
        ))}
      </div>

      <p className="mt-6 text-center text-[0.85rem] leading-relaxed text-[rgba(227,210,194,0.72)]">
        Tell us what you need and we&apos;ll take care of the rest.
      </p>

      <div className="mx-auto mt-4 w-full max-w-[24rem]">
        <WhatsAppButton intent="wholesale" label="Enquire on WhatsApp" />
      </div>

      <Footer />
    </ScreenShell>
  );
}
