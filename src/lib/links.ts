import type { Address, SiteSettings } from '@/types/content'

export function whatsappUrl(number: string | undefined, message?: string) {
  if (!number) return undefined
  const digits = number.replace(/\D/g, '')
  return message ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : `https://wa.me/${digits}`
}

export function telUrl(number: string) {
  return `tel:${number.replace(/[^\d+]/g, '')}`
}

export function formatAddress(a: Address, separator = ', ') {
  return [a.line1, a.line2, a.locality, a.city, `${a.state} ${a.postalCode}`].filter(Boolean).join(separator)
}

/** Main shop address. */
export function fullAddress(s: SiteSettings, separator = ', ') {
  return formatAddress(s.address, separator)
}

interface Place {
  address: Address
  geo?: { lat: number; lng: number }
}

const placeQuery = (name: string, p: Place) => (p.geo ? `${p.geo.lat},${p.geo.lng}` : `${name}, ${formatAddress(p.address)}`)

export function directionsUrl(name: string, place: Place) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(placeQuery(name, place))}`
}

export function embedUrl(name: string, place: Place) {
  return `https://www.google.com/maps?q=${encodeURIComponent(placeQuery(name, place))}&output=embed`
}

/** Directions to the main shop. */
export function mapsDirectionsUrl(s: SiteSettings) {
  return directionsUrl(s.name, s)
}

export function mapsEmbedUrl(s: SiteSettings) {
  return embedUrl(s.name, s)
}

export function fillTemplate(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match)
}
