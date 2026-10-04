'use client'

import { Pause, Play } from 'lucide-react'
import { useState } from 'react'

// Seconds of scroll per name in one pass of the ribbon (each pass shows the list three times).
const SECONDS_PER_ITEM = 96 / 33

/** Slow, pausable ribbon of words. Decorative — the words also appear elsewhere on the page. */
export function Marquee({ items }: { items: string[] }) {
  const [paused, setPaused] = useState(false)
  if (items.length === 0) return null
  const row = [...items, ...items, ...items]

  return (
    <div className={`relative flex items-center gap-4 ${paused ? 'marquee-paused' : ''}`}>
      <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]" aria-hidden="true">
        {/* Duration grows with the number of names so the scroll speed stays the same as the list grows. */}
        <div
          className="marquee-track flex w-max motion-reduce:!animate-none"
          style={{ animationDuration: `${Math.max(30, Math.round(items.length * SECONDS_PER_ITEM))}s` }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {row.map((item, i) => (
                <span key={`${copy}-${i}`} className="flex items-center font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] italic">
                  <span className="px-6 md:px-8">{item}</span>
                  <span className="text-saffron">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        className="grid size-11 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:border-ink hover:text-ink motion-reduce:hidden"
        aria-label={paused ? 'Play scrolling text' : 'Pause scrolling text'}
      >
        {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
      </button>
    </div>
  )
}
