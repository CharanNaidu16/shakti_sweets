import type { Address, SiteData } from '@/types/content'
import { SITE_URL } from './site-url'

const SCHEMA_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const postalAddress = (a: Address) => ({
  '@type': 'PostalAddress',
  streetAddress: [a.line1, a.line2].filter(Boolean).join(', '),
  addressLocality: a.city,
  addressRegion: a.state,
  postalCode: a.postalCode,
  addressCountry: a.country,
})

const geoCoordinates = (geo?: { lat: number; lng: number }) =>
  geo && { geo: { '@type': 'GeoCoordinates', latitude: geo.lat, longitude: geo.lng } }

/** LocalBusiness JSON-LD (one entry per shop) built only from confirmed settings. */
export function localBusinessJsonLd(data: SiteData) {
  const { settings: s, hours } = data
  const sameAs = [s.googleMapsUrl, s.social.instagram, s.social.facebook, s.social.youtube].filter(Boolean)
  const mainId = `${SITE_URL}/#shop`
  const openingHoursSpecification = hours.week
    .filter((d) => !d.closed && d.open && d.close)
    .map((d) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${SCHEMA_DAYS[d.day]}`,
      opens: d.open,
      closes: d.close,
    }))

  const main = {
    '@type': ['Bakery', 'LocalBusiness'],
    '@id': mainId,
    name: s.name,
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    telephone: s.phones[0]?.number,
    ...(s.email && { email: s.email }),
    address: postalAddress(s.address),
    ...geoCoordinates(s.geo),
    ...(s.priceRange && { priceRange: s.priceRange }),
    openingHoursSpecification,
    ...(sameAs.length > 0 && { sameAs }),
  }

  // Branches share the structured hours only when they use the main shop's hours.
  const branches = s.branches.map((b, i) => ({
    '@type': ['Bakery', 'LocalBusiness'],
    '@id': `${SITE_URL}/#shop-${i + 2}`,
    name: `${s.name} (${b.name})`,
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    telephone: b.phones[0]?.number,
    ...(s.email && { email: s.email }),
    address: postalAddress(b.address),
    ...geoCoordinates(b.geo),
    ...(b.sameHoursAsMain && { openingHoursSpecification }),
    ...(b.googleMapsUrl && { sameAs: [b.googleMapsUrl] }),
    parentOrganization: { '@id': mainId },
  }))

  return { '@context': 'https://schema.org', '@graph': [main, ...branches] }
}
