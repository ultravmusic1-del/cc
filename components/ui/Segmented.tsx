"use client";

/**
 * Two-or-more-way switch with a sliding indicator.
 *
 * The indicator is a single absolutely-positioned pill moved by percentage
 * rather than one highlight per option cross-fading. That keeps it a real
 * continuous movement, and it needs no layout measurement — which is what the
 * previous version was doing with a framer-motion `layoutId`.
 *
 * Under RTL the track is laid out right-to-left by the browser, so the offset
 * is negated to travel the same visual direction as the labels.
 */
export default function Segmented<T extends string>({
  value,
  onChange,
  options,
  className = "",
}: {
  value: T;
  onChange: (value: T) => void;
  options: { id: T; label: string }[];
  className?: string;
}) {
  const index = Math.max(
    0,
    options.findIndex((o) => o.id === value),
  );

  // The track has 0.375rem of padding on each side (p-1.5), so the space the
  // options actually share is `100% - 0.75rem`. Sizing the indicator to exactly
  // one nth of THAT means translating by a whole multiple of its own width
  // lands it precisely on each slot, at any option count — no drift to correct.
  const slot = `calc((100% - 0.75rem) / ${options.length})`;

  return (
    <div
      role="tablist"
      className={`relative flex rounded-full bg-[color-mix(in_srgb,var(--slab-ink)_10%,transparent)] p-1.5 ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-y-1.5 rounded-full bg-[var(--slab-ink)] transition-transform duration-500 ease-couture ltr:left-1.5 rtl:right-1.5"
        style={{
          width: slot,
          transform: `translateX(calc(var(--seg-dir, 1) * ${index * 100}%))`,
        }}
      />
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.id)}
            className={`relative z-10 flex-1 rounded-full px-4 py-2.5 text-[0.85rem] font-bold leading-none transition-colors duration-300 ease-couture ${
              active ? "text-[var(--slab-bg)]" : "text-[var(--slab-ink)]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
