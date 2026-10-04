import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import type { ConfigContext } from 'sanity'
import type { StructureBuilder, StructureResolver } from 'sanity/structure'

const emoji = (char: string) => () => char

function singleton(S: StructureBuilder, type: string, title: string, icon: string) {
  return S.listItem()
    .title(title)
    .id(type)
    .icon(emoji(icon))
    .child(S.document().schemaType(type).documentId(type).title(title))
}

export const structure = (context: ConfigContext): StructureResolver => (S) => {
  const ordered = (type: string, title: string, icon: string) =>
    orderableDocumentListDeskItem({ type, title, icon: emoji(icon), S, context })

  return S.list()
    .title('Sri Shakti Sweets')
    .items([
      singleton(S, 'siteSettings', 'Shop details', '🏪'),
      singleton(S, 'hours', 'Opening hours', '🕒'),
      singleton(S, 'homeCopy', 'Home page text & photos', '🏠'),
      S.divider(),
      ordered('product', 'Sweets, snacks & cakes', '🍬'),
      ordered('category', 'Categories', '🗂️'),
      S.divider(),
      singleton(S, 'story', 'Our story', '📖'),
      ordered('highlight', 'Good to know', '✅'),
      ordered('galleryImage', 'Gallery', '🖼️'),
      ordered('review', 'Reviews', '⭐'),
      S.divider(),
      singleton(S, 'giftingPage', 'Gifting intro', '🎁'),
      ordered('giftingOccasion', 'Gifting occasions', '🎀'),
      S.documentTypeListItem('seasonalBanner').title('Seasonal banner').icon(emoji('🪔')),
    ])
}
