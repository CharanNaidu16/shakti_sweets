'use client'

import { openStatus } from '@/lib/hours'
import { useMinute } from '@/lib/use-minute'
import type { Hours } from '@/types/content'

/** Live "Open now · closes 10 pm" badge, computed in the shop's time zone. */
export function OpenStatus({ hours, fallback, tone = 'light' }: { hours: Hours; fallback: string; tone?: 'light' | 'dark' }) {
  const now = useMinute()
  const status = now ? openStatus(hours, now) : null

  const open = status?.state === 'open'
  const label = !status
    ? fallback
    : status.state === 'open'
      ? `Open now · closes ${status.closesAt}`
      : status.opensAt
        ? `Closed · opens ${status.opensDay === 'today' ? '' : `${status.opensDay} `}${status.opensAt}`
        : 'Closed'

  return (
    <span className={`inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold ${tone === 'dark' ? 'text-cream' : 'text-ink'}`}>
      <span className="relative flex size-2.5" aria-hidden="true">
        {open && <span className="absolute inline-flex size-full animate-ping rounded-full bg-pista opacity-50" />}
        <span className={`relative inline-flex size-2.5 rounded-full ${status ? (open ? 'bg-pista' : 'bg-rose') : 'bg-muted/50'}`} />
      </span>
      <span>{label}</span>
    </span>
  )
}
