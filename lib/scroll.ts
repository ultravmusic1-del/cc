/**
 * Reset the active screen's internal scroll container to the top.
 *
 * The document itself never scrolls (see globals.css `body { overflow: hidden }`
 * and the `.screen-scroll` per-screen containers), so scroll-to-top is really
 * "put the current screen container back at the top." A freshly-mounted screen
 * already starts at 0; this just covers same-screen re-renders and is a harmless
 * belt-and-suspenders on navigation.
 */
export function scrollToTop() {
  if (typeof window === "undefined") return;
  const screen = document.querySelector<HTMLElement>("main > section");
  if (screen) screen.scrollTop = 0;
}
