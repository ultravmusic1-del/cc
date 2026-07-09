"use client";

import { Menu, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "./Logo";
import { useNav } from "@/lib/store";
import { useT } from "@/lib/i18n";

export default function Header() {
  const { goTo, openMenu } = useNav();
  const t = useT();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--hairline)] bg-[rgba(70,13,27,0.92)] pt-safe backdrop-blur-md">
      {/* Three equal-weight zones keep the wordmark dead-centre while the
          menu and Order controls sit symmetrically at the edges. */}
      <div className="mx-auto flex h-16 w-full max-w-[var(--app-max)] items-center px-4">
        <div className="flex flex-1 items-center justify-start">
          <button
            onClick={openMenu}
            aria-label={t.header.openMenu}
            className="flex h-10 w-10 items-center justify-center rounded-full text-cream/90 transition-colors hover:bg-white/5"
          >
            <Menu className="h-[22px] w-[22px]" strokeWidth={1.5} />
          </button>
        </div>

        <button
          onClick={() => goTo("home")}
          aria-label={t.header.home}
          className="shrink-0"
        >
          <Logo size="md" />
        </button>

        <div className="flex flex-1 items-center justify-end">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => goTo("ordering")}
            aria-label={t.header.ordering}
            className="flex h-10 w-10 items-center justify-center rounded-full text-cream/90 transition-colors hover:bg-white/5 hover:text-coral"
          >
            <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.5} />
          </motion.button>
        </div>
      </div>
    </header>
  );
}
