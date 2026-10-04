import Image from 'next/image'
import type { SiteImage } from '@/types/content'

interface PhotoProps {
  image: SiteImage
  sizes: string
  priority?: boolean
  className?: string
  imgClassName?: string
}

/** Fills its (positioned, sized) parent. */
export function Photo({ image, sizes, priority, className = '', imgClassName = '' }: PhotoProps) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={image.lqip ? 'blur' : 'empty'}
        blurDataURL={image.lqip}
        className={`object-cover ${imgClassName}`}
      />
    </div>
  )
}
