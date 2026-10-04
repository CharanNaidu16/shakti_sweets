'use client'

import { motion } from 'motion/react'
import { DURATION, EASE_OUT_EXPO, VIEWPORT_ONCE } from '@/lib/motion'

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
  as?: 'div' | 'li' | 'section' | 'article'
}

/** Fades and lifts content in once as it enters the viewport. */
export function Reveal({ children, className, delay = 0, y = 24, as = 'div' }: RevealProps) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: DURATION.reveal, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </Component>
  )
}
