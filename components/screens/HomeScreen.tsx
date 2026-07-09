"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import MaskIcon from "../ui/MaskIcon";
import { useNav } from "@/lib/store";
import { useContent, useT } from "@/lib/i18n";

const stagger = {
  animate: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const rise = {
  initial: { opacity: 0, y: 22 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HomeScreen() {
  const { goTo } = useNav();
  const c = useContent();
  const t = useT();

  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden">
      {/* Ambient couture C */}
      <span
        aria-hidden
        className="c-watermark absolute -left-24 top-10 select-none font-display text-[26rem] lg:hidden"
      >
        C
      </span>

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[var(--app-max)] flex-col justify-center px-5 pb-28 pt-[4.6rem]"
      >
        {/* Eyebrow */}
        <motion.p
          variants={rise}
          className="eyebrow mt-1 text-center text-[0.72rem] text-[rgba(233,173,190,0.85)]"
        >
          {t.home.eyebrow}
        </motion.p>

        {/* Headline */}
        <motion.h1
          variants={rise}
          className="mt-3.5 text-center font-heading text-[2.35rem] font-semibold leading-[1.03] tracking-[-0.02em] text-cream"
        >
          {t.home.line1}
          <br />
          {t.home.line2}
          <br />
          <span className="font-display font-medium italic text-coral">
            {t.home.line3}
          </span>
        </motion.h1>

        {/* Hero bars — static, grounded, flush */}
        <motion.div
          variants={rise}
          className="relative mx-auto mt-4 flex w-full max-w-[280px] items-center justify-center"
        >
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[82%] w-[86%] -translate-x-1/2 -translate-y-[54%] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(236,91,69,0.22), rgba(236,91,69,0) 66%)",
            }}
          />
          {/* grounded contact shadow */}
          <div
            aria-hidden
            className="absolute bottom-2 left-1/2 h-6 w-[62%] -translate-x-1/2 rounded-[100%]"
            style={{
              background:
                "radial-gradient(ellipse, rgba(10,2,5,0.55), rgba(10,2,5,0) 72%)",
              filter: "blur(5px)",
            }}
          />
          <div className="relative w-[76%]">
            <Image
              src="/images/oat-bar-hero.png"
              alt="Stack of Candy Couture handcrafted oat bars"
              width={1080}
              height={952}
              priority
              sizes="(max-width: 520px) 60vw, 220px"
              className="h-auto w-full drop-shadow-[0_18px_22px_rgba(15,3,7,0.4)]"
            />
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div variants={rise} className="mt-5 flex flex-col gap-2.5">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => goTo("bars")}
            className="btn-coral group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[0.95rem] font-semibold tracking-wide"
          >
            {t.home.chooseBar}
            <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1 rtl:-scale-x-100" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => goTo("about")}
            className="btn-ghost inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-[0.9rem] font-semibold tracking-wide"
          >
            {t.home.ourStory}
          </motion.button>
        </motion.div>

        {/* What's inside — three signature pillars */}
        <motion.div variants={rise} className="mt-5 grid grid-cols-3 gap-2.5">
          {c.heroBenefits.map((b) => (
            <div
              key={b.title}
              className="glass-card flex flex-col items-center justify-start gap-2.5 rounded-2xl px-2 py-4 text-center"
            >
              {b.icon.includes("-olive") ? (
                // Already tinted (keeps internal detail) — render as-is.
                <span
                  aria-hidden
                  className="h-9 w-9 shrink-0 bg-contain bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${b.icon})` }}
                />
              ) : (
                <MaskIcon src={b.icon} className="h-9 w-9 shrink-0 text-olive" />
              )}
              <span className="text-[0.64rem] font-semibold uppercase leading-tight tracking-[0.1em] text-[rgba(227,210,194,0.82)]">
                {b.title}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
