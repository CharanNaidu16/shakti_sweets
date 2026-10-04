import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'secondary-light'

const base =
  'group inline-flex min-h-[52px] items-center justify-center gap-2.5 whitespace-nowrap rounded-full px-7 text-[1rem] font-semibold transition-[background-color,color,border-color,transform] duration-200 active:scale-[0.98] md:min-h-12'

const variants: Record<Variant, string> = {
  primary: 'bg-saffron text-ink hover:bg-saffron-hover',
  secondary: 'border border-ink/80 text-ink hover:bg-ink hover:text-cream',
  'secondary-light': 'border border-cream/60 text-cream hover:bg-cream hover:text-night',
}

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  variant?: Variant
  icon?: ReactNode
  arrow?: boolean
}

export function LinkButton({ href, variant = 'primary', icon, arrow, className = '', children, ...rest }: Props) {
  const external = /^https?:/.test(href)
  return (
    <a
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      {...rest}
    >
      {icon}
      <span>{children}</span>
      {arrow && (
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      )}
    </a>
  )
}
