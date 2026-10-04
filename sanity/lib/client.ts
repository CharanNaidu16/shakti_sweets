import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId: projectId || 'unconfigured',
  dataset,
  apiVersion,
  // Off so content is fresh immediately after the publish webhook fires.
  useCdn: false,
  // Visitors only ever see published content, never drafts.
  perspective: 'published',
  token: process.env.SANITY_API_READ_TOKEN || undefined,
})
