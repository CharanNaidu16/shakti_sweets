import type { Metadata } from 'next'
import { Reveal } from '@/components/motion/Reveal'
import { LinkButton } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/ui/icons'
import { MenuBrowser } from '@/components/sections/MenuBrowser'
import { getSiteData } from '@/lib/data'
import { fillTemplate, whatsappUrl } from '@/lib/links'
import { viewModel } from '@/lib/view'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { settings, categories } = await getSiteData()
  const title = `Menu | ${settings.name}`
  const description = `${categories.map((c) => c.title).join(', ')} at ${settings.name}, ${settings.address.city}. Available at both our shops.`
  return { title, description, alternates: { canonical: '/menu' }, openGraph: { title, description } }
}

export default async function MenuPage() {
  const data = await getSiteData()
  const { settings, copy, products, categories } = data
  const vm = viewModel(data)
  const askHrefs = Object.fromEntries(
    products.map((p) => [p.slug, whatsappUrl(settings.whatsapp, fillTemplate(copy.whatsappProduct, { product: p.name }))]),
  )
  const shops = [settings.mainShopName ?? settings.address.locality, ...settings.branches.map((b) => b.name)]

  return (
    <div className="container-site pb-8 pt-28 lg:pt-36">
      <Reveal className="mb-10 grid gap-6 lg:mb-14 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="eyebrow mb-4 text-saffron-deep">Full menu · {products.length} items</p>
          <h1 className="display-em text-h1">
            Everything on <em>our counter</em>
          </h1>
          <p className="mt-5 max-w-2xl text-lead text-muted">
            Available at both our shops, {shops.join(' and ')}. The counter changes with the day and the season, so message us to
            check what’s fresh before you come.
          </p>
        </div>
        {vm.whatsappHref && (
          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <LinkButton href={vm.whatsappHref} icon={<WhatsAppIcon />}>
              Ask on WhatsApp
            </LinkButton>
          </div>
        )}
      </Reveal>

      <MenuBrowser categories={categories} products={products} askHrefs={askHrefs} showPrices={settings.features.prices} />

      <p className="mt-10 text-sm text-muted">
        Don’t see something? Just ask. We stock more than we can list here.
      </p>
    </div>
  )
}
