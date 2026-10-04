/**
 * Copies the built-in content (src/content/fallback.ts) into Sanity so the
 * admin panel starts filled in. Safe to re-run: it only creates documents
 * that don't exist yet, so edits made in /admin are never overwritten.
 *
 *   npx sanity exec scripts/seed-sanity.ts --with-user-token
 */
import { createReadStream } from 'node:fs'
import path from 'node:path'
import { getCliClient } from 'sanity/cli'
import { fallbackData as d } from '../src/content/fallback'

const client = getCliClient({ apiVersion: '2025-10-01' })

const key = (i: number) => `k${i}`
const rank = (i: number) => `0|${String(100000 + i * 1000).padStart(6, '0')}:`

async function uploadImage(publicPath: string, alt: string, representative: boolean) {
  const file = path.join(process.cwd(), 'public', publicPath)
  const asset = await client.assets.upload('image', createReadStream(file), { filename: path.basename(file) })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, alt, representative }
}

async function main() {
  const existing = new Set(await client.fetch<string[]>('*[!(_id in path("drafts.**"))]._id'))
  const docs: Record<string, unknown>[] = []
  const add = (doc: { _id: string } & Record<string, unknown>) => {
    if (!existing.has(doc._id)) docs.push(doc)
  }

  const s = d.settings
  add({
    _id: 'siteSettings',
    _type: 'siteSettings',
    name: s.name,
    localName: s.localName,
    tagline: s.tagline,
    description: s.description,
    address: { ...s.address },
    landmark: s.landmark,
    googleMapsUrl: s.googleMapsUrl,
    phones: s.phones.map((p, i) => ({ _key: key(i), ...p })),
    whatsapp: s.whatsapp,
    email: s.email,
    mainShopName: s.mainShopName,
    branches: s.branches.map((b, i) => ({
      _key: key(i),
      _type: 'branch',
      ...b,
      phones: b.phones.map((p, j) => ({ _key: key(j), ...p })),
    })),
    social: {},
    features: s.features,
  })

  add({
    _id: 'hours',
    _type: 'hours',
    week: d.hours.week.map((w, i) => ({ _key: key(i), _type: 'dayHours', ...w })),
    special: [],
  })

  if (!existing.has('homeCopy')) {
    const { heroImage, ...copy } = d.copy
    add({
      _id: 'homeCopy',
      _type: 'homeCopy',
      ...copy,
      ...(heroImage && { heroImage: await uploadImage(heroImage.src, heroImage.alt, heroImage.representative) }),
    })
  }

  add({
    _id: 'story',
    _type: 'story',
    eyebrow: d.story.eyebrow,
    title: d.story.title,
    paragraphs: d.story.paragraphs,
  })
  add({ _id: 'giftingPage', _type: 'giftingPage', intro: d.gifting.intro })

  // Photos are uploaded once and reused (the sweets category and Malai Sandwich share one).
  const uploaded = new Map<string, Awaited<ReturnType<typeof uploadImage>>>()
  const image = async (img?: { src: string; alt: string; representative: boolean }) => {
    if (!img) return undefined
    if (!uploaded.has(img.src)) uploaded.set(img.src, await uploadImage(img.src, img.alt, img.representative))
    return { ...uploaded.get(img.src)!, alt: img.alt }
  }

  for (const [i, c] of d.categories.entries()) {
    if (existing.has(`category-${c.slug}`)) continue
    add({
      _id: `category-${c.slug}`,
      _type: 'category',
      title: c.title,
      slug: { _type: 'slug', current: c.slug },
      description: c.description,
      art: c.art,
      image: await image(c.image),
      orderRank: rank(i),
    })
  }

  for (const [i, p] of d.products.entries()) {
    if (existing.has(`product-${p.slug}`)) continue
    add({
      _id: `product-${p.slug}`,
      _type: 'product',
      name: p.name,
      slug: { _type: 'slug', current: p.slug },
      category: { _type: 'reference', _ref: `category-${p.category}` },
      description: p.description,
      image: await image(p.image),
      art: p.art,
      tags: p.tags,
      featured: p.featured,
      hidden: false,
      verified: p.verified,
      orderRank: rank(i),
    })
  }

  d.highlights.forEach((h, i) =>
    // These four are plain facts confirmed by the client (hours, signboard, address).
    add({ _id: `highlight-${i}`, _type: 'highlight', ...h, verified: true, orderRank: rank(i) }),
  )

  d.gifting.occasions.forEach((o, i) =>
    add({ _id: `occasion-${i}`, _type: 'giftingOccasion', title: o.title, text: o.text, art: o.art, orderRank: rank(i) }),
  )

  if (docs.length === 0) {
    console.log('Nothing to do — every document already exists.')
    return
  }
  const tx = client.transaction()
  docs.forEach((doc) => tx.createIfNotExists(doc as { _id: string; _type: string }))
  await tx.commit()
  console.log(`Created ${docs.length} documents:`, docs.map((doc) => doc._id).join(', '))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
