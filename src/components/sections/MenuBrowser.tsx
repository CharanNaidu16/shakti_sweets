'use client'

import { Search, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { SweetArt } from '@/components/ui/SweetArt'
import type { Category, Product } from '@/types/content'

interface Props {
  categories: Category[]
  products: Product[]
  askHrefs: Record<string, string | undefined>
  showPrices: boolean
}

const normalise = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9 ]/g, '')

/** Full menu: sticky category tabs, live search, every item with a WhatsApp "Ask" link. */
export function MenuBrowser({ categories, products, askHrefs, showPrices }: Props) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(categories[0]?.slug ?? '')

  const q = normalise(query.trim())
  const groups = useMemo(
    () =>
      categories
        .map((c) => ({
          category: c,
          items: products.filter(
            (p) => p.category === c.slug && (!q || normalise(`${p.name} ${p.description ?? ''} ${c.title}`).includes(q)),
          ),
        }))
        .filter((g) => g.items.length > 0),
    [categories, products, q],
  )
  const total = groups.reduce((n, g) => n + g.items.length, 0)

  // Highlight the tab of the category currently in view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-35% 0px -60% 0px' },
    )
    groups.forEach((g) => {
      const el = document.getElementById(g.category.slug)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [groups])

  return (
    <div>
      {/* Sticky tabs + search */}
      <div className="sticky top-16 z-30 -mx-5 border-y border-line bg-cream/95 px-5 py-3 backdrop-blur-md md:-mx-8 md:px-8 lg:-mx-12 lg:px-12">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Menu categories" className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
            {groups.map(({ category, items }) => (
              <a
                key={category.slug}
                href={`#${category.slug}`}
                aria-current={active === category.slug ? 'true' : undefined}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors ${active === category.slug ? 'border-ink bg-ink text-cream' : 'border-line hover:border-ink'}`}
              >
                {category.title}
                <span className={`tabular-nums ${active === category.slug ? 'text-cream/70' : 'text-muted'}`}>{items.length}</span>
              </a>
            ))}
          </nav>
          <label className="relative block lg:w-80">
            <span className="sr-only">Search the menu</span>
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search, e.g. peda, cake, rusk"
              className="min-h-11 w-full rounded-full border border-line bg-cream pl-11 pr-11 text-[1rem] outline-none placeholder:text-muted/80 focus:border-ink"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full hover:bg-paper"
                aria-label="Clear search"
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </label>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {q ? `${total} items match “${query}”` : ''}
      </p>

      {groups.length === 0 && (
        <div className="py-24 text-center">
          <p className="font-display text-h3">Nothing matches “{query}”.</p>
          <p className="mt-2 text-muted">Our counter changes often. Message us and we’ll tell you what’s available.</p>
        </div>
      )}

      {groups.map(({ category, items }) => (
        <section key={category.slug} id={category.slug} aria-labelledby={`${category.slug}-title`} className="scroll-mt-40 border-b border-line py-14 last:border-b-0 md:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Category header */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-44">
                <div className="relative hidden aspect-[4/5] max-w-xs overflow-hidden rounded-[var(--radius-card)] bg-paper lg:block">
                  {category.image ? (
                    <Image
                      src={category.image.src}
                      alt={category.image.alt}
                      fill
                      sizes="320px"
                      placeholder={category.image.lqip ? 'blur' : 'empty'}
                      blurDataURL={category.image.lqip}
                      className="object-cover"
                    />
                  ) : (
                    <SweetArt kind={category.art} className="size-full" />
                  )}
                </div>
                <h2 id={`${category.slug}-title`} className="text-h2 lg:mt-6">
                  {category.title}
                </h2>
                {category.description && <p className="mt-2 text-muted">{category.description}</p>}
                <p className="mt-2 text-sm tabular-nums text-muted">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>

            {/* Items */}
            <ul className="grid content-start items-start gap-3 self-start sm:grid-cols-2 lg:col-span-8 lg:gap-4">
              {items.map((p) => (
                <li key={p.slug} className="flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-cream p-3 pr-4">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-paper">
                    {p.image ? (
                      <Image src={p.image.src} alt="" fill sizes="80px" className="object-cover" />
                    ) : (
                      <SweetArt kind={p.art} className="size-full" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-[1.2rem] leading-snug">{p.name}</h3>
                      {showPrices && p.price && <span className="shrink-0 text-sm font-semibold tabular-nums">{p.price}</span>}
                    </div>
                    {p.description && <p className="mt-0.5 text-sm leading-snug text-muted">{p.description}</p>}
                    {askHrefs[p.slug] && (
                      <a
                        href={askHrefs[p.slug]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex min-h-9 items-center gap-1 text-sm font-semibold text-saffron-deep"
                        aria-label={`Ask about ${p.name} on WhatsApp`}
                      >
                        <span className="link-draw">Ask on WhatsApp</span>
                        <span aria-hidden="true">→</span>
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </div>
  )
}
