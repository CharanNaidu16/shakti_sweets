import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { LinkButton } from '@/components/ui/Button'
import { CopyButton } from '@/components/ui/CopyButton'
import { HoursTable } from '@/components/ui/HoursTable'
import { WhatsAppIcon } from '@/components/ui/icons'
import { MapEmbed } from '@/components/ui/MapEmbed'
import { OpenStatus } from '@/components/ui/OpenStatus'
import { Rich } from '@/components/ui/Rich'
import { directionsUrl, formatAddress, fullAddress, mapsDirectionsUrl, mapsEmbedUrl, telUrl, whatsappUrl } from '@/lib/links'
import type { Branch, Hours, Phone as PhoneNumber, SiteData } from '@/types/content'

function PhoneList({ phones }: { phones: PhoneNumber[] }) {
  return (
    <ul className="space-y-1">
      {phones.map((p) => (
        <li key={p.number}>
          <a href={telUrl(p.number)} className="inline-flex min-h-11 items-center gap-3 text-lead">
            <Phone size={18} strokeWidth={1.5} className="text-saffron-deep" aria-hidden="true" />
            <span className="link-draw tabular-nums">{p.display}</span>
            {p.label && <span className="text-sm text-muted">{p.label}</span>}
          </a>
        </li>
      ))}
    </ul>
  )
}

function BranchCard({ branch, shopName, hours, hoursSummary }: { branch: Branch; shopName: string; hours: Hours; hoursSummary: string }) {
  const address = formatAddress(branch.address)
  return (
    <div className="flex h-full flex-col rounded-[var(--radius-feature)] bg-paper p-7 md:p-10">
      <p className="eyebrow text-saffron-deep">Our other shop</p>
      <h3 className="mt-3 text-h2">{branch.name}</h3>
      <address className="mt-6 flex gap-3 not-italic text-lead">
        <MapPin size={22} strokeWidth={1.5} className="mt-1 shrink-0 text-saffron-deep" aria-hidden="true" />
        <span>
          {address}
          {branch.landmark && !address.includes(branch.landmark) && <span className="block text-body text-muted">{branch.landmark}</span>}
        </span>
      </address>
      <div className="mt-2 pl-9">
        <CopyButton text={`${shopName} (${branch.name}), ${address}`} />
      </div>
      {branch.sameHoursAsMain ? (
        <div className="mt-6 space-y-2">
          <p className="flex items-center gap-3">
            <Clock size={18} strokeWidth={1.5} className="text-saffron-deep" aria-hidden="true" />
            {hoursSummary}
          </p>
          <OpenStatus hours={hours} fallback={hoursSummary} />
        </div>
      ) : (
        <p className="mt-6 flex items-center gap-3">
          <Clock size={18} strokeWidth={1.5} className="text-saffron-deep" aria-hidden="true" />
          {branch.hoursText || 'Call for timings'}
        </p>
      )}
      <div className="mt-4">
        <PhoneList phones={branch.phones} />
      </div>
      <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
        <LinkButton href={directionsUrl(`${shopName} ${branch.name}`, branch)} arrow>
          Directions to {branch.name}
        </LinkButton>
        {branch.googleMapsUrl && (
          <LinkButton href={branch.googleMapsUrl} variant="secondary">
            View on Google
          </LinkButton>
        )}
      </div>
    </div>
  )
}

export function VisitStore({ data, hoursSummary }: { data: SiteData; hoursSummary: string }) {
  const { settings, hours, copy } = data
  const whatsapp = whatsappUrl(settings.whatsapp, copy.whatsappGeneral)
  const address = fullAddress(settings)
  const multiple = settings.branches.length > 0

  return (
    <section id="visit" aria-labelledby="visit-title" className="section-pad">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow mb-4 text-saffron-deep">{multiple ? 'Visit our shops' : 'Visit our shop'}</p>
            <h2 id="visit-title" className="display-em text-h1">
              <Rich text={copy.visitTitle} />
            </h2>
            {multiple && settings.mainShopName && <p className="mt-6 font-display text-h3">{settings.mainShopName}</p>}
            <div className={multiple ? 'mt-3' : 'mt-6'}>
              <OpenStatus hours={hours} fallback={hoursSummary} />
            </div>
          </Reveal>

          <Reveal delay={0.08} className="mt-10 space-y-8">
            <div>
              <h3 className="eyebrow mb-3 text-muted">Address</h3>
              <address className="flex gap-3 not-italic text-lead">
                <MapPin size={22} strokeWidth={1.5} className="mt-1 shrink-0 text-saffron-deep" aria-hidden="true" />
                <span>
                  {settings.name}
                  <br />
                  {address}
                  {settings.landmark && <span className="block text-body text-muted">{settings.landmark}</span>}
                </span>
              </address>
              <div className="mt-2 pl-9">
                <CopyButton text={`${settings.name}, ${address}`} />
              </div>
            </div>

            <div>
              <h3 className="eyebrow mb-3 text-muted">Opening hours</h3>
              <HoursTable hours={hours} />
            </div>

            <div>
              <h3 className="eyebrow mb-3 text-muted">Call us</h3>
              <PhoneList phones={settings.phones} />
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="mt-1 inline-flex min-h-11 items-center gap-3 text-lead">
                  <Mail size={18} strokeWidth={1.5} className="text-saffron-deep" aria-hidden="true" />
                  <span className="link-draw break-all">{settings.email}</span>
                </a>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <LinkButton href={mapsDirectionsUrl(settings)} arrow>
                Get directions
              </LinkButton>
              {whatsapp && (
                <LinkButton href={whatsapp} variant="secondary" icon={<WhatsAppIcon />}>
                  WhatsApp us
                </LinkButton>
              )}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
          <MapEmbed embedUrl={mapsEmbedUrl(settings)} label={`${settings.name}, ${settings.address.locality}`} />
          {settings.googleMapsUrl && (
            <a href={settings.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="link-draw mt-4 inline-block text-sm font-semibold text-saffron-deep">
              View {settings.name} on Google →
            </a>
          )}
        </Reveal>

        {settings.branches.map((branch, i) => (
          <Reveal key={branch.name} delay={0.05 * i} className="lg:col-span-12">
            <BranchCard branch={branch} shopName={settings.name} hours={hours} hoursSummary={hoursSummary} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
