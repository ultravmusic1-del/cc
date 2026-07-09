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
    <div className="stage-bg flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <span
        aria-hidden
        className="c-watermark absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[20rem]"
      >
        C
      </span>
      <div className="relative z-10 flex max-w-sm flex-col items-center">
        <p className="eyebrow text-[rgba(233,173,190,0.8)]">Something went wrong</p>
        <h1 className="mt-3 font-heading text-2xl font-semibold text-cream">
          A small hiccup on our end
        </h1>
        <p className="mt-2 text-[0.9rem] leading-relaxed text-[rgba(227,210,194,0.72)]">
          The page hit an unexpected error. Try again — your place is kept.
        </p>
        <button
          onClick={reset}
          className="btn-coral mt-6 inline-flex items-center justify-center rounded-full px-7 py-3 text-[0.9rem] font-semibold tracking-wide"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
