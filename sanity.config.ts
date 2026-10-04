'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schemaTypes, singletonTypes } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

const singletons = new Set<string>(singletonTypes)

export default defineConfig({
  name: 'sri-shakti-sweets',
  title: 'Sri Shakti Sweets — Admin',
  basePath: '/admin',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Singletons can't be created from the "+" menu (there is exactly one of each).
    templates: (templates) => templates.filter(({ schemaType }) => !singletons.has(schemaType)),
  },
  document: {
    // Singletons can't be duplicated or deleted.
    actions: (actions, { schemaType }) =>
      singletons.has(schemaType)
        ? actions.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : actions,
  },
  plugins: [
    structureTool({ structure: (S, context) => structure(context)(S, context) }),
    // GROQ query playground — local development only, so the owner never sees it.
    ...(process.env.NODE_ENV === 'development' ? [visionTool({ defaultApiVersion: apiVersion })] : []),
  ],
})
