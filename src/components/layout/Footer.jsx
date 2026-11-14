import { useRef } from 'react'
import { useLocation } from 'react-router'
import { ArrowUp } from 'lucide-react'
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap'
import { useLenis } from '../../context/SmoothScroll'
import { navigation } from '../../data/navigation'
import { site } from '../../data/site'
import TransitionLink from '../ui/TransitionLink'
import LocalTime from '../ui/LocalTime'
import Magnetic from '../ui/Magnetic'
import RevealText from '../ui/RevealText'
import LivingName from '../ui/LivingName'

export default function Footer() {
  const ref = useRef(null)
  const lenis = useLenis()
  const { pathname } = useLocation()
  const name = `${site.firstName} ${site.lastName}`.toUpperCase()

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      // Parallax "reveal from underneath"
      gsap.fromTo(
        '.ft-inner',
        { yPercent: -35 },
        {
          yPercent: 0,
          ease: 'none',
          // refreshPriority -1: measured after every pinned section above has added its scroll space
          scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom bottom', scrub: true, refreshPriority: -1 },
        },
      )
      gsap.from('.ft-letter', {
        yPercent: 100,
        duration: 1.4,
        stagger: 0.04,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.ft-name', start: 'top 95%', once: true },
      })
    },
    { scope: ref, dependencies: [pathname], revertOnUpdate: true },
  )

  return (
    <footer ref={ref} data-rail-mark="Fin" className="relative overflow-hidden bg-fg text-bg">
      <div className="ft-inner container-x flex flex-col gap-16 pt-24 md:pt-32">
        {pathname !== '/contact' && (
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <RevealText as="h2" type="words" className="type-display max-w-[14ch] text-[clamp(3rem,8vw,8.5rem)]">
              Have an idea? <span className="type-serif text-accent">Let’s build it.</span>
            </RevealText>
            <Magnetic strength={0.3}>
              <TransitionLink
                to="/contact"
                data-cursor="Say hi"
                className="group relative grid size-40 place-items-center rounded-full bg-accent text-on-accent md:size-52"
              >
                <svg viewBox="0 0 200 200" className="animate-spin-slow absolute inset-0 size-full" aria-hidden="true">
                  <defs>
                    <path id="ft-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
                  </defs>
                  <text className="type-label" fill="currentColor" fontSize="13" letterSpacing="5">
                    <textPath href="#ft-circle">START A PROJECT • START A PROJECT • START A PROJECT •</textPath>
                  </text>
                </svg>
                <span className="type-display text-3xl transition-transform duration-700 ease-expo group-hover:scale-110">Hi!</span>
              </TransitionLink>
            </Magnetic>
          </div>
        )}

        <div className="grid grid-cols-2 gap-10 border-t border-bg/15 pt-10 md:grid-cols-4">
          <div>
            <p className="type-label mb-5 opacity-50">Menu</p>
            <ul className="flex flex-col gap-2">
              {navigation.map((item) => (
                <li key={item.to}>
                  <TransitionLink to={item.to} className="roll text-lg font-medium hover:text-accent">
                    <span data-text={item.label}>{item.label}</span>
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="type-label mb-5 opacity-50">Socials</p>
            <ul className="flex flex-col gap-2">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="roll text-lg font-medium hover:text-accent">
                    <span data-text={`${s.label} ↗`}>{s.label} ↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="type-label mb-5 opacity-50">Based in</p>
            <p className="text-lg font-medium">
              {site.location.city},
              <br />
              {site.location.country}
            </p>
            <LocalTime seconds className="type-label mt-3 block opacity-60" />
          </div>
          <div>
            <p className="type-label mb-5 opacity-50">Status</p>
            <p className="flex items-center gap-2 text-lg font-medium">
              <span className="pulse-dot size-2 rounded-full bg-accent" />
              {site.availability.open ? 'Open to work' : 'Busy building'}
            </p>
            <p className="mt-3 text-sm opacity-60">Currently exploring {site.currently}.</p>
          </div>
        </div>

        {/* Living type — weight follows the cursor, gradient flows through */}
        <LivingName text={name} className="ft-name -mb-[0.04em] pt-[0.1em]" letterClassName="ft-letter" />
      </div>

      <div className="container-x type-label relative flex flex-wrap items-center justify-between gap-4 border-t border-bg/15 py-5">
        <span className="opacity-60">© {new Date().getFullYear()} {site.fullName}</span>
        <span className="hidden opacity-60 md:inline">Designed & engineered from scratch</span>
        <button
          type="button"
          onClick={() => lenis?.scrollTo(0, { duration: 2.2 })}
          className="group flex items-center gap-2 hover:text-accent"
        >
          Back to top
          <ArrowUp className="size-4 transition-transform duration-500 ease-expo group-hover:-translate-y-1" />
        </button>
      </div>
    </footer>
  )
}
