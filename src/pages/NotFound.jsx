import { useRef } from 'react'
import { gsap, useGSAP, isTouch } from '../lib/gsap'
import { site } from '../data/site'
import Button from '../components/ui/Button'

/** 404 — the digits drift away from the pointer. */
export default function NotFound() {
  const ref = useRef(null)

  useGSAP(
    () => {
      gsap.from('.nf-digit', { yPercent: 120, rotate: 12, stagger: 0.08, duration: 1.6, delay: 0.3 })
      gsap.from('.nf-fade', { autoAlpha: 0, y: 30, stagger: 0.08, delay: 0.8 })
      if (isTouch()) return
      const digits = gsap.utils.toArray('.nf-digit')
      const onMove = (e) => {
        digits.forEach((d, i) => {
          const r = d.getBoundingClientRect()
          const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth
          const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight
          gsap.to(d, { x: -dx * 80 * (i + 1), y: -dy * 60, rotate: dx * 10, duration: 1.2, ease: 'power3.out' })
        })
      }
      window.addEventListener('pointermove', onMove)
      return () => window.removeEventListener('pointermove', onMove)
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="container-x flex min-h-[100svh] flex-col items-center justify-center pb-16 pt-[var(--nav-h)] text-center">
      <title>{`Lost — ${site.name}`}</title>
      <p className="nf-fade type-label text-muted">Error 404 — page not found</p>
      <h1 className="type-display mt-6 flex overflow-hidden text-[clamp(9rem,38vw,34rem)] leading-[0.8]" aria-label="404">
        <span className="nf-digit inline-block">4</span>
        <span className="nf-digit type-serif inline-block text-accent">0</span>
        <span className="nf-digit text-stroke inline-block">4</span>
      </h1>
      <p className="nf-fade type-serif mt-6 text-[clamp(1.8rem,4vw,3.4rem)]">Lost somewhere in the stack.</p>
      <div className="nf-fade mt-10">
        <Button to="/">Take me home</Button>
      </div>
    </section>
  )
}
