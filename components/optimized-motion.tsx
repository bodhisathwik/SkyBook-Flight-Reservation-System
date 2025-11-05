"use client"

import { motion, MotionProps } from "framer-motion"
import { ReactNode } from "react"

// Optimized motion components with reduced motion support
interface OptimizedMotionProps extends MotionProps {
  children: ReactNode
  className?: string
}

export function OptimizedMotion({ children, className, ...props }: OptimizedMotionProps) {
  return (
    <motion.div
      className={className}
      initial={false}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Reduced motion variants for accessibility
export const reducedMotionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

// Performance-optimized animation settings
export const performanceSettings = {
  // Reduce motion for better performance
  transition: {
    type: "tween",
    ease: "easeOut",
    duration: 0.3
  },
  // Use transform3d for hardware acceleration
  style: {
    willChange: "transform, opacity"
  }
}

// Lazy loading animation wrapper
export function LazyMotion({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}
