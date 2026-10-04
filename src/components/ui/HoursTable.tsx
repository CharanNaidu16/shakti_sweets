'use client'

import { DAY_NAMES, formatRange, isEveryDaySame, shopNow } from '@/lib/hours'
import { useMinute } from '@/lib/use-minute'
import type { Hours } from '@/types/content'

const ORDER = [1, 2, 3, 4, 5, 6, 0] // Monday first

export function HoursTable({ hours }: { hours: Hours }) {
  const now = useMinute()
  const today = now ? shopNow(now) : null

  const upcoming = hours.special.filter((s) => !today || s.date >= today.isoDate).slice(0, 3)

  return (
    <div>
      {isEveryDaySame(hours) ? (
        <p className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
          <span className="font-semibold">Every day</span>
          <span className="tabular-nums">{formatRange(hours.week[0])}</span>
        </p>
      ) : (
        <table className="w-full text-left">
          <caption className="sr-only">Weekly opening hours</caption>
          <tbody>
            {ORDER.map((day) => {
              const d = hours.week.find((w) => w.day === day)
              const isToday = today?.day === day
              return (
                <tr key={day} className={`border-b border-line ${isToday ? 'font-semibold' : ''}`}>
                  <th scope="row" className="py-2 font-[inherit]">
                    {DAY_NAMES[day]}
                    {isToday && <span className="ml-2 rounded-full bg-saffron/25 px-2 py-0.5 text-xs">Today</span>}
                  </th>
                  <td className="py-2 text-right tabular-nums">{d ? formatRange(d) : 'Closed'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
      {upcoming.length > 0 && (
        <ul className="mt-4 space-y-1 text-sm text-muted">
          {upcoming.map((s) => (
            <li key={s.date}>
              <span className="font-semibold text-ink">
                {new Date(`${s.date}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                {s.label ? ` · ${s.label}` : ''}
              </span>
              : {formatRange(s)}
            </li>
          ))}
        </ul>
      )}
      {hours.note && <p className="mt-3 text-sm text-muted">{hours.note}</p>}
    </div>
  )
}
