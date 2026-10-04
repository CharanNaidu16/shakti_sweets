import { FRAME_PATH, LOGO_NAVY, LOGO_RED, MARK_PATH } from './logo-paths'

/** The "SS" monogram on its white tile — identical on light and dark backgrounds. */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="-4 -4 78 108" className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <rect x="-4" y="-4" width="78" height="108" rx="6" fill="#FFFFFF" />
      <path d={FRAME_PATH} fill="none" stroke={LOGO_RED} strokeWidth="1.6" />
      <path d={MARK_PATH} fill={LOGO_NAVY} />
    </svg>
  )
}

interface LogoProps {
  variant?: 'color' | 'cream'
  className?: string
  title?: string
}

/** Monogram + wordmark lockup. `cream` is for dark backgrounds. */
export function Logo({ variant = 'color', className, title = 'Sri Shakti Sweets' }: LogoProps) {
  const cream = variant === 'cream'
  return (
    <svg viewBox="0 0 340 108" role="img" aria-label={title} className={className}>
      <g transform="translate(4 4)">
        <rect x="-4" y="-4" width="78" height="108" rx="6" fill="#FFFFFF" />
        <path d={FRAME_PATH} fill="none" stroke={LOGO_RED} strokeWidth="1.6" />
        <path d={MARK_PATH} fill={LOGO_NAVY} />
      </g>
      <g style={{ fontFamily: 'var(--font-display)', fontVariationSettings: "'SOFT' 60, 'WONK' 0" }}>
        <text x="96" y="60" fontSize="38" fontWeight="600" fill={cream ? 'currentColor' : LOGO_NAVY} textLength="236" lengthAdjust="spacingAndGlyphs">
          Sri Shakti Sweets
        </text>
      </g>
      <text
        x="97"
        y="88"
        fontSize="13"
        fontWeight="700"
        letterSpacing="3.2"
        fill={cream ? 'currentColor' : LOGO_RED}
        opacity={cream ? 0.7 : 1}
        style={{ fontFamily: 'var(--font-sans)' }}
        textLength="236"
        lengthAdjust="spacingAndGlyphs"
      >
        SWEETS · SNACKS · CAKES
      </text>
    </svg>
  )
}
