/**
 * Jump the window to the very top *instantly*.
 *
 * Works around several quirks:
 *  - `scroll-behavior: smooth` (global on <html>) also applies to programmatic
 *    scroll writes, so we force instant on both scrollers for the jump.
 *  - iOS Safari reports scroll on <body> in some cases (not <html>), so reset
 *    both, plus window.scrollTo.
 *
 * iOS is much more reliable when the reset happens (a) inside the tap gesture
 * and (b) re-asserted a frame/tick later — so callers do both.
 */
export function scrollToTop() {
  if (typeof window === "undefined") return;
  const html = document.documentElement;
  const body = document.body;
  const htmlPrev = html.style.scrollBehavior;
  const bodyPrev = body.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  body.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  html.scrollTop = 0;
  body.scrollTop = 0;
  html.style.scrollBehavior = htmlPrev;
  body.style.scrollBehavior = bodyPrev;
}
