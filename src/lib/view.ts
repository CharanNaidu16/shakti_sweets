import type { NavLink } from '@/components/layout/SiteHeader'
import { formatRange, isEveryDaySame } from '@/lib/hours'
import { mapsDirectionsUrl, telUrl, whatsappUrl } from '@/lib/links'
import type { SiteData } from '@/types/content'

/** Values derived from site data that several components share. */
export function viewModel(data: SiteData) {
  const { settings, hours, copy, gallery } = data
  const whatsappHref = whatsappUrl(settings.whatsapp, copy.whatsappGeneral)
  const mainPhone = settings.phones[0]
  const callHref = mainPhone ? telUrl(mainPhone.number) : '#visit'
  const showGallery = settings.features.gallery && gallery.length >= 3
  const showGifting = settings.features.gifting && data.gifting.occasions.length > 0

  const links: NavLink[] = [
    { href: '/', label: 'Home' },
    { href: '/#range', label: 'Categories' },
    { href: '/menu', label: 'Full menu' },
    { href: '/#story', label: 'Our story' },
    ...(showGifting ? [{ href: '/#gifting', label: 'Gifting' }] : []),
    ...(showGallery ? [{ href: '/#gallery', label: 'Gallery' }] : []),
    { href: '/#visit', label: 'Visit us' },
  ]

  const hoursSummary = isEveryDaySame(hours) ? `Open every day, ${formatRange(hours.week[0])}` : 'See opening hours below'

  return {
    whatsappHref,
    callHref,
    phoneDisplay: mainPhone?.display ?? '',
    directionsHref: mapsDirectionsUrl(settings),
    primary: whatsappHref
      ? { href: whatsappHref, label: 'Order on WhatsApp', isWhatsApp: true }
      : { href: callHref, label: 'Call to order', isWhatsApp: false },
    links,
    hoursSummary,
    showGallery,
    showGifting,
  }
}
