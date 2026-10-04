import { createImageUrlBuilder } from '@sanity/image-url'
import type { SiteImage } from '../../src/types/content'
import { dataset, projectId } from '../env'

const builder = createImageUrlBuilder({ projectId: projectId || 'unconfigured', dataset })

export interface CmsImage {
  asset?: { _ref: string }
  crop?: unknown
  hotspot?: unknown
  alt?: string
  representative?: boolean
  meta?: { dimensions?: { width: number; height: number }; lqip?: string }
}

/**
 * Build a SiteImage from a Sanity image. With `aspect` (width / height) the
 * image is cropped around the editor's hotspot; otherwise the original ratio is kept.
 */
export function toSiteImage(image: CmsImage | null | undefined, opts: { width: number; aspect?: number }): SiteImage | undefined {
  if (!image?.asset?._ref) return undefined
  const original = image.meta?.dimensions ?? { width: opts.width, height: opts.width }
  const width = Math.min(opts.width, original.width)
  const height = Math.round(opts.aspect ? width / opts.aspect : (width * original.height) / original.width)

  let url = builder.image(image as never).width(width).auto('format').quality(82)
  if (opts.aspect) url = url.height(height).fit('crop')

  return {
    src: url.url(),
    alt: image.alt ?? '',
    width,
    height,
    lqip: image.meta?.lqip,
    representative: Boolean(image.representative),
  }
}
