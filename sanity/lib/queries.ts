import { defineQuery } from 'next-sanity'

// Image projection: keep crop/hotspot for the URL builder, plus size and blur placeholder.
const IMAGE = `{ asset, crop, hotspot, alt, representative, "meta": asset->metadata{ dimensions{ width, height }, lqip } }`

export const SITE_QUERY = defineQuery(`{
  "settings": *[_id == "siteSettings"][0],
  "hours": *[_id == "hours"][0],
  "copy": *[_id == "homeCopy"][0]{ ..., heroImage${IMAGE} },
  "categories": *[_type == "category"] | order(orderRank) { title, "slug": slug.current, description, art, image${IMAGE} },
  "products": *[_type == "product" && hidden != true] | order(orderRank) {
    name, localName, description, art, tags, price, featured, verified,
    "slug": slug.current,
    "category": category->slug.current,
    image${IMAGE}, altImage${IMAGE}
  },
  "story": *[_id == "story"][0]{ ..., images[]${IMAGE} },
  "highlights": *[_type == "highlight" && verified == true] | order(orderRank) { title, text, icon },
  "giftingPage": *[_id == "giftingPage"][0]{ intro },
  "occasions": *[_type == "giftingOccasion"] | order(orderRank) { title, text, art, image${IMAGE} },
  "banners": *[_type == "seasonalBanner"] | order(start asc) { title, text, start, end, image${IMAGE} },
  "gallery": *[_type == "galleryImage"] | order(orderRank) { caption, image${IMAGE} },
  "reviews": *[_type == "review" && ownerApproved == true] | order(orderRank) { author, text, rating, date, sourceUrl }
}`)
