"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

/**
 * Full-screen burgundy panel chrome shared by every "screen" of the microsite.
 * Handles header/sticky-nav safe padding and page transitions.
 */
export default function ScreenShell({
  children,
  center = false,
  className = "",
}: {
  children: ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <motion.section
      variants={variants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="screen-scroll relative w-full"
    >
      <div
        className={`relative z-10 mx-auto flex min-h-full w-full max-w-[var(--app-max)] flex-col px-5 pb-28 pt-20 lg:px-8 lg:pb-20 lg:pt-28 ${
          center ? "justify-center" : ""
        } ${className}`}
      >
        {children}
      </div>
    </motion.section>
  );
}
