"use client";

import { useEffect } from "react";

/**
 * Route-level error boundary. Any uncaught render error in the app lands
 * here instead of white-screening the whole SPA (which users experience as
 * a "crash"). Gives them a way back with state intact where possible.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to the console (and any attached monitoring) for diagnosis.
    console.error(error);
  }, [error]);

  return (
    <div className="slab slab--burgundy flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <div className="relative z-10 flex max-w-sm flex-col items-center">
        <p className="eyebrow ">Something went wrong</p>
        <h1 className="mt-3 font-display text-3xl font-black tracking-tight">
          A small hiccup on our end
        </h1>
        <p className="mt-2 text-[0.9rem] leading-relaxed text-[var(--slab-ink-soft)]">
          The page hit an unexpected error. Try again — your place is kept.
        </p>
        <button
          onClick={reset}
          className="pill pill--solid mt-7 px-7 py-3.5"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
