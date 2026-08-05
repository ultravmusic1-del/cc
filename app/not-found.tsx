import Link from "next/link";
import ScreenShell from "@/components/ScreenShell";
import { ROUTES } from "@/lib/routes";

/**
 * Branded 404.
 *
 * Needed because Tier 2 made this state reachable and shareable. `bars/[slug]`
 * sets `dynamicParams = false`, so every mistyped or stale product URL lands
 * here — and those are exactly the URLs this work exists to get shared.
 *
 * Without this file, Next's built-in 404 renders INSIDE the app shell (the
 * chrome now lives in the root layout) and injects `body{color:#000;background:#fff}`,
 * producing black text on the burgundy stage, under the fixed header, in a
 * container that is not a `.screen-scroll`.
 *
 * Wraps `ScreenShell` like every other page so the scroll model holds here too.
 */
export default function NotFound() {
  return (
    <ScreenShell center>
      <div className="mx-auto max-w-[32ch] text-center">
        <p className="eyebrow text-[rgba(233,173,190,0.8)]">404</p>
        <h1 className="mt-3 font-heading text-[2rem] font-semibold leading-tight text-cream lg:text-[2.5rem]">
          This page doesn&rsquo;t exist
        </h1>
        <p className="mt-4 text-[0.9rem] leading-relaxed text-[rgba(227,210,194,0.7)]">
          The link may be out of date. Everything we make is still one tap away.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href={ROUTES.bars}
            className="btn-coral rounded-full px-6 py-3 text-[0.85rem] font-semibold"
          >
            See the bars
          </Link>
          <Link
            href={ROUTES.home}
            className="btn-ghost rounded-full px-6 py-3 text-[0.85rem] font-semibold"
          >
            Back home
          </Link>
        </div>
      </div>
    </ScreenShell>
  );
}
