// Public URL of the site. Set NEXT_PUBLIC_SITE_URL in production
// (e.g. https://srishaktisweets.in). Without it, Netlify's own URL (set
// automatically at build time) or Vercel's production URL is used.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')
).replace(/\/$/, '')
