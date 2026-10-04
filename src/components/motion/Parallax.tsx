'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

/** Gentle vertical drift while scrolling. Desktop only; off for reduced motion. */
export function Parallax({ children, className, distance = 60 }: { children: React.ReactNode; className?: string; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [desktop, setDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (hover: hover)')
    const update = () => setDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-distance / 2, distance / 2])
  const active = desktop && !reduce

  return (
    <div ref={ref} className={className}>
      <motion.div className="absolute inset-[-40px_0]" style={active ? { y } : undefined}>
        {children}
      </motion.div>
    </div>
  )
}
