import type { Metadata } from 'next'
import { MobileActionBar } from '@/components/layout/MobileActionBar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { MotionProvider } from '@/components/motion/MotionProvider'
import { getSiteData } from '@/lib/data'
import { fullAddress } from '@/lib/links'
import { localBusinessJsonLd } from '@/lib/schema'
import { viewModel } from '@/lib/view'

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData()
  const places = [settings.address.locality, ...settings.branches.map((b) => b.name)].join(' & ')
  const title = `${settings.name} | Sweet Shop in ${places}, ${settings.address.city}`
  return {
    title,
    description: settings.description,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      siteName: settings.name,
      title,
      description: settings.description,
    },
    twitter: { card: 'summary_large_image', title, description: settings.description },
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const data = await getSiteData()
  const vm = viewModel(data)
  const { settings } = data

  return (
    <MotionProvider>
      <div id="top" />
      <SiteHeader
        links={vm.links}
        ctaHref={vm.primary.href}
        ctaLabel={vm.primary.label}
        ctaIsWhatsApp={vm.primary.isWhatsApp}
        callHref={vm.callHref}
        phoneDisplay={vm.phoneDisplay}
        address={fullAddress(settings)}
        hoursSummary={vm.hoursSummary}
      />
      <main id="main">{children}</main>
      <SiteFooter settings={settings} links={vm.links} hoursSummary={vm.hoursSummary} />
      <MobileActionBar whatsappHref={vm.whatsappHref} callHref={vm.callHref} directionsHref={vm.directionsHref} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd(data)).replace(/</g, '\\u003c') }}
      />
    </MotionProvider>
  )
}
