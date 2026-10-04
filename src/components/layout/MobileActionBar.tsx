'use client'

import { MapPin, Phone } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { WhatsAppIcon } from '@/components/ui/icons'

interface Props {
  whatsappHref?: string
  callHref: string
  directionsHref: string
}

/** One-thumb contact bar on phones. Appears after the hero, hides at the Visit section. */
export function MobileActionBar({ whatsappHref, callHref, directionsHref }: Props) {
  const [pastHero, setPastHero] = useState(false)
  // Pages without a hero (e.g. /menu) show the bar straight away.
  const onHome = usePathname() === '/'
  const visible = onHome ? pastHero : true

  useEffect(() => {
    const hero = document.getElementById('home')
    const visit = document.getElementById('visit')
    const state = { heroVisible: true, visitVisible: false }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === hero) state.heroVisible = e.isIntersecting
        if (e.target === visit) state.visitVisible = e.isIntersecting
      })
      setPastHero(!state.heroVisible && !state.visitVisible)
    })
    if (hero) observer.observe(hero)
    if (visit) observer.observe(visit)
    return () => observer.disconnect()
  }, [])

  const item = 'flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-semibold'

  return (
    <nav
      aria-label="Quick contact"
      className={`fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 flex gap-1.5 rounded-3xl border border-line bg-cream/95 p-1.5 shadow-[var(--shadow-float)] backdrop-blur-md transition-[transform,opacity] duration-500 ease-[var(--ease-out-expo)] md:hidden ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-[140%] opacity-0'}`}
      aria-hidden={!visible}
    >
      {whatsappHref && (
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={`${item} bg-saffron text-ink`} tabIndex={visible ? 0 : -1}>
          <WhatsAppIcon width={20} height={20} />
          WhatsApp
        </a>
      )}
      <a href={callHref} className={`${item} text-ink`} tabIndex={visible ? 0 : -1}>
        <Phone size={20} strokeWidth={1.5} aria-hidden="true" />
        Call
      </a>
      <a href={directionsHref} target="_blank" rel="noopener noreferrer" className={`${item} text-ink`} tabIndex={visible ? 0 : -1}>
        <MapPin size={20} strokeWidth={1.5} aria-hidden="true" />
        Directions
      </a>
    </nav>
  )
}
