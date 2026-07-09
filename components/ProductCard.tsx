"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Box } from "lucide-react";
import type { Product } from "@/lib/content";
import { useNav } from "@/lib/store";
import WhatsAppButton from "./ui/WhatsAppButton";

export default function ProductCard({ product }: { product: Product }) {
  const { openProduct } = useNav();
  const isCoral = product.accent === "coral";
  const accent = isCoral ? "#ec5b45" : "#e9adbe";

  return (
    <motion.article
      className="glass-card relative flex h-full flex-col overflow-hidden rounded-[1.6rem] p-3.5"
      style={{
        borderColor: isCoral ? "rgba(236,91,69,0.4)" : "rgba(233,173,190,0.28)",
      }}
    >
      {/* accent glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{
          background: `radial-gradient(70% 100% at 50% 0%, ${
            isCoral ? "rgba(236,91,69,0.22)" : "rgba(233,173,190,0.16)"
          }, transparent 70%)`,
        }}
      />

      {/* tag */}
      <div className="relative z-10 flex justify-center">
        <span
          className="whitespace-nowrap rounded-full px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-[0.16em]"
          style={{
            color: accent,
            background: isCoral
              ? "rgba(236,91,69,0.14)"
              : "rgba(233,173,190,0.12)",
            border: `1px solid ${
              isCoral ? "rgba(236,91,69,0.4)" : "rgba(233,173,190,0.32)"
            }`,
          }}
        >
          {isCoral ? "High Protein" : "Classic"}
        </span>
      </div>

      {/* image */}
      <button
        onClick={() => openProduct(product.id)}
        className="relative z-10 mx-auto mt-1 flex aspect-square w-[82%] items-center justify-center"
        aria-label={`View ${product.name}`}
      >
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[86%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: `radial-gradient(ellipse at 50% 46%, ${
              isCoral ? "rgba(236,91,69,0.34)" : "rgba(233,173,190,0.26)"
            }, transparent 66%)`,
          }}
        />
        <Image
          src={product.image}
          alt={product.imageAlt}
          width={600}
          height={600}
          sizes="(max-width: 520px) 45vw, 220px"
          className="relative h-auto w-full drop-shadow-[0_14px_18px_rgba(15,3,7,0.45)]"
        />
      </button>

      {/* name + tagline */}
      <h3 className="relative z-10 mt-1 text-center font-heading text-[1.02rem] font-semibold leading-tight text-cream">
        {product.name}
      </h3>
      <p className="relative z-10 mt-1 text-center text-[0.72rem] leading-snug text-[rgba(227,210,194,0.62)]">
        {product.tagline}
      </p>

      <div className="hairline my-3" />

      {/* price */}
      <div className="relative z-10 flex items-baseline justify-center gap-1">
        <span className="font-heading text-[1.55rem] font-bold leading-none text-cream">
          {product.pricePerBar}
        </span>
        <span className="text-[0.72rem] font-medium text-[rgba(227,210,194,0.6)]">
          /bar
        </span>
      </div>
      <p className="relative z-10 mt-1 text-center text-[0.68rem] text-[rgba(227,210,194,0.5)]">
        {product.pricePerBox} per box of 10
      </p>

      {/* meta */}
      <div className="relative z-10 mt-2.5 flex items-center justify-center gap-1.5 whitespace-nowrap text-[0.66rem] text-[rgba(227,210,194,0.66)]">
        <Box className="h-3.5 w-3.5 shrink-0 text-olive" strokeWidth={1.5} />
        Box of 10 · Min. 10
      </div>

      {/* actions — pushed to the bottom so both cards align */}
      <div className="relative z-10 mt-auto flex flex-col gap-2 pt-4">
        <WhatsAppButton
          intent={product.id}
          label="WhatsApp"
          className="!gap-1.5 !px-3 !py-2.5 !text-[0.82rem]"
        />
        <button
          onClick={() => openProduct(product.id)}
          className="btn-ghost rounded-full px-4 py-2 text-[0.76rem] font-semibold tracking-wide transition-colors hover:border-coral hover:text-coral"
        >
          View Details
        </button>
      </div>
    </motion.article>
  );
}
