import { NextStudio } from 'next-sanity/studio'
import { isSanityConfigured } from '@sanity-config/env'
import config from '../../../../sanity.config'

export const dynamic = 'force-static'
export { metadata, viewport } from 'next-sanity/studio'

export default function AdminPage() {
  if (!isSanityConfigured) {
    return (
      <main style={{ maxWidth: 560, margin: '15vh auto', padding: 24, fontFamily: 'system-ui, sans-serif', lineHeight: 1.6 }}>
        <h1 style={{ fontSize: 24, marginBottom: 12 }}>Admin panel not connected yet</h1>
        <p>
          Add <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> to <code>.env.local</code> and restart the server. Step-by-step
          instructions are in <code>docs/ADMIN_SETUP.md</code>.
        </p>
      </main>
    )
  }
  return <NextStudio config={config} />
}
