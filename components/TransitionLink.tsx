"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { useCurtain } from "./motion/Curtain";

/**
 * A Link that closes the curtain before it navigates.
 *
 * The App Router gives no "route change starting" event, so the only place to
 * hook a leave animation is the click itself: swallow the default, run the
 * cover, then push. `app/template.tsx` remounts on the far side and reveals.
 *
 * Modified clicks (new tab, download, middle click) and external or hash hrefs
 * fall through to the real anchor untouched — hijacking those would break
 * ordinary browser behaviour for no visual gain.
 */
export default function TransitionLink({
  href,
  onClick,
  children,
  ...rest
}: ComponentProps<typeof Link>) {
  const router = useRouter();
  const pathname = usePathname();
  const { cover } = useCurtain();

  const handleClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    const target = typeof href === "string" ? href : href.pathname ?? "";

    const isModified =
      e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
    const isInternal = target.startsWith("/") && !target.startsWith("//");

    if (isModified || !isInternal || target.startsWith("/#")) return;
    // Navigating to where we already are would cover the screen and then have
    // nothing to remount, leaving the curtain stuck shut.
    if (target === pathname) {
      e.preventDefault();
      return;
    }

    e.preventDefault();

    // Race the cover against a deadline. `await cover()` alone makes every
    // navigation depend on a GSAP timeline resolving, and that timeline is
    // rAF-driven — in a throttled tab, or if GSAP ever threw, clicking a link
    // would silently do nothing at all. A link must always navigate; the
    // animation is decoration on top of that, never a gate in front of it.
    await Promise.race([
      cover(),
      new Promise((resolve) => window.setTimeout(resolve, 900)),
    ]);
    router.push(target);
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
