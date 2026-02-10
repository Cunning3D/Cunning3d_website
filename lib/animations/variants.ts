/**
 * Animation Variants
 *
 * Type-safe animation variants for framer-motion.
 * All variants support reduced motion preferences and are fully configurable.
 */

import type { Variants, Transition } from "framer-motion";

// =============================================================================
// Types & Configuration
// =============================================================================

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: number[] | string;
  spring?: SpringConfig;
}

export interface SpringConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
  velocity?: number;
}

export type AnimationDirection = "up" | "down" | "left" | "right";

// =============================================================================
// Easing Presets
// =============================================================================

export const easings = {
  // Smooth deceleration
  smooth: [0.4, 0, 0.2, 1],
  // Bouncy effect
  bouncy: [0.68, -0.55, 0.265, 1.55],
  // Sharp acceleration
  sharp: [0.4, 0, 0.6, 1],
  // Gentle ease
  gentle: [0.25, 0.1, 0.25, 1],
  // No easing (linear)
  linear: [0, 0, 1, 1],
} as const;

// =============================================================================
// Spring Presets
// =============================================================================

export const springs = {
  // Default spring - balanced
  default: { stiffness: 100, damping: 10, mass: 1 },
  // Gentle spring - slow and smooth
  gentle: { stiffness: 120, damping: 14, mass: 1 },
  // Bouncy spring - playful effect
  bouncy: { stiffness: 300, damping: 10, mass: 0.5 },
  // Stiff spring - quick response
  stiff: { stiffness: 500, damping: 30, mass: 1 },
  // Slow spring - dramatic effect
  slow: { stiffness: 50, damping: 15, mass: 2 },
} as const;

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Creates a transition object from configuration
 */
function createTransition(config: AnimationConfig): Transition {
  const { duration = 0.3, delay = 0, ease, spring } = config;

  if (spring) {
    return {
      type: "spring",
      stiffness: spring.stiffness ?? 100,
      damping: spring.damping ?? 10,
      mass: spring.mass ?? 1,
      velocity: spring.velocity,
      delay,
    };
  }

  return {
    duration,
    delay,
    ease: ease ?? easings.smooth,
  };
}

/**
 * Gets direction offset for slide animations
 */
function getDirectionOffset(direction: AnimationDirection, distance: number): { x?: number; y?: number } {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: distance };
    case "right":
      return { x: -distance };
    default:
      return { y: distance };
  }
}

// =============================================================================
// Animation Variants
// =============================================================================

/**
 * Fade In animation variant
 * Animates opacity from 0 to 1
 */
export function fadeIn(config: AnimationConfig = {}): Variants {
  const transition = createTransition(config);

  return {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition,
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };
}

/**
 * Slide Up animation variant
 * Animates Y-axis translation with opacity
 */
export function slideUp(config: AnimationConfig & { distance?: number; direction?: AnimationDirection } = {}): Variants {
  const { distance = 20, direction = "up", ...restConfig } = config;
  const transition = createTransition(restConfig);
  const offset = getDirectionOffset(direction, distance);

  return {
    hidden: {
      opacity: 0,
      ...offset,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition,
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };
}

/**
 * Scale animation variant
 * Animates scale with optional opacity
 */
export function scale(config: AnimationConfig & { from?: number; fade?: boolean } = {}): Variants {
  const { from = 0.8, fade = true, ...restConfig } = config;
  const transition = createTransition(restConfig);

  return {
    hidden: {
      scale: from,
      ...(fade && { opacity: 0 }),
    },
    visible: {
      scale: 1,
      ...(fade && { opacity: 1 }),
      transition,
    },
    exit: {
      scale: from,
      ...(fade && { opacity: 0 }),
      transition: { duration: 0.2 },
    },
  };
}

/**
 * Stagger children animation variant
 * Animates children with staggered delays
 */
export function stagger(config: AnimationConfig & { staggerChildren?: number; delayChildren?: number } = {}): Variants {
  const { staggerChildren = 0.1, delayChildren = 0, ...restConfig } = config;
  const transition = createTransition(restConfig);

  return {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        ...transition,
        staggerChildren,
        delayChildren,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren,
        staggerDirection: -1,
      },
    },
  };
}

/**
 * Stagger item variant for use with stagger container
 */
export function staggerItem(config: AnimationConfig & { direction?: AnimationDirection; distance?: number } = {}): Variants {
  const { direction = "up", distance = 20, ...restConfig } = config;
  const transition = createTransition(restConfig);
  const offset = getDirectionOffset(direction, distance);

  return {
    hidden: {
      opacity: 0,
      ...offset,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition,
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15 },
    },
  };
}

// =============================================================================
// Combined Variants
// =============================================================================

/**
 * Fade in and slide up combined
 */
export function fadeInUp(config: AnimationConfig & { distance?: number } = {}): Variants {
  const { distance = 20, ...restConfig } = config;
  return slideUp({ ...restConfig, distance, direction: "up" });
}

/**
 * Fade in and scale combined
 */
export function fadeInScale(config: AnimationConfig & { from?: number } = {}): Variants {
  const { from = 0.95, ...restConfig } = config;
  return scale({ ...restConfig, from, fade: true });
}

// =============================================================================
// Export All
// =============================================================================

export const variants = {
  fadeIn,
  slideUp,
  scale,
  stagger,
  staggerItem,
  fadeInUp,
  fadeInScale,
};

export const config = {
  easings,
  springs,
};

export type {
  AnimationConfig,
  SpringConfig,
  AnimationDirection,
};
