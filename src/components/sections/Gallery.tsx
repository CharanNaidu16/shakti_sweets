'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/motion/Reveal'
import type { GalleryItem } from '@/types/content'

// Repeating rhythm of tile shapes for the editorial grid (12 columns on desktop).
const PATTERN = [
  'col-span-2 md:col-span-6 aspect-[4/5]',
  'col-span-1 md:col-span-3 aspect-square',
  'col-span-1 md:col-span-3 aspect-square',
  'col-span-1 md:col-span-4 aspect-[4/5]',
  'col-span-1 md:col-span-4 aspect-[4/5]',
  'col-span-2 md:col-span-4 aspect-[3/2] md:aspect-[4/5]',
]

export function Gallery({ items }: { items: GalleryItem[] }) {
  const [index, setIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const touchX = useRef<number | null>(null)

  const open = (i: number) => {
    setIndex(i)
    dialogRef.current?.showModal()
  }
  const close = () => dialogRef.current?.close()
  const step = useCallback((dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + items.length) % items.length)), [items.length])

  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, step])

  const current = index === null ? null : items[index]

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="section-pad bg-paper">
      <div className="container-site">
        <Reveal className="mb-12 md:mb-16">
          <p className="eyebrow mb-4 text-saffron-deep">Gallery</p>
          <h2 id="gallery-title" className="display-em text-h2">
            A look <em>inside</em>
          </h2>
        </Reveal>

        <ul className="grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-6">
          {items.map((item, i) => (
            <li key={item.image.src} className={`${PATTERN[i % PATTERN.length]} relative overflow-hidden rounded-[var(--radius-card)]`}>
              <button
                type="button"
                onClick={() => open(i)}
                className="group absolute inset-0 size-full"
                aria-label={`Open photo ${i + 1} of ${items.length}: ${item.caption || item.image.alt}`}
              >
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(min-width: 768px) 40vw, 50vw"
                  placeholder={item.image.lqip ? 'blur' : 'empty'}
                  blurDataURL={item.image.lqip}
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setIndex(null)}
        aria-label="Photo viewer"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-night/95 p-0 text-cream backdrop:bg-night/60"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
          touchX.current = null
        }}
      >
        {current && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-4">
              <p className="text-sm tabular-nums" aria-live="polite">
                {(index ?? 0) + 1} / {items.length}
              </p>
              <button type="button" onClick={close} className="grid size-12 place-items-center rounded-full hover:bg-cream/10" aria-label="Close">
                <X size={24} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
            <div className="relative flex-1">
              <Image key={current.image.src} src={current.image.src} alt={current.image.alt} fill sizes="100vw" className="animate-[menu-in_0.4s_ease] object-contain" />
            </div>
            <div className="flex items-center justify-between gap-4 p-4">
              <button type="button" onClick={() => step(-1)} className="grid size-12 place-items-center rounded-full border border-cream/30 hover:bg-cream/10" aria-label="Previous photo">
                <ChevronLeft size={22} aria-hidden="true" />
              </button>
              <p className="text-center text-sm text-night-muted">{current.caption ?? current.image.alt}</p>
              <button type="button" onClick={() => step(1)} className="grid size-12 place-items-center rounded-full border border-cream/30 hover:bg-cream/10" aria-label="Next photo">
                <ChevronRight size={22} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  )
}
