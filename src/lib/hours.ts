import type { DayHours, Hours } from '@/types/content'

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const TIME_ZONE = 'Asia/Kolkata'

/** "08:00" → "8 am", "22:30" → "10:30 pm" */
export function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  const suffix = h >= 12 ? 'pm' : 'am'
  const hour = h % 12 === 0 ? 12 : h % 12
  return m ? `${hour}:${String(m).padStart(2, '0')} ${suffix}` : `${hour} ${suffix}`
}

export function formatRange(d: { closed: boolean; open?: string; close?: string }) {
  if (d.closed || !d.open || !d.close) return 'Closed'
  return `${formatTime(d.open)} – ${formatTime(d.close)}`
}

/** Current date parts in the shop's time zone, independent of the visitor's. */
export function shopNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  return {
    isoDate: `${get('year')}-${get('month')}-${get('day')}`,
    day: weekday,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  }
}

const toMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

type DaySchedule = Pick<DayHours, 'closed' | 'open' | 'close'>

/** Special-date hours win over the regular weekly hours. */
export function hoursForDate(hours: Hours, isoDate: string, day: number): DaySchedule {
  return hours.special.find((s) => s.date === isoDate) ?? hours.week.find((d) => d.day === day) ?? { closed: true }
}

export type OpenStatus =
  | { state: 'open'; closesAt: string }
  | { state: 'closed'; opensAt?: string; opensDay?: string }

export function openStatus(hours: Hours, date = new Date()): OpenStatus {
  const now = shopNow(date)
  const today = hoursForDate(hours, now.isoDate, now.day)
  if (!today.closed && today.open && today.close) {
    const open = toMinutes(today.open)
    const close = toMinutes(today.close)
    if (now.minutes >= open && now.minutes < close) return { state: 'open', closesAt: formatTime(today.close) }
    if (now.minutes < open) return { state: 'closed', opensAt: formatTime(today.open), opensDay: 'today' }
  }
  // Find the next opening within a week (regular hours only beyond today).
  for (let i = 1; i <= 7; i++) {
    const day = (now.day + i) % 7
    const next = hours.week.find((d) => d.day === day)
    if (next && !next.closed && next.open) {
      return { state: 'closed', opensAt: formatTime(next.open), opensDay: i === 1 ? 'tomorrow' : DAY_NAMES[day] }
    }
  }
  return { state: 'closed' }
}

/** True when every day of the week has identical hours. */
export function isEveryDaySame(hours: Hours) {
  const first = hours.week[0]
  return (
    hours.week.length === 7 &&
    hours.week.every((d) => d.closed === first.closed && d.open === first.open && d.close === first.close)
  )
}
