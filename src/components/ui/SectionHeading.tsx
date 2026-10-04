import { Reveal } from '@/components/motion/Reveal'
import { Rich } from './Rich'

interface Props {
  id: string
  eyebrow?: string
  title: string
  intro?: string
  tone?: 'light' | 'dark'
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({ id, eyebrow, title, intro, tone = 'light', align = 'left', className = '' }: Props) {
  const dark = tone === 'dark'
  return (
    <Reveal className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-2xl ${className}`}>
      {eyebrow && <p className={`eyebrow mb-4 ${dark ? 'text-saffron' : 'text-saffron-deep'}`}>{eyebrow}</p>}
      <h2 id={id} className="display-em text-h2">
        <Rich text={title} />
      </h2>
      {intro && <p className={`mt-5 text-lead ${dark ? 'text-night-muted' : 'text-muted'}`}>{intro}</p>}
    </Reveal>
  )
}
