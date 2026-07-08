"use client";

import {
  Flame,
  Dumbbell,
  Wheat,
  ChefHat,
  Sparkles,
  Leaf,
  Cookie,
  Milk,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  flame: Flame,
  dumbbell: Dumbbell,
  wheat: Wheat,
  chef: ChefHat,
  sparkle: Sparkles,
  leaf: Leaf,
  cocoa: Cookie,
  butter: Milk,
};

export default function Icon({
  name,
  className = "",
  strokeWidth = 1.4,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = map[name] ?? Sparkles;
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden />;
}
