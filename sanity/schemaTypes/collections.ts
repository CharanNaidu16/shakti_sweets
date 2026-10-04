import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { defineField, defineType } from 'sanity'
import { highlightIcons } from '../../src/types/content'
import { artField, imageField } from './fields'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({ name: 'title', title: 'Name', type: 'string', validation: (r) => r.required().max(24) }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'One line about this category', type: 'string', validation: (r) => r.max(70) }),
    imageField('image', 'Category photo (portrait 4:5)'),
    artField(),
    orderRankField({ type: 'category' }),
  ],
})

export const product = defineType({
  name: 'product',
  title: 'Sweet / snack',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required().max(32) }),
    defineField({ name: 'slug', title: 'Web address', type: 'slug', options: { source: 'name' }, validation: (r) => r.required() }),
    defineField({ name: 'localName', title: 'Name in Kannada (optional)', type: 'string' }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short description (optional)',
      type: 'text',
      rows: 2,
      description: 'One sentence about taste and texture (max 90 characters).',
      validation: (r) => r.max(90),
    }),
    imageField('image', 'Main photo (portrait 4:5)'),
    imageField('altImage', 'Second photo, shown on hover (optional)'),
    artField(),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' }, validation: (r) => r.max(2) }),
    defineField({ name: 'price', title: 'Price (optional)', type: 'string', description: 'e.g. ₹640 / kg. Only shown if prices are switched on in Shop details.' }),
    defineField({ name: 'featured', title: 'Show on the home page', type: 'boolean', initialValue: false, description: 'Every item is listed on the full menu page; ticked items are also shown on the home page.' }),
    defineField({ name: 'hidden', title: 'Hide from website', type: 'boolean', initialValue: false }),
    defineField({
      name: 'verified',
      title: 'Owner confirmed we sell this',
      type: 'boolean',
      initialValue: false,
    }),
    orderRankField({ type: 'product' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'category.title', media: 'image', hidden: 'hidden' },
    prepare: ({ title, subtitle, media, hidden }) => ({ title: hidden ? `${title} (hidden)` : title, subtitle, media }),
  },
})

export const highlight = defineType({
  name: 'highlight',
  title: 'Good-to-know point',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required().max(28) }),
    defineField({ name: 'text', type: 'string', validation: (r) => r.required().max(90) }),
    defineField({
      name: 'icon',
      type: 'string',
      options: { list: [...highlightIcons] },
      initialValue: 'sparkles',
    }),
    defineField({
      name: 'verified',
      title: 'The owner confirms this is true',
      type: 'boolean',
      initialValue: false,
      description: 'Points are only shown on the website when this is ticked.',
    }),
    orderRankField({ type: 'highlight' }),
  ],
})

export const giftingOccasion = defineType({
  name: 'giftingOccasion',
  title: 'Gifting occasion',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required().max(28) }),
    defineField({ name: 'text', type: 'text', rows: 2, validation: (r) => r.required().max(110) }),
    imageField('image', 'Photo'),
    artField(),
    orderRankField({ type: 'giftingOccasion' }),
  ],
})

export const seasonalBanner = defineType({
  name: 'seasonalBanner',
  title: 'Seasonal banner',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required().max(50) }),
    defineField({ name: 'text', type: 'text', rows: 2, validation: (r) => r.max(140) }),
    defineField({ name: 'start', title: 'Show from', type: 'date', validation: (r) => r.required() }),
    defineField({
      name: 'end',
      title: 'Show until',
      type: 'date',
      validation: (r) =>
        r.required().custom((end, ctx) => {
          const start = (ctx.document as { start?: string } | undefined)?.start
          return !start || !end || end >= start ? true : 'The end date must be after the start date.'
        }),
    }),
    imageField('image', 'Photo'),
  ],
  preview: { select: { title: 'title', start: 'start', end: 'end' }, prepare: ({ title, start, end }) => ({ title, subtitle: `${start} → ${end}` }) },
})

export const galleryImage = defineType({
  name: 'galleryImage',
  title: 'Gallery photo',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    imageField('image', 'Photo', { required: true }),
    defineField({ name: 'caption', type: 'string', validation: (r) => r.max(80) }),
    orderRankField({ type: 'galleryImage' }),
  ],
  preview: { select: { title: 'caption', alt: 'image.alt', media: 'image' }, prepare: ({ title, alt, media }) => ({ title: title || alt || 'Photo', media }) },
})

export const review = defineType({
  name: 'review',
  title: 'Customer review',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({ name: 'author', title: 'Customer name (first name or initials)', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'text', title: 'Review (copy exactly)', type: 'text', rows: 4, validation: (r) => r.required().max(320) }),
    defineField({ name: 'rating', type: 'number', validation: (r) => r.min(1).max(5).integer() }),
    defineField({ name: 'date', type: 'date' }),
    defineField({ name: 'sourceUrl', title: 'Link to the original review', type: 'url' }),
    defineField({
      name: 'ownerApproved',
      title: 'Real review, approved by the owner',
      type: 'boolean',
      initialValue: false,
      description: 'Reviews are only shown when this is ticked.',
    }),
    orderRankField({ type: 'review' }),
  ],
})
