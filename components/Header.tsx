"use client";

import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "./Logo";
import { useNav } from "@/lib/store";

export default function Header() {
  const { goTo, openMenu } = useNav();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--hairline)] bg-[rgba(70,13,27,0.92)] pt-safe backdrop-blur-md">
      <div className="relative mx-auto flex h-16 w-full max-w-[var(--app-max)] items-center px-4">
        <button
          onClick={openMenu}
          aria-label="Open menu"
          className="z-10 flex h-10 w-10 items-center justify-center rounded-full text-cream/90 transition-colors hover:bg-white/5"
        >
          <Menu className="h-[22px] w-[22px]" strokeWidth={1.5} />
        </button>

        {/* Absolutely centred so unequal side buttons never shift it */}
        <button
          onClick={() => goTo("home")}
          aria-label="Candy Couture — home"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <Logo size="sm" />
        </button>

        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => goTo("ordering")}
          aria-label="Ordering information"
          className="z-10 ml-auto flex h-10 items-center justify-center rounded-full border border-[var(--hairline)] px-4 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-cream/90 transition-colors hover:border-coral hover:text-coral"
        >
          Order
        </motion.button>
      </div>
    </header>
  );
}
