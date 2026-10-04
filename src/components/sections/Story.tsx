import { Reveal } from '@/components/motion/Reveal'
import { LinkButton } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { Photo } from '@/components/ui/Photo'
import { Rich } from '@/components/ui/Rich'
import type { SiteSettings, StoryContent } from '@/types/content'

interface Props {
  story: StoryContent
  settings: SiteSettings
  hoursSummary: string
}

export function Story({ story, settings, hoursSummary }: Props) {
  return (
    <section id="story" aria-labelledby="story-title" data-nav-theme="dark" className="grain section-pad bg-night text-cream">
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <p className="eyebrow mb-4 text-saffron">{story.eyebrow}</p>
              <h2 id="story-title" className="display-em text-h1">
                <Rich text={story.title} />
              </h2>
            </Reveal>
            {story.quote?.text && (
              <Reveal delay={0.1}>
                <blockquote className="mt-10 border-l-2 border-saffron pl-6">
                  <p className="font-display text-h3 italic">“{story.quote.text}”</p>
                  {story.quote.attribution && <footer className="mt-3 text-sm text-night-muted">{story.quote.attribution}</footer>}
                </blockquote>
              </Reveal>
            )}
          </div>
        </div>

        <div className="space-y-12 lg:col-span-6 lg:col-start-7">
          {story.images.length > 0 ? (
            story.images.map((image, i) => (
              <Reveal key={image.src} delay={i * 0.05}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-feature)]">
                  <Photo image={image} sizes="(min-width: 1024px) 45vw, 100vw" />
                </div>
                {story.paragraphs[i] && <p className="mt-8 text-lead text-night-muted">{story.paragraphs[i]}</p>}
              </Reveal>
            ))
          ) : (
            <Reveal>
              {/* No shop photos yet: a typographic panel built from confirmed facts */}
              <div className="relative overflow-hidden rounded-[var(--radius-feature)] border border-line-night p-8 md:p-12">
                <Logo variant="cream" className="w-full max-w-sm text-cream" />
                {settings.features.kannadaAccents && settings.localName && (
                  <p lang="kn" className="mt-8 font-[family-name:var(--font-kannada)] text-[clamp(1.75rem,1.3rem+2vw,2.75rem)] text-saffron">
                    {settings.localName}
                  </p>
                )}
                <dl className="mt-10 grid gap-6 border-t border-line-night pt-8 sm:grid-cols-2">
                  <div>
                    <dt className="eyebrow text-night-muted">Open</dt>
                    <dd className="mt-2 font-display text-h3">{hoursSummary}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow text-night-muted">Find us</dt>
                    <dd className="mt-2 font-display text-h3">
                      {[settings.address.locality, ...settings.branches.map((b) => b.name)].join(' · ')}
                    </dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          )}

          {story.paragraphs.slice(story.images.length).map((p, i) => (
            <Reveal key={i} delay={0.05}>
              <p className="text-lead text-night-muted">{p}</p>
            </Reveal>
          ))}

          <Reveal>
            <LinkButton href="#visit" variant="secondary-light" arrow>
              Visit us
            </LinkButton>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
