import type { Metadata, Viewport } from 'next'
import { Fraunces, Manrope, Noto_Serif_Kannada } from 'next/font/google'
import { SITE_URL } from '@/lib/site-url'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['SOFT', 'WONK', 'opsz'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' })

const kannada = Noto_Serif_Kannada({
  subsets: ['kannada'],
  weight: ['400', '500'],
  variable: '--font-kannada',
  display: 'optional',
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
}

export const viewport: Viewport = {
  themeColor: '#faf6ee',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" data-scroll-behavior="smooth" className={`${fraunces.variable} ${manrope.variable} ${kannada.variable}`}>
      <body>{children}</body>
    </html>
  )
}
