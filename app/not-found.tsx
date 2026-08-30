import Link from "next/link";
import { ROUTES } from "@/lib/routes";

/**
 * Branded 404.
 *
 * Reachable and shareable by design: `bars/[slug]` sets `dynamicParams = false`,
 * so every mistyped or stale product URL lands here — and product URLs are
 * exactly the ones that get shared.
 *
 * Plain links rather than TransitionLink: this renders outside the normal page
 * flow and must work even when something upstream has failed, so it does not
 * depend on the curtain context existing.
 */
export default function NotFound() {
  return (
    <section className="slab slab--burgundy flex min-h-[100svh] items-center">
      <div className="slab__inner w-full">
        <div className="mx-auto max-w-[24ch] text-center">
          <p className="eyebrow">404</p>
          <h1 className="display-l mx-auto mt-5 font-display font-black">
            This page doesn&rsquo;t exist
          </h1>
          <p className="mt-6 text-[1rem] leading-relaxed text-[var(--slab-ink-soft)]">
            The link may be out of date. Everything we make is still one tap
            away.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href={ROUTES.bars} className="pill pill--solid px-6 py-3.5">
              See the bars
            </Link>
            <Link href={ROUTES.home} className="pill pill--ghost px-6 py-3.5">
              Back home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
