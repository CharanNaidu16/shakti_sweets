import { LinkButton } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[80svh] flex-col items-start justify-center pt-24">
      <p className="eyebrow text-saffron-deep">Page not found</p>
      <h1 className="display-em mt-4 text-h1">
        This page has been <em>eaten</em>.
      </h1>
      <p className="mt-4 max-w-md text-lead text-muted">The page you’re looking for doesn’t exist. The sweets are still on the home page.</p>
      <LinkButton href="/" className="mt-8" arrow>
        Back to the shop
      </LinkButton>
    </section>
  )
}
