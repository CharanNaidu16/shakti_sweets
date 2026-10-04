import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { SANITY_TAG } from '@/lib/data'

// Called by a Sanity webhook whenever content is published, so the live site
// updates within seconds without a rebuild. See docs/ADMIN_SETUP.md.
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) return NextResponse.json({ message: 'Revalidation secret not configured' }, { status: 500 })

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true)
    if (!isValidSignature) return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })

    revalidateTag(SANITY_TAG, { expire: 0 })
    return NextResponse.json({ revalidated: true, type: body?._type ?? null, now: Date.now() })
  } catch (error) {
    console.error('[revalidate]', error)
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
