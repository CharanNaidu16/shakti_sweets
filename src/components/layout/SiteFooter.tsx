import { Logo } from '@/components/ui/Logo'
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/ui/icons'
import { formatAddress, fullAddress, telUrl } from '@/lib/links'
import type { SiteSettings } from '@/types/content'
import type { NavLink } from './SiteHeader'

interface Props {
  settings: SiteSettings
  links: NavLink[]
  hoursSummary: string
}

export function SiteFooter({ settings, links, hoursSummary }: Props) {
  const social = [
    { href: settings.social.instagram, label: 'Instagram', Icon: InstagramIcon },
    { href: settings.social.facebook, label: 'Facebook', Icon: FacebookIcon },
    { href: settings.social.youtube, label: 'YouTube', Icon: YoutubeIcon },
  ].filter((s): s is typeof s & { href: string } => Boolean(s.href))

  return (
    <footer className="grain bg-night text-night-muted" data-nav-theme="dark">
      <div className="container-site grid gap-12 border-t border-line-night py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Logo variant="cream" className="h-14 w-auto text-cream" />
          {settings.features.kannadaAccents && settings.localName && (
            <p lang="kn" className="mt-4 font-[family-name:var(--font-kannada)] text-lg text-cream/80">
              {settings.localName}
            </p>
          )}
          <p className="mt-4 max-w-sm">
            {settings.tagline}. {[settings.address.locality, ...settings.branches.map((b) => b.name)].join(' · ')}, {settings.address.city}.
          </p>
        </div>

        <div className="md:col-span-4">
          <h2 className="eyebrow mb-4 font-sans text-saffron">Visit</h2>
          {settings.branches.length > 0 && settings.mainShopName && <p className="font-semibold text-cream">{settings.mainShopName}</p>}
          <address className="not-italic leading-relaxed">{fullAddress(settings)}</address>
          <p className="mt-3 text-cream">{hoursSummary}</p>
          <ul className="mt-3 space-y-1">
            {settings.phones.map((p) => (
              <li key={p.number}>
                <a href={telUrl(p.number)} className="link-draw text-cream">
                  {p.display}
                </a>
                {p.label && <span className="ml-2 text-sm">· {p.label}</span>}
              </li>
            ))}
          </ul>
          {settings.branches.map((b) => (
            <div key={b.name} className="mt-6">
              <p className="font-semibold text-cream">{b.name}</p>
              <address className="not-italic leading-relaxed">{formatAddress(b.address)}</address>
              <ul className="mt-2 space-y-1">
                {b.phones.map((p) => (
                  <li key={p.number}>
                    <a href={telUrl(p.number)} className="link-draw text-cream">
                      {p.display}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <ul className="mt-6 space-y-1">
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="link-draw text-cream">
                  {settings.email}
                </a>
              </li>
            )}
          </ul>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <h2 className="eyebrow mb-4 font-sans text-saffron">Explore</h2>
          <ul className="space-y-2">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link-draw text-cream">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          {social.length > 0 && (
            <ul className="mt-6 flex gap-2">
              {social.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid size-11 place-items-center rounded-full border border-line-night text-cream transition-colors hover:bg-cream hover:text-night"
                  >
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </div>

      <div className="container-site flex flex-col gap-2 border-t border-line-night py-6 pb-28 text-sm md:flex-row md:justify-between md:pb-6">
        <p>
          © {new Date().getFullYear()} {settings.name}
          {settings.fssai && <> · FSSAI Lic. No. {settings.fssai}</>}
        </p>
      </div>
    </footer>
  )
}
