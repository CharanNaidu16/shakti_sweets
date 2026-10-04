'use client'

import { Menu, Phone, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { WhatsAppIcon } from '@/components/ui/icons'
import { Logo } from '@/components/ui/Logo'

export interface NavLink {
  /** "/#section" for home-page sections, "/menu" for pages */
  href: string
  label: string
}

// Home-page section a link points to; plain "/" means the hero at the top.
const sectionId = (href: string) => (href === '/' ? 'home' : href.includes('#') ? href.split('#')[1] : null)
const sectionHref = (id: string) => (id === 'home' ? '/' : `/#${id}`)

interface Props {
  links: NavLink[]
  ctaHref: string
  ctaLabel: string
  ctaIsWhatsApp: boolean
  callHref: string
  phoneDisplay: string
  address: string
  hoursSummary: string
}

export function SiteHeader({ links, ctaHref, ctaLabel, ctaIsWhatsApp, callHref, phoneDisplay, address, hoursSummary }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [onDark, setOnDark] = useState(false)
  const [active, setActive] = useState<string>('')
  const [menuOpen, setMenuOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const pathname = usePathname()
  const current = pathname === '/' ? active : pathname

  // Solid background after scrolling; hide on scroll down (desktop only).
  useEffect(() => {
    let lastY = window.scrollY
    const desktop = window.matchMedia('(min-width: 1024px)')
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 80)
      setHidden(desktop.matches && y > 400 && y > lastY + 4)
      if (y < lastY - 4) setHidden(false)
      lastY = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the section in view, and switch colours over dark sections.
  useEffect(() => {
    const sections = links
      .map((l) => sectionId(l.href))
      .map((id) => (id ? document.getElementById(id) : null))
      .filter((el): el is HTMLElement => Boolean(el))
    const sectionObserver = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(sectionHref(e.target.id))),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => sectionObserver.observe(s))

    const darkVisible = new Set<Element>()
    const darkObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? darkVisible.add(e.target) : darkVisible.delete(e.target)))
        setOnDark(darkVisible.size > 0)
      },
      { rootMargin: '0px 0px -92% 0px' },
    )
    document.querySelectorAll('[data-nav-theme="dark"]').forEach((el) => darkObserver.observe(el))

    return () => {
      sectionObserver.disconnect()
      darkObserver.disconnect()
    }
  }, [links, pathname])

  // On the home page, scroll to the section ourselves: the browser does nothing when the
  // address already ends in the same "#section" (e.g. clicking "Categories" twice).
  function goToSection(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    const id = sectionId(href)
    const target = id && pathname === '/' ? document.getElementById(id) : null
    if (!target) return
    e.preventDefault()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const behavior = reduce ? 'auto' : 'smooth'
    if (id === 'home') window.scrollTo({ top: 0, behavior })
    else target.scrollIntoView({ behavior, block: 'start' })
    window.history.replaceState(window.history.state, '', href)
  }

  function openMenu() {
    dialogRef.current?.showModal()
    setMenuOpen(true)
  }
  function closeMenu() {
    dialogRef.current?.close()
  }

  const dark = onDark && !menuOpen
  const surface = scrolled
    ? dark
      ? 'bg-night/85 backdrop-blur-md border-b border-line-night'
      : 'bg-cream/85 backdrop-blur-md border-b border-line'
    : 'bg-transparent border-b border-transparent'

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-3 z-[60] -translate-y-20 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-cream focus:translate-y-0"
      >
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-out-expo)] ${surface} ${hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'} ${dark ? 'text-cream' : 'text-ink'}`}
      >
        <div className={`container-site flex items-center justify-between gap-6 transition-[height] duration-500 ${scrolled ? 'h-16' : 'h-16 lg:h-20'}`}>
          <Link href="/" className="shrink-0" aria-label="Sri Shakti Sweets — home">
            <Logo variant={dark ? 'cream' : 'color'} className="h-11 w-auto lg:h-14" />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={(e) => goToSection(e, link.href)}
                    aria-current={current === link.href ? 'true' : undefined}
                    className={`link-draw py-2 text-[0.95rem] font-medium transition-opacity ${current === link.href ? 'bg-[length:100%_1px] opacity-100' : 'opacity-80 hover:opacity-100'}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={ctaHref}
              target={ctaIsWhatsApp ? '_blank' : undefined}
              rel={ctaIsWhatsApp ? 'noopener noreferrer' : undefined}
              className="hidden min-h-11 items-center gap-2 rounded-full bg-saffron px-5 text-sm font-semibold text-ink transition-colors hover:bg-saffron-hover md:inline-flex"
            >
              {ctaIsWhatsApp ? <WhatsAppIcon width={18} height={18} /> : <Phone size={16} aria-hidden="true" />}
              {ctaLabel}
            </a>
            <button
              type="button"
              onClick={openMenu}
              className={`grid size-12 place-items-center rounded-full lg:hidden ${scrolled ? '' : 'bg-cream/85 text-ink shadow-[var(--shadow-float)] backdrop-blur-sm'}`}
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
            >
              <Menu size={24} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <dialog
        ref={dialogRef}
        onClose={() => setMenuOpen(false)}
        aria-label="Menu"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-cream p-0 text-ink backdrop:bg-ink/20 open:animate-[menu-in_0.45s_var(--ease-out-expo)]"
      >
        <div className="container-site flex h-full flex-col">
          <div className="flex h-16 items-center justify-between">
            <Logo className="h-11 w-auto" />
            <button type="button" onClick={closeMenu} className="grid size-12 place-items-center rounded-full" aria-label="Close menu">
              <X size={24} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-10 flex-1">
            <ul className="space-y-2">
              {links.map((link, i) => (
                <li key={link.href} className="menu-item" style={{ animationDelay: `${80 + i * 45}ms` }}>
                  <Link href={link.href} onClick={(e) => {
                      closeMenu()
                      goToSection(e, link.href)
                    }}
                    className="block py-2 font-display text-[2.25rem] leading-tight">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-4 border-t border-line py-8 text-sm">
            <p className="text-muted">{address}</p>
            <p className="font-semibold">{hoursSummary}</p>
            <div className="flex flex-wrap gap-3">
              <a href={ctaHref} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-saffron px-5 font-semibold">
                {ctaIsWhatsApp ? <WhatsAppIcon width={18} height={18} /> : <Phone size={16} aria-hidden="true" />}
                {ctaLabel}
              </a>
              <a href={callHref} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-ink/80 px-5 font-semibold">
                <Phone size={16} aria-hidden="true" />
                {phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}
