import { ChefHat, Clock, Gift, Heart, Leaf, MapPin, MessageCircle, Sparkles, Store, type LucideIcon } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import type { Highlight, HighlightIcon } from '@/types/content'

const ICONS: Record<HighlightIcon, LucideIcon> = {
  clock: Clock,
  store: Store,
  map: MapPin,
  message: MessageCircle,
  sparkles: Sparkles,
  heart: Heart,
  leaf: Leaf,
  gift: Gift,
  chef: ChefHat,
}

/** "Good to know" — only owner-confirmed points. Hidden with fewer than three. */
export function WhyUs({ highlights }: { highlights: Highlight[] }) {
  if (highlights.length < 3) return null
  return (
    <section aria-labelledby="good-to-know" className="bg-paper py-16 md:py-24">
      <div className="container-site">
        <h2 id="good-to-know" className="eyebrow mb-10 text-saffron-deep">
          Good to know
        </h2>
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {highlights.map((h, i) => {
            const Icon = ICONS[h.icon] ?? Sparkles
            return (
              <Reveal as="li" key={h.title} delay={i * 0.06} className="lg:border-l lg:border-line lg:px-8 lg:first:border-l-0 lg:first:pl-0">
                <Icon size={24} strokeWidth={1.5} className="text-saffron-deep" aria-hidden="true" />
                <h3 className="mt-5 text-h3">{h.title}</h3>
                <p className="mt-2 text-muted">{h.text}</p>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
