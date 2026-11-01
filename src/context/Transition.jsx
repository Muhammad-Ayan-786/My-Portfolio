import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useLocation, useNavigate } from 'react-router'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'
import { useLenis } from './SmoothScroll'
import { session } from './App'
import { navigation } from '../data/navigation'
import { getProject } from '../data/projects'

const TransitionContext = createContext({ go: () => {} })

const labelFor = (path) => {
  const nav = navigation.find((n) => n.to === path)
  if (nav) return nav.label
  const slug = path.match(/^\/work\/([^/]+)/)?.[1]
  return (slug && getProject(slug)?.title) || 'Lost?'
}

/**
 * Page transitions: two coloured curtains sweep up and cover the screen,
 * the destination name types in, the route changes underneath, and the
 * curtains continue upward to reveal the new page.
 */
export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const lenis = useLenis()
  const overlay = useRef(null)
  const busy = useRef(false)
  const [label, setLabel] = useState('')

  const go = useCallback(
    async (to, name) => {
      const path = typeof to === 'string' ? to.split(/[?#]/)[0] : to.pathname
      if (busy.current) return
      if (path === pathname) {
        lenis?.scrollTo(0, { duration: 1.6 })
        return
      }
      session.navigated = true

      if (prefersReducedMotion()) {
        await navigate(to)
        return
      }

      busy.current = true
      flushSync(() => setLabel(name || labelFor(path)))
      const q = gsap.utils.selector(overlay)
      lenis?.stop()

      await gsap
        .timeline()
        .set(overlay.current, { visibility: 'visible' })
        .fromTo(
          q('.pt-layer'),
          { yPercent: 100, borderTopLeftRadius: '50% 18vh', borderTopRightRadius: '50% 18vh' },
          { yPercent: 0, borderTopLeftRadius: '50% 0vh', borderTopRightRadius: '50% 0vh', duration: 0.9, stagger: 0.1, ease: 'expo.inOut' },
        )
        .fromTo(q('.pt-char'), { yPercent: 115 }, { yPercent: 0, duration: 0.7, stagger: 0.03, ease: 'expo.out' }, '-=0.35')
        .fromTo(q('.pt-meta'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, '<')

      await navigate(to)
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
      ScrollTrigger.refresh()

      await gsap
        .timeline()
        .to(q('.pt-char'), { yPercent: -115, duration: 0.5, stagger: 0.02, ease: 'expo.in' })
        .to(q('.pt-meta'), { autoAlpha: 0, duration: 0.3 }, '<')
        .to(
          q('.pt-layer').reverse(),
          { yPercent: -100, borderBottomLeftRadius: '50% 18vh', borderBottomRightRadius: '50% 18vh', duration: 0.9, stagger: 0.1, ease: 'expo.inOut' },
          '-=0.15',
        )
        .set(overlay.current, { visibility: 'hidden' })
        .set(q('.pt-layer'), { clearProps: 'borderRadius' })

      lenis?.start()
      busy.current = false
    },
    [lenis, navigate, pathname],
  )

  return (
    <TransitionContext.Provider value={{ go }}>
      {children}
      <div ref={overlay} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[120] invisible">
        <div className="pt-layer absolute inset-0 bg-accent-2" />
        <div className="pt-layer absolute inset-0 bg-accent" />
        <div className="pt-layer absolute inset-0 flex flex-col items-center justify-center bg-ink text-bone">
          <span className="pt-meta type-label mb-6 text-bone/60">Loading — {new Date().getFullYear()}</span>
          <div className="type-display flex overflow-hidden pb-[0.06em] text-[clamp(3.5rem,13vw,13rem)]">
            {label.split('').map((ch, i) => (
              <span key={`${label}-${i}`} className="pt-char inline-block whitespace-pre">
                {ch}
              </span>
            ))}
            <span className="pt-char inline-block text-ember">.</span>
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  )
}

export const usePageTransition = () => useContext(TransitionContext)
