import { category, galleryImage, giftingOccasion, highlight, product, review, seasonalBanner } from './collections'
import { giftingPage, homeCopy, hours, siteSettings, story } from './singletons'

export const singletonTypes = ['siteSettings', 'hours', 'homeCopy', 'story', 'giftingPage'] as const

export const schemaTypes = [
  siteSettings,
  hours,
  homeCopy,
  story,
  giftingPage,
  product,
  category,
  giftingOccasion,
  seasonalBanner,
  highlight,
  galleryImage,
  review,
]
