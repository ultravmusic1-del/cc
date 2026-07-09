"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  /** @deprecated retained for call-site compatibility; the wordmark now
   *  carries its own mark, so there is no separate watermark to toggle. */
  withWatermark?: boolean;
}

// Pixel heights per size; width is derived from the artwork's aspect ratio.
const heights: Record<NonNullable<LogoProps["size"]>, number> = {
  sm: 32,
  md: 36,
  lg: 48,
};
const RATIO = 415 / 95; // cropped logo artwork dimensions

/**
 * Candy Couture bilingual wordmark. Rendered from the brand logo PNG via a CSS
 * mask filled with currentColor, so the burgundy artwork shows as cream on the
 * dark chrome and scales crisply.
 */
export default function Logo({ size = "md", className = "" }: LogoProps) {
  const h = heights[size];
  return (
    <span
      role="img"
      aria-label="Candy Couture"
      className={`inline-block text-cream ${className}`}
      style={{
        height: h,
        width: Math.round(h * RATIO),
        backgroundColor: "currentColor",
        maskImage: "url(/images/candy-couture-logo.png)",
        WebkitMaskImage: "url(/images/candy-couture-logo.png)",
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
