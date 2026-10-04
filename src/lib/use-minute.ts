'use client'

import { useSyncExternalStore } from 'react'

const subscribe = (onChange: () => void) => {
  const timer = window.setInterval(onChange, 15_000)
  return () => window.clearInterval(timer)
}
const getSnapshot = () => Math.floor(Date.now() / 60_000)
const getServerSnapshot = () => null

/**
 * Current time at minute resolution, or null during server render and
 * hydration — so time-dependent UI never causes a hydration mismatch.
 */
export function useMinute(): Date | null {
  const minute = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return minute === null ? null : new Date(minute * 60_000)
}
