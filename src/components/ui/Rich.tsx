import { Fragment } from 'react'

/** Renders text with *asterisk* emphasis as <em> (used for CMS headlines). */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.startsWith('*') && part.endsWith('*') && part.length > 2 ? (
          <em key={i}>{part.slice(1, -1)}</em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}

export const plain = (text: string) => text.replace(/\*/g, '')
