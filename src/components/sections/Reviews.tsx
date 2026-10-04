import { Star } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import type { Review } from '@/types/content'

/** Only owner-approved, real reviews (filtered in the data layer). */
export function Reviews({ reviews, googleUrl }: { reviews: Review[]; googleUrl?: string }) {
  if (reviews.length === 0) return null
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="section-pad">
      <div className="container-site">
        <Reveal className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-4 text-saffron-deep">Kind words</p>
            <h2 id="reviews-title" className="display-em text-h2">
              From our <em>customers</em>
            </h2>
          </div>
          {googleUrl && (
            <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="link-draw w-fit font-semibold text-saffron-deep">
              Read all reviews on Google →
            </a>
          )}
        </Reveal>
        <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
          {reviews.map((r, i) => (
            <Reveal as="li" key={`${r.author}-${i}`} delay={i * 0.06} className="w-[85%] shrink-0 snap-start md:w-auto">
              <figure className="flex h-full flex-col rounded-[var(--radius-card)] bg-paper p-7">
                {r.rating && (
                  <p className="flex gap-0.5 text-saffron" aria-label={`${r.rating} out of 5 stars`}>
                    {Array.from({ length: r.rating }, (_, s) => (
                      <Star key={s} size={16} fill="currentColor" aria-hidden="true" />
                    ))}
                  </p>
                )}
                <blockquote className="mt-4 flex-1 font-display text-[1.25rem] leading-snug">“{r.text}”</blockquote>
                <figcaption className="mt-6 text-sm text-muted">
                  <span className="font-semibold text-ink">{r.author}</span>
                  {r.date && <> · {new Date(r.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</>}
                  {r.sourceUrl && (
                    <>
                      {' · '}
                      <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                        Google
                      </a>
                    </>
                  )}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
