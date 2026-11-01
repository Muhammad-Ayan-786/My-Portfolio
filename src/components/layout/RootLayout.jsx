import { useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { ScrollTrigger } from '../../lib/gsap'
import { useLenis } from '../../context/SmoothScroll'
import { TransitionProvider } from '../../context/Transition'
import Preloader from './Preloader'
import Cursor from './Cursor'
import ScrollRail from './ScrollRail'
import Navbar from './Navbar'
import Footer from './Footer'

/** Reset scroll on every route change and re-measure ScrollTriggers. */
function ScrollReset() {
  const { pathname } = useLocation()
  const lenis = useLenis()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    lenis?.scrollTo(0, { immediate: true, force: true })
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [pathname, lenis])

  return null
}

export default function RootLayout() {
  return (
    <TransitionProvider>
      <a
        href="#main"
        className="type-label fixed left-4 top-4 z-[300] -translate-y-24 rounded-full bg-accent px-4 py-2 text-on-accent focus:translate-y-0"
      >
        Skip to content
      </a>
      <ScrollReset />
      <Preloader />
      <Cursor />
      <ScrollRail />
      <Navbar />
      <main id="main" className="relative z-[1] bg-bg">
        <Outlet />
      </main>
      <Footer />
      <div className="grain" aria-hidden="true" />
    </TransitionProvider>
  )
}
