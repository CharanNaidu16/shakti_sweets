import Image from 'next/image'
import { Photo } from './Photo'
import { SweetArt } from './SweetArt'
import type { Product } from '@/types/content'

interface Props {
  product: Product
  askHref?: string
  showPrice: boolean
  large?: boolean
  sizes: string
}

export function ProductCard({ product, askHref, showPrice, large, sizes }: Props) {
  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-paper">
        <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-out-expo)] [@media(hover:hover)]:group-hover:scale-[1.04]">
          {product.image ? (
            <Photo image={product.image} sizes={sizes} />
          ) : (
            <SweetArt kind={product.art} className="size-full" />
          )}
          {product.altImage && (
            <Image
              src={product.altImage.src}
              alt=""
              fill
              sizes={sizes}
              className="object-cover opacity-0 transition-opacity duration-700 [@media(hover:hover)]:group-hover:opacity-100"
            />
          )}
        </div>
        {product.tags.length > 0 && (
          <ul className="absolute left-3 top-3 flex gap-1.5">
            {product.tags.map((tag) => (
              <li key={tag} className="rounded-[var(--radius-chip)] bg-cream/90 px-2.5 py-1 text-xs font-semibold text-pista">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className={large ? 'text-h2' : 'text-h3'}>{product.name}</h3>
          {showPrice && product.price && <p className="shrink-0 text-sm font-semibold tabular-nums">{product.price}</p>}
        </div>
        {product.localName && (
          <p lang="kn" className="mt-1 font-[family-name:var(--font-kannada)] text-muted">
            {product.localName}
          </p>
        )}
        {product.description && <p className="mt-2 text-muted">{product.description}</p>}
        {askHref && (
          <a
            href={askHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-11 w-fit items-center gap-1.5 text-sm font-semibold text-saffron-deep [@media(hover:hover)]:after:transition-transform [@media(hover:hover)]:group-hover:after:translate-x-1"
          >
            <span className="link-draw">Ask about {product.name}</span>
            <span aria-hidden="true">→</span>
          </a>
        )}
      </div>
    </article>
  )
}
