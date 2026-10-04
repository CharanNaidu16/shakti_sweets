import { FinalCta } from '@/components/sections/FinalCta'
import { Gallery } from '@/components/sections/Gallery'
import { Gifting } from '@/components/sections/Gifting'
import { Hero } from '@/components/sections/Hero'
import { IntroStrip } from '@/components/sections/IntroStrip'
import { OurRange } from '@/components/sections/OurRange'
import { Reviews } from '@/components/sections/Reviews'
import { SignatureSweets } from '@/components/sections/SignatureSweets'
import { Story } from '@/components/sections/Story'
import { VisitStore } from '@/components/sections/VisitStore'
import { WhyUs } from '@/components/sections/WhyUs'
import { getSiteData } from '@/lib/data'
import { viewModel } from '@/lib/view'

// Published admin changes arrive instantly via /api/revalidate; this hourly
// refresh only matters for date-based content (seasonal banner, special hours).
export const revalidate = 3600

export default async function HomePage() {
  const data = await getSiteData()
  const vm = viewModel(data)
  const { settings, copy } = data

  return (
    <>
      <Hero
        copy={copy}
        settings={settings}
        hours={data.hours}
        hoursSummary={vm.hoursSummary}
        primaryHref={vm.primary.href}
        primaryLabel={vm.primary.label}
        primaryIsWhatsApp={vm.primary.isWhatsApp}
        directionsHref={vm.directionsHref}
      />
      <IntroStrip line={copy.introLine} names={data.products.map((p) => p.name)} />
      <OurRange data={data} />
      <SignatureSweets data={data} />
      <Story story={data.story} settings={settings} hoursSummary={vm.hoursSummary} />
      {settings.features.whyUs && <WhyUs highlights={data.highlights} />}
      {vm.showGifting && <Gifting data={data} />}
      {vm.showGallery && <Gallery items={data.gallery} />}
      {settings.features.reviews && <Reviews reviews={data.reviews} googleUrl={settings.googleMapsUrl} />}
      <VisitStore data={data} hoursSummary={vm.hoursSummary} />
      <FinalCta title={copy.finalCtaTitle} whatsappHref={vm.whatsappHref} callHref={vm.callHref} phoneDisplay={vm.phoneDisplay} />
    </>
  )
}
