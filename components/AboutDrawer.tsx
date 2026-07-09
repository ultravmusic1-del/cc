"use client";

import { useEffect, useRef } from "react";
import { motion, useDragControls, useIsPresent } from "framer-motion";
import { X } from "lucide-react";
import WhatsAppButton from "./ui/WhatsAppButton";
import type { AboutDrawerId } from "@/lib/store";
import { useContent, useT, fill } from "@/lib/i18n";

export default function AboutDrawer({
  drawerId,
  onClose,
}: {
  drawerId: AboutDrawerId;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const isPresent = useIsPresent();
  const c = useContent();
  const ui = useT();

  const titles: Record<AboutDrawerId, string> = {
    "about-us": ui.drawer.aboutUs,
    philosophy: ui.drawer.philosophy,
    gifting: ui.drawer.gifting,
  };

  // ESC to close + initial focus. (Scroll lock is centralized in App's Shell.)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => ref.current?.focus(), 30);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [onClose]);

  return (
    <div
      style={{ pointerEvents: isPresent ? undefined : "none" }}
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(20,4,9,0.72)] backdrop-blur-sm"
      />

      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        tabIndex={-1}
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.4 }}
        onDragEnd={(_, info) => info.offset.y > 120 && onClose()}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="panel-bg relative z-10 flex max-h-[90dvh] w-full max-w-[var(--app-max)] flex-col overflow-hidden rounded-t-[2rem] border border-[var(--hairline)] shadow-float sm:max-h-[84dvh] sm:rounded-[2rem]"
      >
        <div
          onPointerDown={(e) => dragControls.start(e)}
          className="flex cursor-grab justify-center pt-3 active:cursor-grabbing sm:hidden"
          style={{ touchAction: "none" }}
        >
          <span className="h-1 w-11 rounded-full bg-[rgba(233,173,190,0.35)]" />
        </div>

        <div className="flex items-center justify-between px-5 pb-3 pt-3">
          <h2
            id="drawer-title"
            className="font-heading text-xl font-semibold text-cream"
          >
            {titles[drawerId]}
          </h2>
          <button
            onClick={onClose}
            aria-label={ui.modal.close}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--hairline)] text-cream/80 transition-colors hover:text-cream"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="hairline" />

        <div className="soft-scroll flex-1 overflow-y-auto px-5 py-5">
          {drawerId === "about-us" && (
            <div className="space-y-4">
              <p className="text-[0.95rem] leading-relaxed text-[rgba(227,210,194,0.85)]">
                {c.brand.storyLede}
              </p>
              <p className="text-[0.95rem] leading-relaxed text-[rgba(227,210,194,0.8)]">
                {c.brand.storyBody}
              </p>
              <p className="text-[0.95rem] leading-relaxed text-[rgba(227,210,194,0.8)]">
                {c.brand.storyClose}
              </p>
              <div className="glass-card rounded-2xl px-4 py-4">
                <p className="font-display text-lg italic text-coral">
                  “{ui.drawer.quote}”
                </p>
                <p className="mt-2 text-[0.78rem] text-[rgba(227,210,194,0.6)]">
                  {fill(ui.drawer.handcraftedIn, { location: c.brand.location })}
                </p>
              </div>
            </div>
          )}

          {drawerId === "philosophy" && (
            <div className="space-y-4">
              <p className="font-display text-lg italic leading-snug text-coral">
                {c.philosophy.lede}
              </p>
              <p className="text-[0.95rem] leading-relaxed text-[rgba(227,210,194,0.82)]">
                {c.philosophy.body}
              </p>
            </div>
          )}

          {drawerId === "gifting" && (
            <div className="space-y-4">
              <div className="glass-card space-y-3 rounded-2xl px-4 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-[0.84rem] text-[rgba(227,210,194,0.72)]">
                    {ui.drawer.boxQty}
                  </span>
                  <span className="text-[0.88rem] font-semibold text-cream">
                    {ui.drawer.boxQtyVal}
                  </span>
                </div>
                <div className="hairline" />
                <div className="flex items-center justify-between">
                  <span className="text-[0.84rem] text-[rgba(227,210,194,0.72)]">
                    {ui.drawer.giftBoxes}
                  </span>
                  <span className="rounded-full border border-[rgba(233,173,190,0.4)] px-3 py-1 text-[0.68rem] font-semibold text-pink">
                    {ui.drawer.comingSoon}
                  </span>
                </div>
                <div className="hairline" />
                <div className="flex items-center justify-between">
                  <span className="text-[0.84rem] text-[rgba(227,210,194,0.72)]">
                    {ui.drawer.delivery}
                  </span>
                  <span className="text-[0.88rem] font-semibold text-cream">
                    {ui.drawer.deliveryVal}
                  </span>
                </div>
              </div>
              <p className="text-[0.88rem] leading-relaxed text-[rgba(227,210,194,0.78)]">
                {ui.drawer.giftingText}
              </p>
              <WhatsAppButton intent="wholesale" label={ui.drawer.enquire} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
