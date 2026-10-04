import 'server-only'
import { cache } from 'react'
import { isSanityConfigured } from '@sanity-config/env'
import { client } from '@sanity-config/lib/client'
import { toSiteImage, type CmsImage } from '@sanity-config/lib/image'
import { SITE_QUERY } from '@sanity-config/lib/queries'
import { fallbackData } from '@/content/fallback'
import { shopNow } from '@/lib/hours'
import type { Branch, Category, HomeCopy, Hours, Product, SiteData, SiteImage, SiteSettings, StoryContent } from '@/types/content'

/** Cache tag revalidated by /api/revalidate when content is published. */
export const SANITY_TAG = 'sanity'

const PORTRAIT = 4 / 5

// Loose shape of the GROQ result; every field may be missing in a fresh dataset.
type Doc = Record<string, unknown> | null
interface CmsResult {
  settings: Doc
  hours: Doc
  copy: Doc
  categories: { title: string; slug: string; description?: string; art?: string; image?: CmsImage }[] | null
  products: (Record<string, unknown> & { image?: CmsImage; altImage?: CmsImage })[] | null
  story: (Record<string, unknown> & { images?: CmsImage[] }) | null
  highlights: SiteData['highlights'] | null
  giftingPage: { intro?: string } | null
  occasions: { title: string; text: string; art?: string; image?: CmsImage }[] | null
  banners: { title: string; text?: string; start: string; end: string; image?: CmsImage }[] | null
  gallery: { caption?: string; image?: CmsImage }[] | null
  reviews: SiteData['reviews'] | null
}

function toGeo(value: unknown) {
  const geo = value as { lat?: number; lng?: number } | undefined
  return geo?.lat && geo?.lng ? { lat: geo.lat, lng: geo.lng } : undefined
}

/** Use CMS values where present, fallback values otherwise (shallow per field). */
function merge<T extends object>(fallback: T, cms: Doc): T {
  if (!cms) return fallback
  const out = { ...fallback } as Record<string, unknown>
  for (const key of Object.keys(fallback)) {
    const value = cms[key]
    if (value !== undefined && value !== null && value !== '') out[key] = value
  }
  return out as T
}

function normalise(cms: CmsResult): SiteData {
  const fb = fallbackData

  const settings = merge<SiteSettings>(fb.settings, cms.settings)
  settings.features = { ...fb.settings.features, ...((cms.settings?.features as object) ?? {}) }
  settings.social = (cms.settings?.social as SiteSettings['social']) ?? {}
  settings.geo = toGeo(cms.settings?.geo)
  const branches = cms.settings?.branches as (Partial<Branch> & { geo?: unknown })[] | undefined
  settings.branches = branches
    ? branches
        .filter((b) => b.name && b.address)
        .map((b) => ({
          name: b.name!,
          address: { ...fb.settings.address, ...b.address },
          landmark: b.landmark,
          geo: toGeo(b.geo),
          phones: b.phones ?? [],
          googleMapsUrl: b.googleMapsUrl,
          sameHoursAsMain: b.sameHoursAsMain,
          hoursText: b.hoursText,
        }))
    : fb.settings.branches

  const hours = merge<Hours>(fb.hours, cms.hours)
  hours.special = (cms.hours?.special as Hours['special']) ?? []

  const copyDoc = cms.copy as (Record<string, unknown> & { heroImage?: CmsImage }) | null
  const copy = merge<HomeCopy>(fb.copy, copyDoc)
  // Original ratio is kept: the hero crops it per screen size with object-position.
  copy.heroImage = toSiteImage(copyDoc?.heroImage, { width: 2400 }) ?? fb.copy.heroImage

  const products: Product[] = (cms.products ?? []).map((p) => ({
    slug: String(p.slug ?? ''),
    name: String(p.name ?? ''),
    localName: (p.localName as string) || undefined,
    category: String(p.category ?? ''),
    description: (p.description as string) || undefined,
    image: toSiteImage(p.image, { width: 1200, aspect: PORTRAIT }),
    altImage: toSiteImage(p.altImage, { width: 1200, aspect: PORTRAIT }),
    art: (p.art as Product['art']) ?? 'generic',
    tags: (p.tags as string[]) ?? [],
    price: (p.price as string) || undefined,
    featured: Boolean(p.featured),
    verified: Boolean(p.verified),
  }))

  const story = merge<StoryContent>(fb.story, cms.story)
  story.images = (cms.story?.images ?? [])
    .map((img) => toSiteImage(img, { width: 1400, aspect: PORTRAIT }))
    .filter((img): img is SiteImage => Boolean(img))

  const { isoDate } = shopNow()
  const banner = (cms.banners ?? []).find((b) => b.start <= isoDate && b.end >= isoDate)

  return {
    source: 'sanity',
    settings,
    hours,
    copy,
    categories: cms.categories?.length
      ? cms.categories.map((c) => ({
          slug: c.slug,
          title: c.title,
          description: c.description || undefined,
          art: (c.art as Category['art']) ?? 'generic',
          image: toSiteImage(c.image, { width: 1200, aspect: PORTRAIT }),
        }))
      : fb.categories,
    products,
    story,
    highlights: cms.highlights ?? [],
    gifting: {
      intro: cms.giftingPage?.intro ?? fb.gifting.intro,
      occasions: (cms.occasions ?? []).map((o) => ({
        title: o.title,
        text: o.text,
        art: (o.art as Product['art']) ?? 'generic',
        image: toSiteImage(o.image, { width: 1000, aspect: PORTRAIT }),
      })),
      banner: banner && {
        title: banner.title,
        text: banner.text ?? '',
        start: banner.start,
        end: banner.end,
        image: toSiteImage(banner.image, { width: 1600, aspect: 3 / 2 }),
      },
    },
    gallery: (cms.gallery ?? [])
      .map((g) => ({ caption: g.caption, image: toSiteImage(g.image, { width: 1600 }) }))
      .filter((g): g is { caption: string | undefined; image: SiteImage } => Boolean(g.image)),
    reviews: cms.reviews ?? [],
  }
}

export const getSiteData = cache(async (): Promise<SiteData> => {
  if (!isSanityConfigured) return fallbackData
  try {
    const result = await client.fetch<CmsResult>(SITE_QUERY, {}, { cache: 'force-cache', next: { tags: [SANITY_TAG] } })
    // A brand-new, empty dataset: show the built-in content until it is seeded.
    if (!result.settings) return fallbackData
    return normalise(result)
  } catch (error) {
    console.error('[data] Sanity fetch failed, using fallback content', error)
    return fallbackData
  }
})
