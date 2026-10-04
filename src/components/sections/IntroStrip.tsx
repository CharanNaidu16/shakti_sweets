import { Reveal } from '@/components/motion/Reveal'
import { Marquee } from '@/components/ui/Marquee'

export function IntroStrip({ line, names }: { line: string; names: string[] }) {
  return (
    <section aria-label="Introduction" className="border-y border-line py-14 md:py-20">
      <div className="container-site">
        <Reveal>
          <p className="mx-auto max-w-3xl text-center font-display text-[clamp(1.375rem,1.1rem+1.2vw,2.125rem)] leading-snug">
            {line}
          </p>
        </Reveal>
      </div>
      <div className="container-site mt-10 text-muted md:mt-14">
        <Marquee items={names} />
      </div>
    </section>
  )
}
