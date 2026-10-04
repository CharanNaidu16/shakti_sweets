import { defineField } from 'sanity'
import { sweetArts } from '../../src/types/content'

const MIN_EDGE = 1600

/** Image field with required alt text, hotspot and a "stock photo" record-keeping toggle. */
export function imageField(
  name: string,
  title: string,
  options: { required?: boolean; description?: string; group?: string } = {},
) {
  return defineField({
    name,
    title,
    type: 'image',
    group: options.group,
    description:
      options.description ??
      'Use a sharp photo, at least 1600px on the long edge. After uploading, click the crop icon to set the focus point.',
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Describe the photo',
        type: 'string',
        description: 'For blind visitors and Google, e.g. "Kaju katli arranged on a brass plate".',
        validation: (rule) => rule.required().max(140),
      }),
      defineField({
        name: 'representative',
        title: 'This is a sample / stock photo (not our real product or shop)',
        type: 'boolean',
        initialValue: false,
        description: 'For your records only, so stock photos needing a licence are easy to find. Nothing is shown on the website.',
      }),
    ],
    validation: (rule) => {
      const base = options.required ? rule.required() : rule
      return base.custom((value: { asset?: { _ref?: string } } | undefined) => {
        const ref = value?.asset?._ref
        const match = ref?.match(/-(\d+)x(\d+)-/)
        if (match && Math.max(Number(match[1]), Number(match[2])) < MIN_EDGE) {
          return { message: `This photo is small (${match[1]}×${match[2]}). It may look blurry on large screens.`, level: 'warning' } as never
        }
        return true
      })
    },
  })
}

export function artField() {
  return defineField({
    name: 'art',
    title: 'Illustration (shown when there is no photo)',
    type: 'string',
    options: { list: sweetArts.map((a) => ({ title: a[0].toUpperCase() + a.slice(1), value: a })) },
    initialValue: 'generic',
  })
}

/** Headline field supporting *italic* emphasis. */
export function headlineField(name: string, title: string, max = 70) {
  return defineField({
    name,
    title,
    type: 'string',
    description: 'Wrap a word in *asterisks* to show it in italics.',
    validation: (rule) => rule.required().max(max),
  })
}
