// Shared motion presets (docs/PROJECT_PLAN.md §9).
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const

export const DURATION = {
  ui: 0.2,
  reveal: 0.7,
  hero: 0.9,
} as const

export const VIEWPORT_ONCE = { once: true, margin: '0px 0px -12% 0px' } as const
