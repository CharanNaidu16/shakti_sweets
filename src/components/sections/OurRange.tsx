import { Reveal } from '@/components/motion/Reveal'
import { Photo } from '@/components/ui/Photo'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SweetArt } from '@/components/ui/SweetArt'
import type { SiteData } from '@/types/content'

/** Category cards (Sweets, Snacks, Cakes, …) linking into the full menu. */
export function OurRange({ data }: { data: SiteData }) {
  const categories = data.categories
    .map((c) => ({ ...c, count: data.products.filter((p) => p.category === c.slug).length }))
    .filter((c) => c.count > 0)
  if (categories.length === 0) return null

  return (
    <section id="range" aria-labelledby="range-title" className="section-pad bg-paper">
      <div className="container-site">
        <div className="mb-12 md:mb-16">
          <SectionHeading
            id="range-title"
            eyebrow="Categories"
            title="Everything under *one roof*"
            intro="The same range at both shops, in Okalipuram and on Magadi Road."
          />
        </div>

        <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-5">
          {categories.map((c, i) => (
            <Reveal as="li" key={c.slug} delay={i * 0.05} className="w-[72%] shrink-0 snap-start sm:w-[44%] md:w-auto">
              <a href={`/menu#${c.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-cream">
                  <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-out-expo)] [@media(hover:hover)]:group-hover:scale-[1.04]">
                    {c.image ? <Photo image={c.image} sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 72vw" /> : <SweetArt kind={c.art} className="size-full" />}
                  </div>
                </div>
                <h3 className="mt-4 text-h3">{c.title}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] tabular-nums text-saffron-deep">
                  {c.count} {c.count === 1 ? 'item' : 'items'}
                </p>
                {c.description && <p className="mt-1.5 text-sm text-muted">{c.description}</p>}
                <span className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-saffron-deep">
                  <span className="link-draw">See all {c.title.toLowerCase()}</span>
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
