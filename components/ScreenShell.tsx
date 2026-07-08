"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

/**
 * Full-screen burgundy panel chrome shared by every "screen" of the microsite.
 * Handles header/sticky-nav safe padding, the C watermark and page transitions.
 */
export default function ScreenShell({
  children,
  watermark = true,
  center = false,
  className = "",
}: {
  children: ReactNode;
  watermark?: boolean;
  center?: boolean;
  className?: string;
}) {
  return (
    <motion.section
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-h-[100dvh] w-full overflow-hidden"
    >
      {watermark && (
        <span
          aria-hidden
          className="c-watermark absolute -right-16 top-24 select-none font-display text-[22rem]"
        >
          C
        </span>
      )}
      <div
        className={`relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[var(--app-max)] flex-col px-5 pb-28 pt-20 ${
          center ? "justify-center" : ""
        } ${className}`}
      >
        {children}
      </div>
    </motion.section>
  );
}
