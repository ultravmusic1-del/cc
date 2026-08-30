import type { ElementType, ReactNode } from "react";
import BreathingShapes from "./motion/BreathingShapes";

export type SlabTone =
  | "cream"
  | "beige"
  | "pink"
  | "coral"
  | "olive"
  | "burgundy";

/**
 * One band of colour, and the only sectioning primitive on the site.
 *
 * A slab publishes its ink, accent and rule colours as CSS variables, so
 * anything nested inside recolours itself from context. That is what lets the
 * same ProductCard sit on cream and on burgundy without a single conditional.
 *
 * Two tones are display-only. Nothing in the brand palette reaches 4.5:1 on
 * coral or olive, so those carry headlines and short bold lines and nothing
 * smaller — see the measurements in globals.css and `npm run contrast:check`.
 */
const DISPLAY_ONLY: SlabTone[] = ["coral", "olive"];

export default function Slab({
  children,
  tone = "cream",
  as: Tag = "section",
  inset = false,
  stack = false,
  shapes,
  shapeColor,
  shapeOpacity = 0.45,
  className = "",
  innerClassName = "",
  id,
}: {
  children: ReactNode;
  tone?: SlabTone;
  as?: ElementType;
  /** Float the slab inside the page gutter with a large corner radius. */
  inset?: boolean;
  /** Pull up under the previous slab so the two overlap at the seam. */
  stack?: boolean;
  shapes?: "a" | "b" | "c";
  shapeColor?: string;
  shapeOpacity?: number;
  className?: string;
  innerClassName?: string;
  id?: string;
}) {
  return (
    <Tag
      id={id}
      data-tone={tone}
      data-display-only={DISPLAY_ONLY.includes(tone) || undefined}
      className={[
        "slab",
        `slab--${tone}`,
        inset && "slab--inset",
        stack && "slab--stack",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {shapes && (
        <BreathingShapes
          variant={shapes}
          color={shapeColor ?? "var(--slab-ink)"}
          opacity={shapeOpacity}
        />
      )}
      <div className={`slab__inner ${innerClassName}`}>{children}</div>
    </Tag>
  );
}
