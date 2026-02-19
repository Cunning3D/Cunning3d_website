/**
 * Custom Hooks for Scroll Animations
 *
 * Provides hooks for scroll-triggered animations and reduced motion preferences.
 */

"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useInView, type UseInViewOptions } from "framer-motion"

// =============================================================================
// Types
// =============================================================================

export interface ScrollAnimationOptions
  extends Omit<UseInViewOptions, "once" | "amount" | "margin"> {
  /** Trigger animation only once */
  once?: boolean
  /** Amount of element visible (0-1) */
  amount?: "some" | "all" | number
  /** Margin around viewport */
  margin?: UseInViewOptions["margin"]
}

export interface ScrollProgress {
  /** Progress from 0 to 1 */
  progress: number
  /** Progress from 0 to 100 */
  percentage: number
  /** Whether element is in view */
  isInView: boolean
}

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to detect if user prefers reduced motion
 * Respects accessibility settings
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return prefersReducedMotion
}

/**
 * Hook for scroll-triggered animations
 * Combines framer-motion's useInView with additional options
 */
export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const { once = true, amount = "some", margin = "-100px", ...rest } = options
  const ref = useRef<HTMLDivElement>(null)

  const isInView = useInView(ref, {
    once,
    amount,
    margin,
    ...rest
  })

  const hasAnimated = useRef(false)

  if (isInView && once) {
    hasAnimated.current = true
  }

  const shouldAnimate = once
    ? isInView || hasAnimated.current
    : isInView

  return {
    ref,
    isInView,
    shouldAnimate,
    hasAnimated: hasAnimated.current
  }
}

/**
 * Hook to track scroll progress of an element
 * Useful for parallax or scroll-linked animations
 */
export function useScrollProgress(): {
  progress: number
  percentage: number
  ref: React.RefObject<HTMLDivElement | null>
} {
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleScroll = () => {
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementHeight = rect.height

      // Calculate progress based on element position in viewport
      const start = windowHeight
      const end = -elementHeight
      const current = rect.top

      const rawProgress = (start - current) / (start - end)
      const clampedProgress = Math.max(0, Math.min(1, rawProgress))

      setProgress(clampedProgress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return {
    progress,
    percentage: Math.round(progress * 100),
    ref
  }
}

/**
 * Hook for staggered children animations
 * Provides consistent stagger delays for lists
 */
export function useStaggerAnimation(itemCount: number, baseDelay: number = 0.1) {
  const getItemDelay = useCallback(
    (index: number) => index * baseDelay,
    [baseDelay]
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: baseDelay,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  return {
    getItemDelay,
    containerVariants,
    itemVariants,
    staggerDelay: baseDelay,
    totalDuration: itemCount * baseDelay + 0.5
  }
}

// =============================================================================
// Utility Hooks
// =============================================================================

/**
 * Hook to detect if element is in viewport center
 * Useful for centering animations or snap effects
 */
export function useCenterInView(threshold: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null)
  const [isCentered, setIsCentered] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCentered(entry.isIntersecting && entry.intersectionRatio >= threshold)
      },
      {
        threshold: [threshold, threshold + 0.1, threshold - 0.1].filter(t => t >= 0 && t <= 1)
      }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isCentered }
}

/**
 * Hook for parallax scroll effect
 * Returns transform values based on scroll position
 */
export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const scrolled = window.innerHeight - rect.top
      const parallaxOffset = scrolled * speed

      setOffset(parallaxOffset)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return { ref, offset, style: { transform: `translateY(${offset}px)` } }
}

// =============================================================================
// Re-exports from framer-motion for convenience
// =============================================================================

export { useInView, useScroll, useTransform } from "framer-motion"
