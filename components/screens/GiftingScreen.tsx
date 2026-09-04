"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Leaf, MapPin, Truck } from "lucide-react";
import ScreenShell from "../ScreenShell";
import WhatsAppButton from "../ui/WhatsAppButton";
import Footer from "../Footer";
import type { GiftBoxId } from "@/lib/content";
import type { WhatsAppIntent } from "@/lib/whatsapp";
import { useContent, useT } from "@/lib/i18n";

/**
 * The gifting collection: one photograph, two boxes, the ordering facts.
 *
 * Facts (names, contents, prices) come from `useContent().gifting`; page copy
 * from `useT().gifting`. Nothing here is hardcoded, so the Arabic bundle
 * renders through the same markup with RTL handled by the document `dir`.
 *
 * The photograph was shot on a burgundy backdrop that is almost the stage
 * colour, so rather than framing it hard it is faded into the page at the
 * bottom edge. Portrait 2:3 source; the mobile frame crops it to 4:5 so the
 * box stays the subject without pushing the cards a full viewport down.
 */

const INTENT: Record<GiftBoxId, WhatsAppIntent> = {
  six: "giftSix",
  twelve: "giftTwelve",
};

const ease = [0.22, 1, 0.36, 1] as const;

function Row({
  icon: Ico,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[var(--hairline)] py-3 last:border-b-0">
      <Ico className="h-4 w-4 shrink-0 text-coral" strokeWidth={1.5} />
      <span className="flex-1 text-[0.8rem] text-[rgba(227,210,194,0.7)]">
        {label}
      </span>
      <span className="text-end text-[0.84rem] font-semibold text-cream">
        {value}
      </span>
    </div>
  );
}

export default function GiftingScreen() {
  const c = useContent();
  const t = useT();
  const boxes = [c.gifting.boxes.six, c.gifting.boxes.twelve];

  return (
    <ScreenShell>
      <div className="lg:mx-auto lg:w-full lg:max-w-[960px]">
        <header className="text-center lg:text-start">
          <p className="eyebrow text-[rgba(233,173,190,0.8)]">
            {t.gifting.eyebrow}
          </p>
          <h1 className="mt-3 font-heading text-[2rem] font-semibold leading-tight text-cream lg:text-[2.75rem]">
            {t.gifting.title}
          </h1>
          <p className="mt-2 text-[0.9rem] text-[rgba(227,210,194,0.72)] lg:text-[1rem]">
            {t.gifting.subtitle}
          </p>
        </header>

        <div className="mt-6 lg:mt-10 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-10">
          {/* ── Photograph ──────────────────────────────────────
              The outer div stretches to the grid row so the inner frame can
              stay pinned while the cards scroll past it on desktop. */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease }}
              // Phones get a 5:4 crop so the first price card peeks above
              // the fold; a 4:5 portrait pushed it to ~780px on a 375×812
              // screen. Tablets and desktop have the height to spare.
              className="relative mx-auto aspect-[5/4] w-full max-w-[420px] overflow-hidden rounded-[1.6rem] border border-[var(--hairline)] shadow-card sm:aspect-[4/5] lg:sticky lg:top-24 lg:aspect-[3/4] lg:max-w-none"
            >
              <Image
                src={c.gifting.image}
                alt={c.gifting.imageAlt}
                fill
                // LCP element on this route — never lazy-load it.
                priority
                sizes="(min-width: 1024px) 420px, 90vw"
                className="object-cover object-[50%_42%]"
              />
              {/* Blend the bottom edge into the stage; keep the top crisp. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(74,13,27,0) 62%, rgba(74,13,27,0.72) 100%)",
                }}
              />
              <p className="eyebrow absolute inset-x-5 bottom-4 text-center text-[rgba(244,232,220,0.85)]">
                {t.home.eyebrow}
              </p>
            </motion.div>
          </div>

          {/* ── Copy + boxes ────────────────────────────────────── */}
          <div className="mt-6 lg:mt-0">
            <p className="text-[0.92rem] leading-relaxed text-[rgba(227,210,194,0.82)] lg:text-[0.98rem]">
              {t.gifting.intro}
            </p>

            <div className="mt-5 flex flex-col gap-3 lg:gap-4">
              {boxes.map((box, i) => {
                // Mirror the bar accents: pink for the classic size, coral for
                // the larger one, so the pair reads like the product cards.
                const isCoral = box.id === "twelve";
                const accent = isCoral ? "#ec5b45" : "#e9adbe";
                return (
                  <motion.article
                    key={box.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.12 + i * 0.1, ease }}
                    className="glass-card relative overflow-hidden rounded-[1.6rem] p-4 lg:p-5"
                    style={{
                      borderColor: isCoral
                        ? "rgba(236,91,69,0.4)"
                        : "rgba(233,173,190,0.28)",
                    }}
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 top-0 h-20"
                      style={{
                        background: `radial-gradient(70% 100% at 50% 0%, ${
                          isCoral ? "rgba(236,91,69,0.2)" : "rgba(233,173,190,0.14)"
                        }, transparent 70%)`,
                      }}
                    />

                    <div className="relative z-10 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <span
                          className="inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-[0.16em]"
                          style={{
                            color: accent,
                            background: isCoral
                              ? "rgba(236,91,69,0.14)"
                              : "rgba(233,173,190,0.12)",
                            border: `1px solid ${
                              isCoral ? "rgba(236,91,69,0.4)" : "rgba(233,173,190,0.32)"
                            }`,
                          }}
                        >
                          {box.barCount}
                        </span>
                        <h2 className="mt-2 font-heading text-[1.25rem] font-semibold leading-tight text-cream lg:text-[1.4rem]">
                          {box.name}
                        </h2>
                      </div>
                      <div className="shrink-0 text-end">
                        <span className="block font-heading text-[1.7rem] font-bold leading-none text-cream lg:text-[1.9rem]">
                          {box.price}
                        </span>
                        <span className="mt-1 block text-[0.68rem] font-medium text-[rgba(227,210,194,0.6)]">
                          {t.gifting.perBox}
                        </span>
                      </div>
                    </div>

                    <div className="hairline my-3.5" />

                    <p className="relative z-10 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[rgba(233,173,190,0.7)]">
                      {t.gifting.inside}
                    </p>
                    <p className="relative z-10 mt-1 text-[0.88rem] leading-snug text-[rgba(227,210,194,0.85)]">
                      {box.contents}
                    </p>

                    <div className="relative z-10 mt-4">
                      <WhatsAppButton
                        intent={INTENT[box.id]}
                        label={t.gifting.orderBox}
                        className="!py-3 !text-[0.84rem]"
                      />
                    </div>
                  </motion.article>
                );
              })}
            </div>

            {/* ── Good to know ──────────────────────────────────── */}
            <section aria-labelledby="gifting-details" className="mt-6 lg:mt-8">
              <h2
                id="gifting-details"
                className="font-heading text-[1.15rem] font-semibold text-cream"
              >
                {t.gifting.detailsTitle}
              </h2>
              <div className="glass-card mt-3 rounded-2xl px-4 py-1">
                <Row icon={MapPin} label={t.gifting.delivery} value={t.gifting.deliveryVal} />
                <Row icon={Truck} label={t.gifting.deliveryFee} value={t.gifting.deliveryFeeVal} />
                <Row icon={Clock} label={t.gifting.cutoff} value={t.gifting.cutoffVal} />
                <Row icon={Leaf} label={t.gifting.freshness} value={t.gifting.freshnessVal} />
              </div>
            </section>

            <p className="mt-6 text-center text-[0.85rem] leading-relaxed text-[rgba(227,210,194,0.72)] lg:text-start">
              {t.gifting.closing}
            </p>
            <div className="mx-auto mt-4 w-full max-w-[24rem] lg:mx-0">
              <WhatsAppButton intent="gifting" label={t.gifting.enquire} />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </ScreenShell>
  );
}
