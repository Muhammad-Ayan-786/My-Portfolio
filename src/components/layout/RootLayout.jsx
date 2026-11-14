import { useEffect, useLayoutEffect } from 'react'
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

  // Keep every ScrollTrigger honest: re-measure when the page height really changes
  // (late fonts, SplitText re-splits, lazy content) — otherwise scroll-linked effects
  // near the bottom, like the footer reveal, start late or not at all.
  useEffect(() => {
    let timer = 0
    let last = document.documentElement.scrollHeight
    const refresh = () => {
      clearTimeout(timer)
      timer = setTimeout(() => ScrollTrigger.refresh(), 180)
    }
    const ro = new ResizeObserver(() => {
      const h = document.documentElement.scrollHeight
      if (Math.abs(h - last) < 2) return
      last = h
      refresh()
    })
    ro.observe(document.body)
    document.fonts?.ready.then(refresh)
    return () => {
      clearTimeout(timer)
      ro.disconnect()
    }
  }, [])

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
