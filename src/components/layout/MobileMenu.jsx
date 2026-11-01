import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import { gsap, useGSAP } from '../../lib/gsap'
import { useLenis } from '../../context/SmoothScroll'
import { navigation } from '../../data/navigation'
import { site } from '../../data/site'
import TransitionLink from '../ui/TransitionLink'
import LocalTime from '../ui/LocalTime'

/** Full-screen menu that grows out of the menu button as a circle. */
export default function MobileMenu({ open, onClose }) {
  const ref = useRef(null)
  const tl = useRef(null)
  const lenis = useLenis()
  const { pathname } = useLocation()

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .set(ref.current, { visibility: 'visible' })
        .fromTo(
          ref.current,
          { clipPath: 'circle(0% at calc(100% - 42px) 38px)' },
          { clipPath: 'circle(150% at calc(100% - 42px) 38px)', duration: 1, ease: 'expo.inOut' },
        )
        .from('.mm-link', { yPercent: 120, rotate: 6, duration: 1, stagger: 0.06, ease: 'expo.out' }, '-=0.45')
        .from('.mm-fade', { autoAlpha: 0, y: 20, duration: 0.8, stagger: 0.05 }, '<0.2')
    },
    { scope: ref },
  )

  useEffect(() => {
    if (!tl.current) return
    if (open) {
      lenis?.stop()
      tl.current.timeScale(1).play()
    } else {
      lenis?.start()
      tl.current.timeScale(1.6).reverse()
    }
  }, [open, lenis])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div
      id="mobile-menu"
      ref={ref}
      aria-hidden={!open}
      inert={!open}
      className="invisible fixed inset-0 z-[105] flex flex-col justify-between bg-surface px-[var(--gutter)] pb-8 pt-[calc(var(--nav-h)+2rem)] md:hidden"
    >
      <ul className="flex flex-col gap-1">
        {navigation.map((item, i) => (
          <li key={item.to} className="overflow-hidden">
            <TransitionLink
              to={item.to}
              onClick={onClose}
              className={`mm-link type-display flex items-start gap-3 text-[17vw] ${pathname === item.to ? 'text-accent' : 'text-fg'}`}
            >
              {item.label}
              <sup className="type-label mt-3 text-muted">0{i + 1}</sup>
            </TransitionLink>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-6">
        <a href={`mailto:${site.email}`} className="mm-fade type-serif text-2xl text-fg underline decoration-accent decoration-1 underline-offset-4">
          {site.email}
        </a>
        <div className="mm-fade flex flex-wrap gap-x-6 gap-y-2">
          {site.socials
            .filter((s) => !s.href.startsWith('mailto'))
            .map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="type-label text-fg">
                {s.label} ↗
              </a>
            ))}
        </div>
        <div className="mm-fade type-label flex justify-between text-muted">
          <span>{site.location.city}</span>
          <LocalTime />
        </div>
      </div>
    </div>
  )
}
