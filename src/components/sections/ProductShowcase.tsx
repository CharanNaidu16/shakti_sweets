'use client'

import { motion } from 'motion/react'
import { useMemo, useRef, useState } from 'react'
import { ProductCard } from '@/components/ui/ProductCard'
import { DURATION, EASE_OUT_EXPO, VIEWPORT_ONCE } from '@/lib/motion'
import type { Category, Product } from '@/types/content'

interface Props {
  products: Product[]
  categories: Category[]
  askHrefs: Record<string, string | undefined>
  showPrices: boolean
}

const CHIP_THRESHOLD = 12

export function ProductShowcase({ products, categories, askHrefs, showPrices }: Props) {
  const [category, setCategory] = useState('all')
  const [slide, setSlide] = useState(0)
  const trackRef = useRef<HTMLUListElement>(null)

  const usedCategories = categories.filter((c) => products.some((p) => p.category === c.slug))
  const showChips = products.length >= CHIP_THRESHOLD && usedCategories.length > 1
  const visible = useMemo(
    () => (category === 'all' ? products : products.filter((p) => p.category === category)),
    [category, products],
  )

  // Desktop: first featured product is large, a 2×2 block beside it, the rest in rows of four.
  const ordered = [...visible].sort((a, b) => Number(b.featured) - Number(a.featured))
  const [lead, ...rest] = ordered

  function onTrackScroll() {
    const track = trackRef.current
    if (!track) return
    const card = track.firstElementChild as HTMLElement | null
    if (!card) return
    setSlide(Math.round(track.scrollLeft / (card.offsetWidth + 16)))
  }

  if (!lead) return null

  return (
    <div>
      {showChips && (
        <div role="group" aria-label="Filter by category" className="no-scrollbar -mx-5 mb-10 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
          {[{ slug: 'all', title: 'All' }, ...usedCategories].map((c) => (
            <button
              key={c.slug}
              type="button"
              aria-pressed={category === c.slug}
              onClick={() => setCategory(c.slug)}
              className={`min-h-11 shrink-0 rounded-full border px-5 text-sm font-semibold transition-colors ${category === c.slug ? 'border-ink bg-ink text-cream' : 'border-line hover:border-ink'}`}
            >
              {c.title}
            </button>
          ))}
        </div>
      )}

      {/* Mobile: snap carousel */}
      <div className="md:hidden">
        <ul
          ref={trackRef}
          onScroll={onTrackScroll}
          aria-label="Sweets"
          className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2"
        >
          {ordered.map((p, i) => (
            <li key={p.slug} className="w-[82%] shrink-0 snap-start" aria-label={`${i + 1} of ${ordered.length}`}>
              <ProductCard product={p} askHref={askHrefs[p.slug]} showPrice={showPrices} sizes="82vw" />
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm tabular-nums text-muted" aria-live="polite">
            {Math.min(slide + 1, ordered.length)} / {ordered.length}
          </p>
          <div className="flex gap-1.5" aria-hidden="true">
            {ordered.map((p, i) => (
              <span key={p.slug} className={`h-1.5 rounded-full transition-all duration-300 ${i === slide ? 'w-6 bg-ink' : 'w-1.5 bg-ink/20'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Tablet & desktop */}
      <div className="hidden md:block">
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-12">
          <motion.div
            className="lg:col-span-6 lg:row-span-2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: DURATION.reveal, ease: EASE_OUT_EXPO }}
          >
            <ProductCard product={lead} askHref={askHrefs[lead.slug]} showPrice={showPrices} large sizes="(min-width: 1024px) 45vw, 50vw" />
          </motion.div>
          {rest.map((p, i) => (
            <motion.div
              key={p.slug}
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: DURATION.reveal, ease: EASE_OUT_EXPO, delay: (i % 3) * 0.06 }}
            >
              <ProductCard product={p} askHref={askHrefs[p.slug]} showPrice={showPrices} sizes="(min-width: 1024px) 25vw, 50vw" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
