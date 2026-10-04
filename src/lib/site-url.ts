// Public URL of the site. Set NEXT_PUBLIC_SITE_URL in production
// (e.g. https://srishaktisweets.in); Vercel previews fall back to their own URL.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')
).replace(/\/$/, '')
