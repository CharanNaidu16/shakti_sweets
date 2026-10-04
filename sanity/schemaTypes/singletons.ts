import { defineArrayMember, defineField, defineType } from 'sanity'
import { headlineField, imageField } from './fields'

const time = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'string',
    description: '24-hour time, e.g. 08:00 or 22:00',
    validation: (rule) => rule.regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: 'HH:MM' }),
  })

const addressFields = [
  defineField({ name: 'line1', title: 'Building / door number', type: 'string', validation: (r) => r.required() }),
  defineField({ name: 'line2', title: 'Street', type: 'string' }),
  defineField({ name: 'locality', title: 'Area', type: 'string', validation: (r) => r.required() }),
  defineField({ name: 'city', title: 'City', type: 'string', initialValue: 'Bengaluru' }),
  defineField({ name: 'state', title: 'State', type: 'string', initialValue: 'Karnataka' }),
  defineField({
    name: 'postalCode',
    title: 'PIN code',
    type: 'string',
    validation: (r) => r.regex(/^\d{6}$/, { name: '6-digit PIN' }),
  }),
  defineField({ name: 'country', title: 'Country code', type: 'string', initialValue: 'IN', readOnly: true }),
]

const phoneMember = defineArrayMember({
  type: 'object',
  fields: [
    defineField({
      name: 'number',
      title: 'Number',
      type: 'string',
      description: 'With country code, e.g. +919341222517',
      validation: (r) => r.required().regex(/^\+91\d{10}$/, { name: '+91 and 10 digits' }),
    }),
    defineField({ name: 'display', title: 'How it is shown', type: 'string', description: 'e.g. +91 93412 22517' }),
    defineField({ name: 'label', title: 'Label', type: 'string', description: 'e.g. Mobile, Shop' }),
  ],
  preview: { select: { title: 'display', subtitle: 'label' } },
})

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Shop details',
  type: 'document',
  groups: [
    { name: 'shop', title: 'Shop', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'sections', title: 'Show / hide sections' },
  ],
  fields: [
    defineField({ name: 'name', title: 'Shop name', type: 'string', group: 'shop', validation: (r) => r.required() }),
    defineField({ name: 'localName', title: 'Shop name in Kannada', type: 'string', group: 'shop' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string', group: 'shop', validation: (r) => r.max(40) }),
    defineField({
      name: 'description',
      title: 'Google description',
      type: 'text',
      rows: 3,
      group: 'shop',
      description: 'Shown in Google search results. Keep it under 155 characters.',
      validation: (r) => r.required().max(160),
    }),
    defineField({
      name: 'mainShopName',
      title: 'Main shop label',
      type: 'string',
      group: 'shop',
      description: 'Shown when you have more than one shop, e.g. "Okalipuram".',
    }),
    defineField({
      name: 'address',
      title: 'Address (main shop)',
      type: 'object',
      group: 'shop',
      fields: addressFields,
    }),
    defineField({
      name: 'branches',
      title: 'Other shops',
      type: 'array',
      group: 'shop',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'branch',
          fields: [
            defineField({ name: 'name', title: 'Shop name', type: 'string', description: 'e.g. Magadi Road', validation: (r) => r.required().max(30) }),
            defineField({ name: 'address', title: 'Address', type: 'object', fields: addressFields }),
            defineField({ name: 'landmark', title: 'Landmark', type: 'string' }),
            defineField({ name: 'geo', title: 'Map pin', type: 'geopoint' }),
            defineField({ name: 'phones', title: 'Phone numbers', type: 'array', of: [phoneMember] }),
            defineField({ name: 'googleMapsUrl', title: 'Google Maps link', type: 'url' }),
            defineField({ name: 'sameHoursAsMain', title: 'Same opening hours as the main shop', type: 'boolean', initialValue: true }),
            defineField({
              name: 'hoursText',
              title: 'Opening hours (if different)',
              type: 'string',
              description: 'e.g. "9 am – 9 pm, every day". Leave empty to show "Call for timings".',
              hidden: ({ parent }) => Boolean((parent as { sameHoursAsMain?: boolean } | undefined)?.sameHoursAsMain),
            }),
          ],
          preview: { select: { title: 'name', subtitle: 'address.line1' } },
        }),
      ],
    }),
    defineField({ name: 'landmark', title: 'Landmark', type: 'string', group: 'shop', description: 'e.g. "Near Majestic"' }),
    defineField({
      name: 'geo',
      title: 'Map pin',
      type: 'geopoint',
      group: 'shop',
      description: 'Optional. Makes the map and directions point exactly at the shop.',
    }),
    defineField({ name: 'googleMapsUrl', title: 'Google Maps link', type: 'url', group: 'shop' }),
    defineField({
      name: 'phones',
      title: 'Phone numbers',
      type: 'array',
      group: 'contact',
      of: [
        phoneMember,
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp number',
      type: 'string',
      group: 'contact',
      description: 'Country code + number, digits only, e.g. 919341222517. Leave empty to hide WhatsApp buttons.',
      validation: (r) => r.regex(/^91\d{10}$/, { name: '91 and 10 digits' }),
    }),
    defineField({ name: 'email', title: 'Email', type: 'string', group: 'contact' }),
    defineField({
      name: 'social',
      title: 'Social media',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'instagram', type: 'url' }),
        defineField({ name: 'facebook', type: 'url' }),
        defineField({ name: 'youtube', type: 'url' }),
      ],
    }),
    defineField({ name: 'fssai', title: 'FSSAI licence number', type: 'string', group: 'contact' }),
    defineField({
      name: 'features',
      title: 'Sections',
      type: 'object',
      group: 'sections',
      fields: [
        defineField({ name: 'gifting', title: 'Show "Gifting & occasions"', type: 'boolean', initialValue: false }),
        defineField({ name: 'whyUs', title: 'Show "Good to know"', type: 'boolean', initialValue: true }),
        defineField({ name: 'reviews', title: 'Show "Reviews"', type: 'boolean', initialValue: false }),
        defineField({
          name: 'gallery',
          title: 'Show "Gallery"',
          type: 'boolean',
          initialValue: true,
          description: 'Appears once at least 3 photos are added.',
        }),
        defineField({ name: 'prices', title: 'Show prices on sweets', type: 'boolean', initialValue: false }),
        defineField({ name: 'kannadaAccents', title: 'Show Kannada accents', type: 'boolean', initialValue: true }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Shop details' }) },
})

export const hours = defineType({
  name: 'hours',
  title: 'Opening hours',
  type: 'document',
  fields: [
    defineField({
      name: 'week',
      title: 'Weekly hours',
      type: 'array',
      validation: (r) => r.length(7).error('Add exactly one row for each day of the week.'),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'dayHours',
          fields: [
            defineField({
              name: 'day',
              title: 'Day',
              type: 'number',
              options: {
                list: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((title, value) => ({
                  title,
                  value,
                })),
              },
              validation: (r) => r.required(),
            }),
            defineField({ name: 'closed', title: 'Closed all day', type: 'boolean', initialValue: false }),
            time('open', 'Opens'),
            time('close', 'Closes'),
          ],
          preview: {
            select: { day: 'day', closed: 'closed', open: 'open', close: 'close' },
            prepare: ({ day, closed, open, close }) => ({
              title: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day] ?? 'Day',
              subtitle: closed ? 'Closed' : `${open ?? '?'} – ${close ?? '?'}`,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'special',
      title: 'Special dates (festivals, holidays)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'specialHours',
          fields: [
            defineField({ name: 'date', title: 'Date', type: 'date', validation: (r) => r.required() }),
            defineField({ name: 'label', title: 'Reason', type: 'string', description: 'e.g. Deepavali' }),
            defineField({ name: 'closed', title: 'Closed all day', type: 'boolean', initialValue: false }),
            time('open', 'Opens'),
            time('close', 'Closes'),
          ],
          preview: {
            select: { date: 'date', label: 'label', closed: 'closed', open: 'open', close: 'close' },
            prepare: ({ date, label, closed, open, close }) => ({
              title: `${date ?? ''} ${label ? `· ${label}` : ''}`,
              subtitle: closed ? 'Closed' : `${open ?? '?'} – ${close ?? '?'}`,
            }),
          },
        }),
      ],
    }),
    defineField({ name: 'note', title: 'Note under the hours', type: 'string' }),
  ],
  preview: { prepare: () => ({ title: 'Opening hours' }) },
})

export const homeCopy = defineType({
  name: 'homeCopy',
  title: 'Home page text',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Top of page', default: true },
    { name: 'sections', title: 'Section titles' },
    { name: 'whatsapp', title: 'WhatsApp messages' },
  ],
  fields: [
    defineField({ name: 'heroEyebrow', title: 'Small line above the headline', type: 'string', group: 'hero', validation: (r) => r.required().max(60) }),
    { ...headlineField('heroHeadline', 'Headline', 48), group: 'hero' },
    defineField({ name: 'heroSubline', title: 'Text under the headline', type: 'text', rows: 2, group: 'hero', validation: (r) => r.required().max(160) }),
    imageField('heroImage', 'Main photo (wide)', {
      group: 'hero',
      description:
        'A wide, landscape photo (about twice as wide as it is tall), at least 1800px wide. Set the focus point on the sweets: phones show a narrower crop around it.',
    }),
    defineField({ name: 'introLine', title: 'Introduction sentence', type: 'text', rows: 2, group: 'sections', validation: (r) => r.required().max(180) }),
    defineField({ name: 'sweetsEyebrow', title: 'Sweets: small label', type: 'string', group: 'sections', validation: (r) => r.max(40) }),
    { ...headlineField('sweetsTitle', 'Sweets: title', 40), group: 'sections' },
    defineField({ name: 'sweetsIntro', title: 'Sweets: intro', type: 'text', rows: 2, group: 'sections', validation: (r) => r.max(160) }),
    { ...headlineField('visitTitle', 'Visit us: title', 40), group: 'sections' },
    { ...headlineField('finalCtaTitle', 'Bottom of page: big line', 70), group: 'sections' },
    defineField({ name: 'whatsappGeneral', title: 'General message', type: 'text', rows: 2, group: 'whatsapp', validation: (r) => r.required() }),
    defineField({
      name: 'whatsappProduct',
      title: 'Message when asking about a sweet',
      type: 'text',
      rows: 2,
      group: 'whatsapp',
      description: '{product} is replaced with the sweet’s name.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'whatsappBulk',
      title: 'Bulk / gifting message',
      type: 'text',
      rows: 4,
      group: 'whatsapp',
      description: '{occasion} is replaced with the occasion name.',
      validation: (r) => r.required(),
    }),
  ],
  preview: { prepare: () => ({ title: 'Home page text' }) },
})

export const story = defineType({
  name: 'story',
  title: 'Our story',
  type: 'document',
  fields: [
    defineField({ name: 'eyebrow', title: 'Small label', type: 'string', validation: (r) => r.max(30) }),
    headlineField('title', 'Title', 60),
    defineField({
      name: 'paragraphs',
      title: 'Paragraphs',
      type: 'array',
      of: [defineArrayMember({ type: 'text', rows: 4 })],
      description: 'Only true facts about the shop. 1–3 short paragraphs read best.',
      validation: (r) => r.max(4),
    }),
    defineField({
      name: 'quote',
      title: 'Quote (optional)',
      type: 'object',
      fields: [
        defineField({ name: 'text', type: 'text', rows: 2, validation: (r) => r.max(200) }),
        defineField({ name: 'attribution', type: 'string', description: 'e.g. "Owner, Sri Shakti Sweets"' }),
      ],
    }),
    defineField({
      name: 'images',
      title: 'Photos of the shop, counter or kitchen',
      type: 'array',
      of: [imageField('image', 'Photo')],
      validation: (r) => r.max(3),
    }),
  ],
  preview: { prepare: () => ({ title: 'Our story' }) },
})

export const giftingPage = defineType({
  name: 'giftingPage',
  title: 'Gifting intro',
  type: 'document',
  fields: [defineField({ name: 'intro', title: 'Introduction', type: 'text', rows: 2, validation: (r) => r.max(180) })],
  preview: { prepare: () => ({ title: 'Gifting intro' }) },
})
