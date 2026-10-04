import { ImageResponse } from 'next/og'
import { FRAME_PATH, LOGO_NAVY, LOGO_RED, MARK_PATH } from '@/components/ui/logo-paths'
import { getSiteData } from '@/lib/data'
import { viewModel } from '@/lib/view'

export const alt = 'Sri Shakti Sweets — Sweets, Snacks & Cakes in Bengaluru'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Share preview (WhatsApp, Facebook, Google). Typographic, so it never shows a stock photo.
export default async function OpengraphImage() {
  const data = await getSiteData()
  const { settings } = data
  const { hoursSummary } = viewModel(data)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: '#FAF6EE',
          color: '#211A16',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <svg width="78" height="108" viewBox="-4 -4 78 108">
            <rect x="-4" y="-4" width="78" height="108" rx="6" fill="#FFFFFF" />
            <path d={FRAME_PATH} fill="none" stroke={LOGO_RED} strokeWidth="1.6" />
            <path d={MARK_PATH} fill={LOGO_NAVY} />
          </svg>
          <div style={{ display: 'flex', fontSize: 26, letterSpacing: 6, color: '#9C5209', fontFamily: 'sans-serif', fontWeight: 700 }}>
            {settings.tagline.toUpperCase()} · {settings.address.city.toUpperCase()}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 112, lineHeight: 1, color: '#2E3192', fontWeight: 700 }}>{settings.name}</div>
          <div style={{ marginTop: 24, fontSize: 40, color: '#6B5E54', fontStyle: 'italic' }}>A little sweetness. A lot of joy.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 30, fontFamily: 'sans-serif' }}>
          <div style={{ display: 'flex', width: 18, height: 18, borderRadius: 9, background: '#E39B2D' }} />
          {hoursSummary}
        </div>
      </div>
    ),
    size,
  )
}
