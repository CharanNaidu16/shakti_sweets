// Normalised shapes used by the website. Data comes from Sanity when it is
// configured, otherwise from src/content/fallback.ts. Components only ever
// see these types, never raw CMS documents.

export const sweetArts = ['katli', 'laddu', 'jamun', 'rasmalai', 'sandwich', 'peda', 'namkeen', 'cake', 'biscuit', 'icecream', 'generic'] as const
export type SweetArt = (typeof sweetArts)[number]

export interface SiteImage {
  src: string
  alt: string
  width: number
  height: number
  /** Blur placeholder (data URL) when available */
  lqip?: string
  /** True for demo/stock imagery (internal tracking only; not shown on the site) */
  representative: boolean
}

export interface Features {
  gifting: boolean
  whyUs: boolean
  reviews: boolean
  gallery: boolean
  prices: boolean
  kannadaAccents: boolean
}

export interface Address {
  line1: string
  line2?: string
  locality: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface Phone {
  number: string
  display: string
  label?: string
}

/** An additional shop. The main shop's details live directly on SiteSettings. */
export interface Branch {
  name: string
  address: Address
  landmark?: string
  geo?: { lat: number; lng: number }
  phones: Phone[]
  googleMapsUrl?: string
  /** Uses the main shop's opening hours (live open/closed status included) */
  sameHoursAsMain?: boolean
  /** Free text when hours differ, e.g. "9 am – 9 pm daily". Empty → "Call for timings". */
  hoursText?: string
}

export interface SiteSettings {
  name: string
  localName?: string
  tagline: string
  description: string
  /** Label for the main shop when there are several, e.g. "Okalipuram" */
  mainShopName?: string
  address: Address
  landmark?: string
  geo?: { lat: number; lng: number }
  phones: Phone[]
  branches: Branch[]
  /** Digits only, with country code, e.g. 919341222517 */
  whatsapp?: string
  email?: string
  googleMapsUrl?: string
  social: { instagram?: string; facebook?: string; youtube?: string }
  fssai?: string
  priceRange?: string
  features: Features
}

export interface DayHours {
  /** 0 = Sunday … 6 = Saturday */
  day: number
  closed: boolean
  /** "08:00" 24h */
  open?: string
  close?: string
}

export interface SpecialHours {
  date: string // YYYY-MM-DD
  label: string
  closed: boolean
  open?: string
  close?: string
}

export interface Hours {
  week: DayHours[]
  special: SpecialHours[]
  note?: string
}

export interface HomeCopy {
  heroEyebrow: string
  /** *word* renders in italics */
  heroHeadline: string
  heroSubline: string
  heroImage?: SiteImage
  introLine: string
  sweetsEyebrow: string
  sweetsTitle: string
  sweetsIntro: string
  visitTitle: string
  finalCtaTitle: string
  whatsappGeneral: string
  whatsappProduct: string
  whatsappBulk: string
}

export interface Category {
  slug: string
  title: string
  /** One line shown on the category card and menu page */
  description?: string
  image?: SiteImage
  /** Illustration used when there is no photo */
  art: SweetArt
}

export interface Product {
  slug: string
  name: string
  localName?: string
  category: string
  /** Optional one-liner (menu items can be just a name) */
  description?: string
  image?: SiteImage
  altImage?: SiteImage
  art: SweetArt
  tags: string[]
  price?: string
  featured: boolean
  verified: boolean
}

export interface StoryContent {
  eyebrow: string
  title: string
  paragraphs: string[]
  quote?: { text: string; attribution: string }
  images: SiteImage[]
}

export const highlightIcons = ['clock', 'store', 'map', 'message', 'sparkles', 'heart', 'leaf', 'gift', 'chef'] as const
export type HighlightIcon = (typeof highlightIcons)[number]

export interface Highlight {
  title: string
  text: string
  icon: HighlightIcon
}

export interface GiftingOccasion {
  title: string
  text: string
  image?: SiteImage
  art: SweetArt
}

export interface SeasonalBanner {
  title: string
  text: string
  start: string
  end: string
  image?: SiteImage
}

export interface GalleryItem {
  image: SiteImage
  caption?: string
}

export interface Review {
  author: string
  text: string
  date?: string
  sourceUrl?: string
  rating?: number
}

export interface SiteData {
  settings: SiteSettings
  hours: Hours
  copy: HomeCopy
  categories: Category[]
  products: Product[]
  story: StoryContent
  highlights: Highlight[]
  gifting: { intro: string; occasions: GiftingOccasion[]; banner?: SeasonalBanner }
  gallery: GalleryItem[]
  reviews: Review[]
  /** Where the data came from — useful for the dev banner */
  source: 'sanity' | 'fallback'
}
