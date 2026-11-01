import { createContext, useContext, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'

const LenisContext = createContext(null)

/** Lenis smooth scrolling, driven by the GSAP ticker so ScrollTrigger stays in sync. */
export function SmoothScrollProvider({ children }) {
  const [lenis, setLenis] = useState(null)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

    const instance = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 1,
      smoothWheel: !prefersReducedMotion(),
      autoRaf: false,
    })

    instance.on('scroll', ScrollTrigger.update)
    const raf = (time) => instance.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // eslint-disable-next-line react-hooks/set-state-in-effect -- Lenis is an external system created on mount
    setLenis(instance)
    return () => {
      gsap.ticker.remove(raf)
      instance.destroy()
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

export const useLenis = () => useContext(LenisContext)
