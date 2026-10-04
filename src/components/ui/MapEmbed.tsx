'use client'

import { MapPin } from 'lucide-react'
import { useState } from 'react'

/** Static illustrated preview; the real Google Map only loads on request (fast + private). */
export function MapEmbed({ embedUrl, label }: { embedUrl: string; label: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-feature)] bg-paper lg:aspect-auto lg:h-full lg:min-h-[480px]">
      {loaded ? (
        <iframe
          src={embedUrl}
          title={`Map showing ${label}`}
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <>
          <svg className="absolute inset-0 size-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <rect width="800" height="600" fill="#EFE6D6" />
            <g fill="none" stroke="#FAF6EE" strokeLinecap="round">
              <path d="M-20 420 C200 380 420 400 820 300" strokeWidth="34" />
              <path d="M140 -20 L260 620" strokeWidth="22" />
              <path d="M520 -20 C500 200 560 380 600 620" strokeWidth="26" />
              <path d="M-20 160 L820 220" strokeWidth="16" />
              <path d="M-20 560 L820 500" strokeWidth="12" />
              <path d="M330 -20 L380 620" strokeWidth="10" />
              <path d="M680 -20 L720 620" strokeWidth="10" />
            </g>
            <g fill="#E3D6BF">
              <rect x="170" y="210" width="130" height="150" rx="10" />
              <rect x="400" y="250" width="100" height="120" rx="10" />
              <rect x="580" y="90" width="80" height="100" rx="10" />
              <rect x="20" y="20" width="100" height="110" rx="10" />
              <rect x="620" y="360" width="160" height="110" rx="10" />
            </g>
            <circle cx="420" cy="300" r="70" fill="#E39B2D" opacity="0.18" />
          </svg>
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
            <span className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-cream shadow-[var(--shadow-float)]">
              Sri Shakti Sweets
            </span>
            <MapPin className="mt-1 text-saffron-deep" size={36} strokeWidth={1.75} fill="#E39B2D" aria-hidden="true" />
          </div>
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="absolute bottom-4 left-1/2 inline-flex min-h-12 -translate-x-1/2 items-center rounded-full bg-cream px-5 text-sm font-semibold shadow-[var(--shadow-float)] transition-colors hover:bg-ink hover:text-cream"
          >
            Load interactive map
          </button>
        </>
      )}
    </div>
  )
}
