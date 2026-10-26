import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'

const links = [
  ['top', 'HOME'],
  ['services', 'SERVICES'],
  ['skills', 'SKILLS'],
  ['projects', 'PROJECTS'],
  ['certs', 'CERTS'],
]

// Pages that have no link of their own: null clears the highlight, a name highlights that link.
const alias = { journey: null, api: null, contact: null, experience: 'certs' }
const watched = [...links.map(([id]) => id), ...Object.keys(alias)]

export default function Navbar({ name, onSearch, onHome }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(null)
  const [progress, setProgress] = useState(0)

  // Scroll progress line along the bottom of the bar.
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the link of the section that is on screen.
  useEffect(() => {
    if (!onHome) {
      setActive(null)
      return
    }
    const seen = new Map()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting))
        const hit = watched.find((id) => seen.get(id))
        if (hit) setActive(alias[hit] ?? hit)
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    watched.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [onHome])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const linkClass = (id) =>
    `font-label-lg uppercase tracking-wider transition-colors ${
      active === id
        ? 'border-b-2 border-primary-container pb-1 text-primary-container'
        : 'text-on-surface-variant hover:text-on-surface'
    }`

  return (
    <header className="fixed left-0 top-0 z-40 w-full border-b border-white/10 bg-[#0B0C0E]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-margin md:px-margin-desktop">
        <a href="#top" className="flex items-center gap-space-sm" aria-label={`${name}, back to top`}>
          <span className="h-2.5 w-2.5 shrink-0 bg-primary-container" aria-hidden="true" />
          <span className="font-label-lg text-[14px] font-bold uppercase tracking-[3px] text-primary-container">{name}</span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-space-xl lg:flex">
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`} aria-current={active === id ? 'true' : undefined} className={linkClass(id)}>
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-space-sm sm:gap-space-md">
          <button
            type="button"
            onClick={onSearch}
            aria-label="Search the site"
            className="hidden h-9 items-center gap-space-sm border border-white/20 bg-surface-container-low/50 px-space-md text-on-surface-variant transition-colors hover:border-primary-container hover:text-on-surface sm:inline-flex"
          >
            <Icon name="search" size={16} />
            <span className="font-label-sm text-label-sm font-semibold uppercase">Search</span>
          </button>
          <button
            type="button"
            onClick={onSearch}
            aria-label="Search the site"
            className="flex h-9 w-9 items-center justify-center border border-white/20 text-on-surface-variant sm:hidden"
          >
            <Icon name="search" size={16} />
          </button>
          <a
            href="#contact"
            className="inline-flex h-9 items-center border border-primary-container px-space-md font-label-sm text-label-sm font-bold uppercase text-primary-container transition-all hover:bg-primary-container hover:text-on-primary-container"
          >
            Contact
          </a>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 items-center justify-center border border-white/20 text-on-surface lg:hidden"
          >
            <Icon name={open ? 'close' : 'menu'} size={18} />
          </button>
        </div>
      </div>

      <div className="relative h-[2px] w-full bg-white/5" aria-hidden="true">
        <div className="h-full bg-primary-container" style={{ width: `${progress}%` }} />
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-b border-white/10 bg-surface-container-lowest lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-margin md:px-margin-desktop">
            {links.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className={`border-b border-white/[0.08] py-3.5 font-label-lg uppercase tracking-wider ${
                  active === id ? 'text-primary-container' : 'text-on-surface'
                }`}
              >
                {label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
