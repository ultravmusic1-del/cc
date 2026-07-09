"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { animate, stagger as aStagger } from "animejs";
import { ArrowRight } from "lucide-react";
import MaskIcon from "../ui/MaskIcon";
import { useNav } from "@/lib/store";
import { useContent, useT, useLang } from "@/lib/i18n";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";

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

/** Splits a line into per-word spans (anime.js targets .hero-word). */
function words(line: string) {
  const parts = line.split(" ");
  return parts.map((w, i) => (
    <Fragment key={i}>
      <span className="hero-word inline-block">{w}</span>
      {i < parts.length - 1 ? " " : ""}
    </Fragment>
  ));
}

export default function HomeScreen() {
  const { goTo } = useNav();
  const c = useContent();
  const t = useT();
  const { lang } = useLang();
  const headlineRef = useRef<HTMLHeadingElement>(null);

  // Anime.js: reveal the headline word by word (rise + fade, staggered).
  // Re-runs on language change; honors reduced-motion. Runs before paint so the
  // words never flash in their final position first.
  useIsoLayoutEffect(() => {
    const el = headlineRef.current;
    if (!el) return;
    const wordEls = el.querySelectorAll<HTMLElement>(".hero-word");
    if (!wordEls.length) return;

    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      wordEls.forEach((w) => (w.style.opacity = "1"));
      return;
    }

    wordEls.forEach((w) => (w.style.opacity = "0"));
    const anim = animate(wordEls, {
      opacity: [0, 1],
      translateY: [26, 0],
      duration: 900,
      delay: aStagger(65, { start: 120 }),
      ease: "out(3)",
    });
    return () => {
      anim.revert();
    };
  }, [lang]);

  return (
    <section className="screen-scroll relative w-full">
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="relative z-10 mx-auto flex min-h-full w-full max-w-[var(--app-max)] flex-col justify-center px-5 pb-28 pt-[4.6rem]"
      >
        {/* Eyebrow */}
        <motion.p
          variants={rise}
          className="eyebrow mt-1 text-center text-[0.72rem] text-[rgba(233,173,190,0.85)]"
        >
          {t.home.eyebrow}
        </motion.p>

        {/* Headline — word-by-word reveal (anime.js) */}
        <h1
          ref={headlineRef}
          className="mt-3.5 text-center font-heading text-[2.35rem] font-semibold leading-[1.03] tracking-[-0.02em] text-cream"
        >
          {words(t.home.line1)}
          <br />
          {words(t.home.line2)}
          <br />
          <span className="font-display font-medium italic text-coral">
            {words(t.home.line3)}
          </span>
        </h1>

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
              src="/images/oat-bar-hero-2.png"
              alt="Stack of Candy Couture handcrafted oat bars"
              width={785}
              height={698}
              priority
              sizes="(max-width: 520px) 60vw, 220px"
              className="h-auto w-full drop-shadow-[0_14px_20px_rgba(15,3,7,0.35)]"
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
              <MaskIcon
                src={b.icon}
                className="h-12 w-12 shrink-0 text-pink"
              />
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
