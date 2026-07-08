"use client";

import { motion } from "framer-motion";

interface Option<T extends string> {
  id: T;
  label: string;
}

interface Props<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (id: T) => void;
  layoutId?: string;
  className?: string;
}

export default function Segmented<T extends string>({
  options,
  value,
  onChange,
  layoutId = "segmented",
  className = "",
}: Props<T>) {
  return (
    <div
      role="tablist"
      className={`relative flex rounded-full border border-[var(--hairline)] bg-[rgba(58,10,21,0.55)] p-1 ${className}`}
    >
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.id)}
            className="relative flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors"
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full btn-coral"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span
              className={`relative z-10 ${
                active ? "text-cream" : "text-[rgba(227,210,194,0.66)]"
              }`}
            >
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
