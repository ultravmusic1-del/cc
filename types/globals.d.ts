import type Lenis from "lenis";

declare global {
  interface Window {
    /** Set by components/motion/SmoothScroll. Absent under reduced motion. */
    __lenis?: Lenis;
  }
}

export {};
