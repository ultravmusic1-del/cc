"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  withWatermark?: boolean;
  className?: string;
}

const sizes = {
  sm: { line: "text-[0.78rem]", gap: "leading-[1.05]", tracking: "0.42em" },
  md: { line: "text-base", gap: "leading-[1.02]", tracking: "0.44em" },
  lg: { line: "text-xl", gap: "leading-[1.0]", tracking: "0.46em" },
};

/** Centred Candy Couture wordmark with the couture "C" behind it. */
export default function Logo({
  size = "md",
  withWatermark = true,
  className = "",
}: LogoProps) {
  const s = sizes[size];
  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {withWatermark && (
        <span
          aria-hidden
          className="c-watermark pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-[52%] font-display text-[3.4em]"
          style={{ color: "rgba(233,173,190,0.14)" }}
        >
          C
        </span>
      )}
      <span
        className={`relative z-10 font-display font-medium text-cream ${s.line} ${s.gap}`}
        style={{ letterSpacing: s.tracking }}
      >
        CANDY
      </span>
      <span
        className={`relative z-10 font-display font-medium text-cream ${s.line} ${s.gap}`}
        style={{ letterSpacing: s.tracking }}
      >
        COUTURE
      </span>
    </div>
  );
}
