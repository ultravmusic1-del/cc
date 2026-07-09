import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect on the client (runs before paint, so entrance animations
 * never flash their un-animated state), useEffect on the server to avoid the
 * SSR warning.
 */
export const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
