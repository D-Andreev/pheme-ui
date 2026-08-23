import { useReducedMotion } from "framer-motion";
import type { Easing, Transition, Variants } from "framer-motion";

/**
 * Framer Motion's `motion.*` components redefine a handful of native
 * event props (drag/animation lifecycle) with their own animation-aware
 * signatures. Any component prop type that extends `HTMLAttributes` and
 * then spreads onto a `motion.*` element should `Omit` these — otherwise
 * TypeScript sees two incompatible signatures for the same prop name.
 */
export type MotionConflictingProps =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration";

/**
 * JS-side mirror of `tokens.css`'s `--motion-duration-*` values (in
 * seconds — Framer Motion's unit — since a `transition` prop can't read a
 * CSS custom property). Keep these numbers in sync with `tokens.css` by
 * hand; there's no build step that shares them.
 */
export const MOTION_DURATION: Record<"fast" | "base" | "slow", number> = {
  fast: 0.12,
  base: 0.2,
  slow: 0.32,
};

/** Mirrors `--motion-ease-*` as cubic-bezier tuples, typed for Framer Motion's `Easing`. */
export const MOTION_EASE: Record<"standard" | "out" | "in", Easing> = {
  standard: [0.4, 0, 0.2, 1],
  out: [0, 0, 0.2, 1],
  in: [0.4, 0, 1, 1],
};

export type MotionSpeed = keyof typeof MOTION_DURATION;

/**
 * Reads `prefers-reduced-motion` (via Framer Motion's own media-query
 * hook) and returns the durations to animate with — the real token values
 * normally, or near-zero for every speed when the user has asked for
 * reduced motion. Use this instead of `MOTION_DURATION` directly in any
 * component that animates.
 */
export function useMotionDurations(): Record<"fast" | "base" | "slow", number> {
  const reduced = useReducedMotion();
  if (!reduced) return MOTION_DURATION;
  return { fast: 0.01, base: 0.01, slow: 0.01 };
}

/** A standard `transition` for the given speed, reduced-motion aware. */
export function useMotionTransition(speed: MotionSpeed = "base"): Transition {
  const durations = useMotionDurations();
  return { duration: durations[speed], ease: MOTION_EASE.standard };
}

/**
 * Fade + slight rise entrance/exit — used for overlays and panels
 * (`Lightbox`, `ImagePreview`, `ArtifactPanel`) that mount/unmount rather
 * than just toggling visibility.
 */
export const fadeRiseVariants: Variants = {
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 8, scale: 0.98 },
};

/** Plain fade — used where a rise/scale would fight the layout (overlays). */
export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/** Entrance for a new chat message appended to the thread. */
export const messageEnterVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};
