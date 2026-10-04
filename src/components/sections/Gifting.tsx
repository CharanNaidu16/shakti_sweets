import { Reveal } from '@/components/motion/Reveal'
import { LinkButton } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/ui/icons'
import { Photo } from '@/components/ui/Photo'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SweetArt } from '@/components/ui/SweetArt'
import { fillTemplate, whatsappUrl } from '@/lib/links'
import type { SiteData } from '@/types/content'

export function Gifting({ data }: { data: SiteData }) {
  const { gifting, settings, copy } = data
  if (gifting.occasions.length === 0) return null
  const bulkHref = (occasion: string) => whatsappUrl(settings.whatsapp, fillTemplate(copy.whatsappBulk, { occasion }))

  return (
    <section id="gifting" aria-labelledby="gifting-title" className="section-pad">
      <div className="container-site">
        {gifting.banner && (
          <Reveal className="mb-16 grid overflow-hidden rounded-[var(--radius-feature)] bg-paper md:grid-cols-2">
            <div className="p-8 md:p-12">
              <p className="eyebrow text-rose">This season</p>
              <p className="mt-4 font-display text-h2">{gifting.banner.title}</p>
              {gifting.banner.text && <p className="mt-4 text-muted">{gifting.banner.text}</p>}
            </div>
            {gifting.banner.image && (
              <div className="relative aspect-[3/2] md:aspect-auto">
                <Photo image={gifting.banner.image} sizes="(min-width: 768px) 50vw, 100vw" />
              </div>
            )}
          </Reveal>
        )}

        <div className="mb-12 md:mb-16">
          <SectionHeading id="gifting-title" eyebrow="Gifting & occasions" title="Something sweet for *every occasion*" intro={gifting.intro} />
        </div>

        <ul className="grid gap-10 md:grid-cols-3 md:gap-8">
          {gifting.occasions.map((o, i) => (
            <Reveal as="li" key={o.title} delay={i * 0.06}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-paper">
                {o.image ? <Photo image={o.image} sizes="(min-width: 768px) 33vw, 100vw" /> : <SweetArt kind={o.art} className="size-full" />}
              </div>
              <h3 className="mt-5 text-h3">{o.title}</h3>
              <p className="mt-2 text-muted">{o.text}</p>
              {bulkHref(o.title) && (
                <a href={bulkHref(o.title)} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-saffron-deep">
                  <span className="link-draw">Enquire on WhatsApp</span>
                  <span aria-hidden="true">→</span>
                </a>
              )}
            </Reveal>
          ))}
        </ul>

        {bulkHref('a celebration') && (
          <Reveal className="mt-14">
            <LinkButton href={bulkHref('a celebration')!} icon={<WhatsAppIcon />}>
              Plan a bulk order
            </LinkButton>
          </Reveal>
        )}
      </div>
    </section>
  )
}
