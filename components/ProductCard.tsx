"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import TransitionLink from "./TransitionLink";
import { productPath } from "@/lib/routes";
import type { Product } from "@/lib/content";
import { useT } from "@/lib/i18n";

/**
 * A bar, presented as an object sitting on the slab rather than a boxed tile.
 *
 * The image is deliberately outside the card's rounded body and overlaps its
 * top edge, so the product breaks the frame. That overlap is what stops a row
 * of these reading as a grid of rectangles — and it is why the wrapper cannot
 * clip its overflow.
 *
 * `data-momentum-item` / `data-momentum-target` opt this into the inertia flick
 * when an ancestor is a <MomentumHover>. Both are no-ops on touch.
 */
export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const t = useT();
  const badge =
    product.id === "protein" ? t.card.highProtein : t.card.classic;

  // Alternating rest angles so a pair never looks like two aligned rectangles.
  const tilt = index % 2 === 0 ? -3 : 3.5;

  return (
    <TransitionLink
      href={productPath(product.id)}
      data-momentum-item
      className="group relative block"
    >
      <div
        data-momentum-target
        className="relative will-change-transform"
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        <div className="relative mx-auto -mb-20 w-[62%] max-w-[15rem]">
          <Image
            src={product.image}
            alt={product.imageAlt}
            width={785}
            height={698}
            sizes="(min-width: 768px) 240px, 45vw"
            className="h-auto w-full drop-shadow-[0_18px_28px_color-mix(in_srgb,var(--burgundy)_45%,transparent)]"
          />
        </div>

        <article className="card relative flex flex-col gap-4 px-6 pb-7 pt-24 text-brand-burgundy shadow-drop">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow !text-[color-mix(in_srgb,var(--burgundy)_60%,transparent)]">
                {badge}
              </p>
              <h3 className="mt-2 font-display text-[clamp(1.4rem,3.4vw,2rem)] font-black leading-[0.95] tracking-tight">
                {product.name}
              </h3>
            </div>
            <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-burgundy text-brand-cream transition-transform duration-300 ease-couture group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </span>
          </div>

          <p className="text-[0.92rem] leading-relaxed text-[color-mix(in_srgb,var(--burgundy)_78%,transparent)]">
            {product.tagline}
          </p>

          <div className="mt-auto flex flex-wrap gap-1.5">
            {product.ingredientChips.slice(0, 3).map((chip) => (
              <span
                key={chip}
                className="rounded-full bg-brand-pink px-3 py-1.5 text-[0.75rem] font-bold leading-none"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="flex items-baseline gap-2 border-t border-[color-mix(in_srgb,var(--burgundy)_14%,transparent)] pt-4">
            <span className="font-display text-2xl font-black leading-none">
              {product.pricePerBar}
            </span>
            <span className="text-[0.8rem] font-semibold opacity-70">
              {t.card.perBar}
            </span>
          </div>
        </article>
      </div>
    </TransitionLink>
  );
}
