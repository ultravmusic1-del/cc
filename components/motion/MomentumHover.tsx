"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, registerGsap, hasFinePointer, prefersReducedMotion } from "@/lib/gsap";

/**
 * Physical hover: sweeping the cursor past a child flicks it, and how hard
 * depends on how fast you moved and how far off-centre you clipped it.
 *
 * The torque is the 2D cross product of the offset-from-centre vector and the
 * pointer velocity — swipe through the middle and it slides, catch a corner and
 * it spins. Normalising by the lever distance keeps rotation proportional to
 * pointer *speed* rather than to how far from centre the cursor happened to be,
 * which otherwise makes edges wildly more violent than the middle.
 *
 * Touch devices are excluded outright: there is no hover, and the listeners
 * would just cost memory.
 */
const XY_MULTIPLIER = 22;
const ROTATION_MULTIPLIER = 14;
const RESISTANCE = 170;

export default function MomentumHover({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (!hasFinePointer() || prefersReducedMotion()) return;

    registerGsap();

    const clampXY = gsap.utils.clamp(-1080, 1080);
    const clampRot = gsap.utils.clamp(-60, 60);

    let prevX = 0;
    let prevY = 0;
    let velX = 0;
    let velY = 0;
    let frame = 0;

    // Velocity sampling is throttled to one rAF so a high-polling-rate mouse
    // can't run this dozens of times per frame.
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        velX = e.clientX - prevX;
        velY = e.clientY - prevY;
        prevX = e.clientX;
        prevY = e.clientY;
        frame = 0;
      });
    };

    const onEnter = (e: Event) => {
      const pointer = e as PointerEvent;
      const el = (e.currentTarget as HTMLElement).querySelector<HTMLElement>(
        "[data-momentum-target]",
      );
      if (!el) return;

      const { left, top, width, height } = el.getBoundingClientRect();
      const offsetX = pointer.clientX - (left + width / 2);
      const offsetY = pointer.clientY - (top + height / 2);

      const rawTorque = offsetX * velY - offsetY * velX;
      const lever = Math.hypot(offsetX, offsetY) || 1;

      gsap.to(el, {
        inertia: {
          x: { velocity: clampXY(velX * XY_MULTIPLIER), end: 0 },
          y: { velocity: clampXY(velY * XY_MULTIPLIER), end: 0 },
          rotation: {
            velocity: clampRot((rawTorque / lever) * ROTATION_MULTIPLIER),
            end: 0,
          },
          resistance: RESISTANCE,
        },
      });
    };

    root.addEventListener("pointermove", onMove);
    const items = Array.from(
      root.querySelectorAll<HTMLElement>("[data-momentum-item]"),
    );
    items.forEach((item) => item.addEventListener("pointerenter", onEnter));

    return () => {
      if (frame) cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", onMove);
      items.forEach((item) => item.removeEventListener("pointerenter", onEnter));
      gsap.killTweensOf(
        root.querySelectorAll<HTMLElement>("[data-momentum-target]"),
      );
    };
  }, []);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
