import { LinkButton } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { fillTemplate, whatsappUrl } from '@/lib/links'
import type { SiteData } from '@/types/content'
import { ProductShowcase } from './ProductShowcase'

/** Home-page favourites (products marked "featured"); the full list lives on /menu. */
export function SignatureSweets({ data }: { data: SiteData }) {
  const { copy, products, categories, settings } = data
  const featured = products.filter((p) => p.featured)
  const shown = featured.length > 0 ? featured : products.slice(0, 6)
  if (shown.length === 0) return null

  const askHrefs = Object.fromEntries(
    shown.map((p) => [p.slug, whatsappUrl(settings.whatsapp, fillTemplate(copy.whatsappProduct, { product: p.name }))]),
  )

  return (
    <section id="sweets" aria-labelledby="sweets-title" className="section-pad">
      <div className="container-site">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="sweets-title" eyebrow={copy.sweetsEyebrow} title={copy.sweetsTitle} intro={copy.sweetsIntro} />
          <div className="hidden lg:block">
            <LinkButton href="/menu" variant="secondary" arrow>
              See the full menu
            </LinkButton>
          </div>
        </div>
        <ProductShowcase products={shown} categories={categories} askHrefs={askHrefs} showPrices={settings.features.prices} />
        <div className="mt-12 flex justify-center lg:hidden">
          <LinkButton href="/menu" arrow className="w-full sm:w-auto">
            See the full menu ({products.length} items)
          </LinkButton>
        </div>
      </div>
    </section>
  )
}
