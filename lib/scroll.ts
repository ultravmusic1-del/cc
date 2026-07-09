/**
 * Jump the window to the very top *instantly*.
 *
 * The primary mechanism is `Element.scrollIntoView()` on the top page element —
 * this is exactly what the Next.js App Router uses to scroll to top on
 * navigation, and unlike `window.scrollTo(0, 0)` / `scrollTop = 0` it is honored
 * by iOS Safari (WebKit) after a client-side view swap, where the plain scroll
 * writes are silently ignored.
 *
 * Quirks handled:
 *  - `scroll-behavior: smooth` (global on <html>) also applies to programmatic
 *    scrolls, so force instant for the jump.
 *  - keep window.scrollTo + both scrollTops as fallbacks for other engines.
 *
 * iOS is most reliable when this runs (a) inside the tap gesture and
 * (b) re-asserted a frame/tick later — callers do both.
 */
export function scrollToTop() {
  if (typeof window === "undefined") return;
  const html = document.documentElement;
  const body = document.body;
  const htmlPrev = html.style.scrollBehavior;
  const bodyPrev = body.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  body.style.scrollBehavior = "auto";

  // Primary (iOS-reliable): bring the top page element to the top, like Next.js.
  const top = document.querySelector("main > section");
  if (top) top.scrollIntoView({ block: "start", inline: "nearest" });

  // Fallbacks for engines where scrollIntoView isn't sufficient.
  window.scrollTo(0, 0);
  html.scrollTop = 0;
  body.scrollTop = 0;

  html.style.scrollBehavior = htmlPrev;
  body.style.scrollBehavior = bodyPrev;
}
