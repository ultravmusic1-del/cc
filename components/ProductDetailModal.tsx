"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { X } from "lucide-react";
import type { Product } from "@/lib/content";
import { STORAGE } from "@/lib/content";
import WhatsAppButton from "./ui/WhatsAppButton";
import CountUp from "./ui/CountUp";

type TabId = "overview" | "ingredients" | "nutrition" | "storage" | "allergens";
const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "ingredients", label: "Ingredients" },
  { id: "nutrition", label: "Nutrition" },
  { id: "storage", label: "Storage" },
  { id: "allergens", label: "Allergens" },
];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--hairline)] py-2.5 last:border-b-0">
      <span className="text-[0.82rem] text-[rgba(227,210,194,0.7)]">{label}</span>
      <span className="text-[0.85rem] font-semibold text-cream">{value}</span>
    </div>
  );
}

export default function ProductDetailModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<TabId>("overview");
  const panelRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const isCoral = product.accent === "coral";

  // ESC to close + focus trap. (Scroll lock is centralized in App's Shell.)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => panelRef.current?.focus(), 30);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(20,4,9,0.72)] backdrop-blur-sm"
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pd-title"
        tabIndex={-1}
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.4 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120) onClose();
        }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="panel-bg relative z-10 flex max-h-[92dvh] w-full max-w-[var(--app-max)] flex-col overflow-hidden rounded-t-[2rem] border border-[var(--hairline)] shadow-float sm:max-h-[88dvh] sm:rounded-[2rem]"
      >
        {/* grab handle — the ONLY drag trigger, so scrolling the body below
            never hijacks into a sheet drag (was a "frozen scroll" bug) */}
        <div
          onPointerDown={(e) => dragControls.start(e)}
          className="flex cursor-grab justify-center pt-3 active:cursor-grabbing sm:hidden"
          style={{ touchAction: "none" }}
        >
          <span className="h-1 w-11 rounded-full bg-[rgba(233,173,190,0.35)]" />
        </div>

        {/* header */}
        <div className="flex items-center gap-3 px-5 pb-3 pt-3">
          <div
            className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
            style={{
              background: isCoral
                ? "rgba(236,91,69,0.14)"
                : "rgba(233,173,190,0.12)",
            }}
          >
            <Image
              src={product.image}
              alt=""
              width={120}
              height={120}
              sizes="44px"
              className="h-auto w-11"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="text-[0.6rem] font-bold uppercase tracking-[0.18em]"
              style={{ color: isCoral ? "#ec5b45" : "#e9adbe" }}
            >
              {isCoral ? "High Protein" : "Classic"}
            </p>
            <h2
              id="pd-title"
              className="truncate font-heading text-lg font-semibold text-cream"
            >
              {product.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--hairline)] text-cream/80 transition-colors hover:text-cream"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* tabs */}
        <div
          role="tablist"
          className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-3"
        >
          {TABS.map((t) => {
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={`relative shrink-0 rounded-full px-4 py-2 text-[0.78rem] font-semibold transition-colors ${
                  active
                    ? "text-cream"
                    : "text-[rgba(227,210,194,0.6)] hover:text-cream"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="pd-tab"
                    className="absolute inset-0 rounded-full btn-coral"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hairline" />

        {/* content */}
        <div className="soft-scroll min-h-[42dvh] flex-1 overflow-y-auto px-5 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              {tab === "overview" && (
                <div>
                  <p className="mb-3 text-[0.9rem] leading-relaxed text-[rgba(227,210,194,0.82)]">
                    {product.description}
                  </p>
                  <div className="glass-card rounded-2xl px-4 py-1.5">
                    <Row label="Serving size" value={product.servingSize} />
                    <Row label="Price" value={`${product.pricePerBar} / bar`} />
                    <Row label="Per box" value={`${product.pricePerBox} · 10 bars`} />
                    <Row label="Minimum order" value={product.moq} />
                    <Row label="Shelf life" value={product.shelfLife} />
                    <Row label="Made" value="Handmade in Bahrain" />
                  </div>
                </div>
              )}

              {tab === "ingredients" && (
                <div>
                  <p className="text-[0.88rem] leading-relaxed text-[rgba(227,210,194,0.82)]">
                    {product.ingredients}
                  </p>
                  <p className="eyebrow mt-4 mb-2 text-[rgba(233,173,190,0.7)]">
                    Hero ingredients
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredientChips.map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-[rgba(159,149,54,0.4)] bg-[rgba(159,149,54,0.1)] px-3 py-1.5 text-[0.74rem] font-medium text-[#d7d59a]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {tab === "nutrition" && (
                <div>
                  <p className="mb-3 text-[0.76rem] text-[rgba(227,210,194,0.6)]">
                    Per {product.servingSize.toLowerCase()}
                  </p>
                  <div className="mb-3 grid grid-cols-2 gap-2">
                    {product.nutrition
                      .filter((n) => n.highlight)
                      .map((n) => (
                        <div
                          key={n.label}
                          className="glass-card flex flex-col items-center rounded-2xl py-3"
                        >
                          <span className="font-heading text-xl font-bold text-coral">
                            <CountUp value={n.value} duration={1100} />
                          </span>
                          <span className="text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-[rgba(227,210,194,0.6)]">
                            {n.label}
                          </span>
                        </div>
                      ))}
                  </div>
                  <div className="glass-card rounded-2xl px-4 py-1.5">
                    {product.nutrition
                      .filter((n) => !n.highlight)
                      .map((n) => (
                        <Row key={n.label} label={n.label} value={n.value} />
                      ))}
                  </div>
                </div>
              )}

              {tab === "storage" && (
                <div className="glass-card rounded-2xl px-4 py-1.5">
                  <Row label="Shelf life" value={STORAGE.shelfLife} />
                  <div className="border-b border-[var(--hairline)] py-3 last:border-b-0">
                    <p className="text-[0.85rem] leading-relaxed text-[rgba(227,210,194,0.82)]">
                      {STORAGE.keep}
                    </p>
                  </div>
                  <div className="py-3">
                    <p className="text-[0.85rem] text-cream">{STORAGE.made}</p>
                  </div>
                </div>
              )}

              {tab === "allergens" && (
                <div className="glass-card rounded-2xl p-4">
                  <p className="text-[0.9rem] leading-relaxed text-[rgba(227,210,194,0.85)]">
                    {product.allergens}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Gluten", "Dairy", "Nuts"].map((a) => (
                      <span
                        key={a}
                        className="rounded-full border border-[rgba(236,91,69,0.4)] bg-[rgba(236,91,69,0.1)] px-3 py-1.5 text-[0.74rem] font-semibold text-coral"
                      >
                        Contains {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* sticky CTA */}
        <div className="border-t border-[var(--hairline)] bg-[rgba(45,9,17,0.7)] px-5 py-3.5 pb-safe backdrop-blur-md">
          <div className="mb-2 flex items-baseline justify-center gap-1.5">
            <span className="font-heading text-lg font-bold text-cream">
              {product.pricePerBar}
            </span>
            <span className="text-[0.72rem] text-[rgba(227,210,194,0.55)]">
              / bar · {product.pricePerBox} per box
            </span>
          </div>
          <WhatsAppButton intent={product.id} label="Order on WhatsApp" />
        </div>
      </motion.div>
    </div>
  );
}
