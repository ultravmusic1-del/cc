"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { useNav } from "@/lib/store";
import { ROUTES } from "@/lib/routes";
import { useContent, useT } from "@/lib/i18n";
import { trackGiftingPromo } from "@/lib/analytics";

/**
 * One-time launch announcement for the gifting collection.
 *
 * Shows once per browser session, 1.4s after the first screen has settled,
 * and never on /gifting itself (landing there counts as having seen it). It is
 * a store overlay (`promo`) so the shared scroll lock applies and it can never
 * open on top of the menu or a drawer — `openPromo` is a no-op while anything
 * else is up.
 *
 * Exit is opacity + scale, not `y: "100%"`: a vertical exit only clears the
 * viewport while bottom-anchored (see the modal geometry note in HANDOFF.md),
 * and this card is centred at every width. No `layoutId` anywhere.
 *
 * Retire this component when the launch window closes — delete it and the
 * `promo` overlay type in lib/store.tsx; nothing else depends on either.
 */

const STORAGE_KEY = "cc-gifting-promo";
const DELAY_MS = 1400;

/** Created once at module scope — re-creating a motion component during render
    remounts it and loses the animation state. */
const MotionLink = motion.create(Link);

function markSeen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* private mode etc. — the popup simply shows again next load */
  }
}

function hasSeen() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function PromoCard({ onClose }: { onClose: () => void }) {
  const t = useT();
  const c = useContent();
  // Once dismissed, stop intercepting clicks immediately even if the exit
  // animation stalls (RAF-throttled tab), so it can never wedge the page.
  const isPresent = useIsPresent();

  // Only the CTA counts as "explore"; every other way out is a dismissal.
  const explore = () => {
    trackGiftingPromo("explore");
    onClose();
  };
  const dismiss = () => {
    trackGiftingPromo("dismiss");
    onClose();
  };

  useEffect(() => {
    trackGiftingPromo("shown");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      trackGiftingPromo("dismiss");
      onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      style={{ pointerEvents: isPresent ? undefined : "none" }}
      className="fixed inset-0 z-[70] flex items-center justify-center px-5"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={dismiss}
        className="absolute inset-0 bg-[rgba(20,4,9,0.72)] backdrop-blur-sm"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={t.promo.aria}
        aria-labelledby="promo-title"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="panel-bg relative z-10 w-full max-w-[380px] overflow-hidden rounded-[2rem] border border-[var(--hairline)] shadow-float"
      >
        {/* Photograph strip — cropped to the box, faded into the panel. */}
        <div className="relative h-44 w-full">
          <Image
            src={c.gifting.image}
            alt=""
            fill
            sizes="380px"
            className="object-cover object-[50%_38%]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(88,16,31,0) 40%, rgba(88,16,31,0.92) 100%)",
            }}
          />
          <button
            onClick={dismiss}
            aria-label={t.promo.close}
            className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(244,232,220,0.3)] bg-[rgba(20,4,9,0.35)] text-cream/90 backdrop-blur-sm transition-colors hover:bg-[rgba(20,4,9,0.55)] hover:text-cream"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <div className="px-6 pb-6 pt-1 text-center">
          <p className="eyebrow text-coral">{t.promo.eyebrow}</p>
          <h2
            id="promo-title"
            className="mt-2 font-heading text-[1.55rem] font-semibold leading-tight text-cream"
          >
            {t.promo.title}
          </h2>
          <p className="mt-2 text-[0.88rem] leading-relaxed text-[rgba(227,210,194,0.78)]">
            {t.promo.body}
          </p>

          <MotionLink
            href={ROUTES.gifting}
            onClick={explore}
            whileTap={{ scale: 0.98 }}
            className="btn-coral group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[0.95rem] font-semibold tracking-wide"
          >
            {t.promo.cta}
            <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1 rtl:-scale-x-100" />
          </MotionLink>
          <button
            onClick={dismiss}
            className="btn-ghost mt-2.5 w-full rounded-full px-6 py-3 text-[0.88rem] font-semibold tracking-wide transition-colors hover:border-[rgba(227,210,194,0.7)]"
          >
            {t.promo.dismiss}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function GiftingPromo() {
  const { overlay, openPromo, closeOverlay } = useNav();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === ROUTES.gifting) {
      // Arriving on the page is the announcement's whole purpose — don't nag.
      markSeen();
      return;
    }
    if (hasSeen()) return;
    // Kill switch: the `gifting-promo` flag in Vercel. If the check fails the
    // popup still shows, which is how the site behaved before the flag.
    let id: number | undefined;
    let cancelled = false;
    fetch("/api/flags")
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((flags: { giftingPromo?: boolean } | null) => {
        if (cancelled || flags?.giftingPromo === false) return;
        id = window.setTimeout(openPromo, DELAY_MS);
      });
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [pathname, openPromo]);

  const dismiss = () => {
    markSeen();
    closeOverlay();
  };

  return (
    <AnimatePresence>
      {overlay?.type === "promo" && <PromoCard key="promo" onClose={dismiss} />}
    </AnimatePresence>
  );
}
