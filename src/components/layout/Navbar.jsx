import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { motion } from 'motion/react'
import { gsap, useGSAP } from '../../lib/gsap'
import { useApp } from '../../context/App'
import { useLenis } from '../../context/SmoothScroll'
import { navigation } from '../../data/navigation'
import { site } from '../../data/site'
import TransitionLink from '../ui/TransitionLink'
import Logo from '../ui/Logo'
import Button from '../ui/Button'
import ThemeToggle from './ThemeToggle'
import MobileMenu from './MobileMenu'

const isActive = (pathname, to) => (to === '/' ? pathname === '/' : pathname.startsWith(to))

export default function Navbar() {
  const { pathname } = useLocation()
  const { loaded } = useApp()
  const lenis = useLenis()
  const ref = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Intro once the preloader lifts
  useGSAP(
    () => {
      if (!loaded) {
        gsap.set('.nav-item', { yPercent: -160, autoAlpha: 0 })
        return
      }
      gsap.to('.nav-item', { yPercent: 0, autoAlpha: 1, duration: 1.3, stagger: 0.07, delay: 0.5, ease: 'expo.out' })
    },
    { scope: ref, dependencies: [loaded] },
  )

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    if (!lenis) return
    let hidden = false
    const onScroll = ({ scroll, direction }) => {
      setScrolled(scroll > 40)
      const shouldHide = direction === 1 && scroll > 320
      if (shouldHide !== hidden) {
        hidden = shouldHide
        gsap.to(ref.current, { yPercent: hidden ? -130 : 0, duration: 0.8, ease: 'expo.out' })
      }
    }
    lenis.on('scroll', onScroll)
    return () => lenis.off('scroll', onScroll)
  }, [lenis])

  // Close the mobile menu whenever the route changes (incl. back/forward)
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setMenuOpen(false)
  }

  return (
    <>
      <header ref={ref} className="fixed inset-x-0 top-0 z-[100]">
        <nav className="container-x flex h-[var(--nav-h)] items-center justify-between gap-4" aria-label="Main">
          {/* Brand */}
          <TransitionLink to="/" className="nav-item group flex items-center gap-3" aria-label={`${site.name} — home`}>
            <span className="grid size-11 place-items-center rounded-full border border-line bg-bg/60 backdrop-blur-md transition-transform duration-700 ease-expo group-hover:rotate-[360deg]">
              <Logo className="size-5 text-fg" />
            </span>
            <span className="type-label hidden sm:flex flex-col leading-tight">
              <span className="roll">
                <span data-text={site.role}>{site.name}</span>
              </span>
              <span className="text-muted">©{String(new Date().getFullYear()).slice(2)} — {site.location.short}</span>
            </span>
          </TransitionLink>

          {/* Desktop links */}
          <ul
            className={`nav-item absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-line p-1.5 backdrop-blur-md transition-colors duration-500 md:flex ${
              scrolled ? 'bg-bg/75' : 'bg-bg/40'
            }`}
          >
            {navigation.map((item, i) => {
              const active = isActive(pathname, item.to)
              return (
                <li key={item.to} className="relative">
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-fg"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <TransitionLink
                    to={item.to}
                    aria-current={active ? 'page' : undefined}
                    className={`type-label relative z-10 flex items-center gap-1.5 rounded-full px-4 py-2.5 transition-colors duration-300 ${
                      active ? 'text-bg' : 'text-fg hover:text-accent'
                    }`}
                  >
                    <span className="roll">
                      <span data-text={item.label}>{item.label}</span>
                    </span>
                    <sup className={`text-[0.55rem] ${active ? 'text-accent' : 'text-muted'}`}>0{i + 1}</sup>
                  </TransitionLink>
                </li>
              )
            })}
          </ul>

          {/* Right cluster */}
          <div className="flex items-center gap-3">
            <div className="nav-item">
              <ThemeToggle />
            </div>
            <div className="nav-item hidden md:block">
              <Button to="/contact" variant="solid">
                Let’s talk
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="nav-item relative z-[110] grid size-11 place-items-center rounded-full bg-fg text-bg md:hidden"
            >
              <span className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 h-[2px] w-full bg-current transition-all duration-500 ease-expo ${
                    menuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 h-[2px] w-full bg-current transition-all duration-500 ease-expo ${
                    menuOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0'
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
