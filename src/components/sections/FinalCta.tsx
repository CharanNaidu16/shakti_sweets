import { Phone } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { LinkButton } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/ui/icons'
import { Rich } from '@/components/ui/Rich'

interface Props {
  title: string
  whatsappHref?: string
  callHref: string
  phoneDisplay: string
}

export function FinalCta({ title, whatsappHref, callHref, phoneDisplay }: Props) {
  return (
    <section aria-labelledby="final-cta" data-nav-theme="dark" className="grain bg-night pb-20 pt-24 text-cream md:pb-28 md:pt-32">
      <div className="container-site">
        <Reveal className="max-w-4xl">
          <h2 id="final-cta" className="display-em text-h1">
            <Rich text={title} />
          </h2>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            {whatsappHref && (
              <LinkButton href={whatsappHref} icon={<WhatsAppIcon />}>
                Order on WhatsApp
              </LinkButton>
            )}
            <LinkButton href={callHref} variant="secondary-light" icon={<Phone size={18} aria-hidden="true" />}>
              Call {phoneDisplay}
            </LinkButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
