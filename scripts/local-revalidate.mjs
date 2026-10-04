/**
 * Local stand-in for the Sanity webhook. Sanity can't reach a site running on
 * your own computer, so this watches the dataset and, whenever something is
 * published, sends /api/revalidate the same signed request the real webhook
 * sends. The deployed site doesn't need this.
 *
 *   npm run admin:watch            (site on http://localhost:3100)
 *   SITE=http://localhost:3000 npm run admin:watch
 */
import { createClient } from '@sanity/client'
import { encodeSignatureHeader, SIGNATURE_HEADER_NAME } from '@sanity/webhook'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const secret = process.env.SANITY_REVALIDATE_SECRET
const site = process.env.SITE || 'http://localhost:3100'

if (!projectId || !secret) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_REVALIDATE_SECRET in .env.local')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2025-10-01', useCdn: false })

async function revalidate(type) {
  const body = JSON.stringify({ _type: type })
  const signature = await encodeSignatureHeader(body, Date.now(), secret)
  try {
    const res = await fetch(`${site}/api/revalidate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', [SIGNATURE_HEADER_NAME]: signature },
      body,
    })
    console.log(`${new Date().toLocaleTimeString()}  published ${type} → site refreshed (${res.status})`)
  } catch (error) {
    console.error(`Could not reach ${site} — is the site running?`, error.message)
  }
}

// Publishing several fields at once fires several events; refresh once per burst.
let timer
let lastType = 'document'

// Sanity closes idle listeners after a while; reconnect instead of exiting.
function watch() {
  client.listen('*[!(_id in path("drafts.**"))]', {}, { visibility: 'query' }).subscribe({
    next: (event) => {
      if (event.type !== 'mutation') return
      lastType = event.result?._type ?? event.documentId ?? 'document'
      clearTimeout(timer)
      timer = setTimeout(() => revalidate(lastType), 800)
    },
    error: (error) => {
      console.error(`Lost connection to Sanity (${error.message}), reconnecting in 5s…`)
      setTimeout(watch, 5000)
    },
    complete: () => setTimeout(watch, 1000),
  })
}
watch()
// The listener's connection doesn't keep Node running on its own; this does.
setInterval(() => {}, 60_000)

console.log(`Watching Sanity project ${projectId}/${dataset}. Publish something in /admin and ${site} will refresh.`)
