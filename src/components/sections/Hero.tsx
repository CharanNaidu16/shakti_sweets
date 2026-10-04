import { Fragment } from 'react'
import { MapPin } from 'lucide-react'
import { Parallax } from '@/components/motion/Parallax'
import { LinkButton } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/ui/icons'
import { OpenStatus } from '@/components/ui/OpenStatus'
import { Photo } from '@/components/ui/Photo'
import { SweetArt } from '@/components/ui/SweetArt'
import type { Hours, HomeCopy, SiteSettings } from '@/types/content'

interface Props {
  copy: HomeCopy
  settings: SiteSettings
  hours: Hours
  hoursSummary: string
  primaryHref: string
  primaryLabel: string
  primaryIsWhatsApp: boolean
  directionsHref: string
}

/** "A little sweetness. A lot of *joy*." → words, each flagged if inside *emphasis*. */
function parseWords(text: string) {
  const words: { word: string; em: boolean }[] = []
  let em = false
  for (const raw of text.split(' ')) {
    if (raw.startsWith('*')) em = true
    words.push({ word: raw.replace(/\*/g, ''), em })
    if (raw.endsWith('*')) em = false
  }
  return words
}

/** Headline split into masked words for the staggered entrance. */
function HeadlineWords({ text }: { text: string }) {
  return (
    <>
      {parseWords(text).map(({ word, em }, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          {/* Extra bottom padding (cancelled by negative margin) keeps descenders like "g" unclipped */}
          <span className="-mb-[0.18em] inline-block overflow-hidden pb-[0.18em] align-bottom">
            <span className="hero-word" style={{ animationDelay: `${250 + i * 70}ms` }}>
              {em ? <em>{word}</em> : word}
            </span>
          </span>
        </Fragment>
      ))}
    </>
  )
}

/**
 * Split hero. Nothing is ever layered over the photo (the photo carries its own
 * signage).
 *  - Phones: photo card first, then the text block below it.
 *  - Laptops: text on the left, the full uncropped photo on the right, sized to
 *    the screen height so the whole first screen fits.
 */
export function Hero({ copy, settings, hours, hoursSummary, primaryHref, primaryLabel, primaryIsWhatsApp, directionsHref }: Props) {
  const image = copy.heroImage
  const ratio = image ? image.width / image.height : 6 / 5
  const shops = [settings.mainShopName ?? settings.address.locality, ...settings.branches.map((b) => b.name)]

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative overflow-hidden pb-14 pt-20 md:pt-24 lg:flex lg:min-h-[min(100svh,980px)] lg:items-center lg:pb-16 lg:pt-24"
    >
      {/* Soft saffron glow behind the photo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/4 hidden size-[640px] rounded-full bg-saffron/15 blur-3xl lg:block"
      />

      <div className="container-site relative w-full">
        <div className="grid gap-9 lg:grid-cols-12 lg:items-center lg:gap-12 xl:gap-16">
          {/* Photo */}
          <figure className="lg:order-2 lg:col-span-7">
            <div className="hero-photo relative mx-auto lg:mr-0" style={{ '--hero-ratio': ratio.toFixed(3) } as React.CSSProperties}>
              {/* Open frame echoing the logo's red bracket (laptops only, behind the photo) */}
              <span
                aria-hidden="true"
                className="hero-rise absolute -left-5 -top-5 hidden h-[calc(100%-3rem)] w-1/2 border-y border-l border-logo-red/45 lg:block"
                style={{ animationDelay: '700ms' }}
              />
              <div
                className="hero-clip relative overflow-hidden rounded-[24px] bg-paper shadow-[0_30px_60px_-30px_rgb(43_33_28/0.45)] lg:rounded-[var(--radius-feature)]"
                style={{ aspectRatio: ratio }}
              >
                <Parallax className="absolute inset-0" distance={40}>
                  {image ? (
                    <Photo image={image} sizes="(min-width: 1024px) 58vw, calc(100vw - 40px)" priority />
                  ) : (
                    <SweetArt kind="sandwich" className="size-full" />
                  )}
                </Parallax>
              </div>
            </div>
          </figure>

          {/* Text */}
          <div className="lg:order-1 lg:col-span-5">
            <p className="eyebrow hero-rise flex items-center gap-3 text-saffron-deep" style={{ animationDelay: '120ms' }}>
              <span aria-hidden="true" className="h-px w-8 bg-saffron-deep/60" />
              {copy.heroEyebrow}
            </p>
            <h1 id="hero-title" className="display-em mt-5 text-display lg:text-[length:min(5.5rem,5.6vw,9.5svh)]">
              <HeadlineWords text={copy.heroHeadline} />
            </h1>
            <p className="hero-rise mt-6 max-w-[30rem] text-lead text-muted" style={{ animationDelay: '650ms' }}>
              {copy.heroSubline}
            </p>
            <div className="hero-rise mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ animationDelay: '800ms' }}>
              <LinkButton href={primaryHref} icon={primaryIsWhatsApp ? <WhatsAppIcon /> : undefined}>
                {primaryLabel}
              </LinkButton>
              <LinkButton href={directionsHref} variant="secondary" arrow>
                Get directions
              </LinkButton>
            </div>
            <div
              className="hero-rise mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5"
              style={{ animationDelay: '950ms' }}
            >
              <OpenStatus hours={hours} fallback={hoursSummary} />
              <p className="flex items-center gap-2 text-sm text-muted">
                <MapPin size={16} className="shrink-0" aria-hidden="true" />
                {shops.join(' · ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
