export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production'
export const apiVersion = '2025-10-01'

/** False until a Sanity project ID is set — the site then runs on fallback content. */
export const isSanityConfigured = /^[a-z0-9-]+$/.test(projectId)
