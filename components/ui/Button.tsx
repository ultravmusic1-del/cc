"use client";

import { useRef, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import TransitionLink from "../TransitionLink";
import {
  gsap,
  SplitText,
  registerGsap,
  hasFinePointer,
  prefersReducedMotion,
} from "@/lib/gsap";
import { useLang } from "@/lib/i18n";

/**
 * The site's button, with the reference's letter-squash hover: each character
 * is knocked down and squashed flat, then springs back on a staggered wave.
 *
 * Built lazily on first hover rather than on mount. Splitting every button on
 * the page up front costs a DOM node per character for elements most visitors
 * never touch, and it runs before webfonts settle, which measures the wrong
 * glyph widths.
 *
 * Arabic is exempt: the script is cursive, and splitting it into per-character
 * spans severs the joining forms into isolated letters.
 */
type Variant = "solid" | "ghost" | "ink";

const VARIANTS: Record<Variant, string> = {
  solid: "pill--solid",
  ghost: "pill--ghost",
  ink: "pill--ink",
};

export default function Button({
  children,
  href,
  onClick,
  variant = "solid",
  arrow = false,
  external = false,
  icon,
  className = "",
  ariaLabel,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  arrow?: boolean;
  external?: boolean;
  /**
   * Leading glyph. Must be passed here rather than inside `children`: the
   * label span is what gets split into per-character spans, and nesting a
   * flex wrapper in there turns every character into a flex item, so the
   * button's own `gap` lands between each letter.
   */
  icon?: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const { lang } = useLang();
  const labelRef = useRef<HTMLSpanElement>(null);
  const splitRef = useRef<SplitText | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const builtFor = useRef<string | null>(null);

  const onEnter = () => {
    if (lang === "ar" || !hasFinePointer() || prefersReducedMotion()) return;
    const label = labelRef.current;
    if (!label) return;

    registerGsap();

    // The label element is remounted on a language change, so a timeline built
    // for the previous one targets detached nodes and silently does nothing.
    if (builtFor.current !== lang) {
      tlRef.current?.kill();
      tlRef.current = null;
      splitRef.current = null;
      builtFor.current = lang;
    }

    if (!tlRef.current) {
      splitRef.current = new SplitText(label, {
        type: "chars",
        charsClass: "split-char",
      });
      const chars = splitRef.current.chars;
      gsap.set(chars, { transformOrigin: "center bottom" });

      tlRef.current = gsap.timeline({ paused: true }).to(chars, {
        keyframes: {
          "0%": { yPercent: 0, scaleY: 1, rotate: 0 },
          "22%": { yPercent: 48, scaleY: 0.34, rotate: 15, ease: "power2.in" },
          "100%": { yPercent: 0, scaleY: 1, rotate: 0, ease: "elastic.out(1, 0.4)" },
        },
        duration: 0.72,
        stagger: { amount: 0.22 },
      });
    }

    tlRef.current.restart();
  };

  const classes = `pill ${VARIANTS[variant]} px-6 py-3.5 text-[0.92rem] ${className}`;

  const content = (
    <>
      {icon}
      {/* Keyed on language for the same reason as SplitReveal — and the cached
          split/timeline below belong to the old node, so they are dropped. */}
      <span
        key={lang}
        ref={labelRef}
        className="inline-block whitespace-nowrap"
      >
        {children}
      </span>
      {arrow && (
        <ArrowRight
          className="h-[18px] w-[18px] shrink-0 transition-transform duration-300 ease-couture group-hover:translate-x-1 rtl:-scale-x-100"
          aria-hidden
        />
      )}
    </>
  );

  if (href && external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onPointerEnter={onEnter}
        onClick={onClick}
        aria-label={ariaLabel}
        className={`group ${classes}`}
      >
        {content}
      </a>
    );
  }

  if (href) {
    return (
      <TransitionLink
        href={href}
        onPointerEnter={onEnter}
        onClick={onClick}
        aria-label={ariaLabel}
        className={`group ${classes}`}
      >
        {content}
      </TransitionLink>
    );
  }

  return (
    <button
      type="button"
      onPointerEnter={onEnter}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`group ${classes}`}
    >
      {content}
    </button>
  );
}
