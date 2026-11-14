import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../../lib/gsap'
import { useIntro } from '../../context/App'
import { site } from '../../data/site'
import LocalTime from '../../components/ui/LocalTime'
import Character from '../../components/hero/Character'

const Chars = ({ text }) =>
  text.split('').map((ch, i) => (
    <span key={i} data-ch={ch} className="hero-char paint-char inline-block will-change-transform">
      {ch}
    </span>
  ))

/**
 * The hero is a fixed stage: it sticks to the viewport while the rest of the page
 * (.home-sheet in pages/Home.jsx) slides up over it. Only the name, the character and
 * the essentials live here — tagline, path and buttons sit at the top of the sheet (IntroDock).
 */
export default function Hero() {
  const ref = useRef(null)
  const nameRef = useRef(null)
  const coveredRef = useRef(false)
  const [covered, setCovered] = useState(false) // true once the sheet hides the hero completely
  const { play, delay } = useIntro()

  // "Paint" spotlight: the cursor reveals a gradient inside the solid letters.
  // When the cursor is elsewhere (or on touch screens) the light drifts across the name by itself.
  useEffect(() => {
    if (prefersReducedMotion()) return
    const h1 = nameRef.current
    const chars = [...h1.querySelectorAll('.paint-char')]
    const pointer = { x: 0, y: 0, inside: false }
    const light = { x: -9999, y: -9999, r: 0 }

    const onMove = (e) => {
      const b = h1.getBoundingClientRect()
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.inside = e.clientX > b.left - 80 && e.clientX < b.right + 80 && e.clientY > b.top - 80 && e.clientY < b.bottom + 80
    }

    const tick = (time) => {
      if (coveredRef.current) return
      const b = h1.getBoundingClientRect()
      const size = parseFloat(getComputedStyle(h1).fontSize)
      const tx = pointer.inside ? pointer.x : b.left + b.width * (0.5 + 0.45 * Math.sin(time * 0.32))
      const ty = pointer.inside ? pointer.y : b.top + b.height * (0.5 + 0.32 * Math.sin(time * 0.57 + 1))
      if (light.x < -999) Object.assign(light, { x: tx, y: ty })
      const ease = pointer.inside ? 0.2 : 0.035
      light.x += (tx - light.x) * ease
      light.y += (ty - light.y) * ease
      light.r += ((pointer.inside ? 0.62 : 0.48) * size - light.r) * 0.08

      // read all rects first, then write — avoids layout thrashing
      const rects = chars.map((c) => c.getBoundingClientRect())
      h1.style.setProperty('--pr', `${light.r.toFixed(1)}px`)
      chars.forEach((c, i) => {
        c.style.setProperty('--px', `${(light.x - rects[i].left).toFixed(1)}px`)
        c.style.setProperty('--py', `${(light.y - rects[i].top).toFixed(1)}px`)
      })
    }

    gsap.ticker.add(tick)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  // Intro — runs when the preloader lifts
  useGSAP(
    () => {
      if (!play || prefersReducedMotion()) return
      gsap
        .timeline({ delay })
        .from('.hero-char', { yPercent: 118, rotate: 6, duration: 1.7, stagger: 0.05, ease: 'expo.out' })
        .from('.hero-canvas', { yPercent: 45, autoAlpha: 0, duration: 1.8, ease: 'expo.out' }, 0.2)
        .from('.hero-line', { scaleX: 0, duration: 1.6, ease: 'expo.inOut' }, 0.3)
        .from('.hero-fade', { autoAlpha: 0, y: 24, duration: 1.2, stagger: 0.07 }, 0.7)
    },
    { scope: ref, dependencies: [play] },
  )

  // The sheet slides over: the stage sinks back, dims, and switches off once fully covered
  useGSAP(
    () => {
      const sheet = document.querySelector('.home-sheet')
      if (!sheet) return
      const cover = (v) => {
        coveredRef.current = v
        setCovered(v)
      }
      const st = { trigger: sheet, start: 'top bottom', end: 'top top', scrub: true }
      if (!prefersReducedMotion()) {
        gsap.to('.hero-row-1', { xPercent: -10, ease: 'none', scrollTrigger: st })
        gsap.to('.hero-row-2', { xPercent: 8, ease: 'none', scrollTrigger: st })
        gsap.to('.hero-stage', { scale: 0.9, yPercent: -4, ease: 'none', scrollTrigger: st })
        gsap.to('.hero-canvas-wrap', { yPercent: 6, ease: 'none', scrollTrigger: st })
        gsap.to('.hero-dim', { opacity: 0.6, ease: 'none', scrollTrigger: st })
      }
      ScrollTrigger.create({ trigger: sheet, start: 'top bottom', end: 'top top', onLeave: () => cover(true), onEnterBack: () => cover(false) })
    },
    { scope: ref },
  )

  return (
    <>
      {/* ScrollRail marker — the section below is sticky, so it can't be measured itself */}
      <span data-rail-mark="Intro" data-rail-index="00" aria-hidden="true" className="block h-0" />

      <section
        ref={ref}
        aria-label="Introduction"
        className={`sticky top-0 z-0 h-[100svh] min-h-[600px] overflow-hidden ${covered ? 'invisible' : ''}`}
      >
        <div className="hero-stage relative h-full origin-top">
          <div className="container-x relative flex h-full flex-col justify-between pb-6 pt-[calc(var(--nav-h)+1.5rem)] max-md:z-10 md:pb-8">
            {/* Meta row */}
            <div className="type-label grid grid-cols-2 gap-4 text-muted md:grid-cols-3">
              <span className="hero-fade">(Portfolio — {new Date().getFullYear()})</span>
              <span className="hero-fade hidden text-center md:block">
                Currently → <span className="text-fg">{site.currently}</span>
              </span>
              <span className="hero-fade text-right">
                <LocalTime /> · {site.location.short}
              </span>
            </div>

            {/* Name — split to frame the character: first name top-left, last name bottom-right */}
            <h1
              ref={nameRef}
              className="type-display relative flex flex-1 select-none flex-col justify-between py-[3svh] text-[length:clamp(4.6rem,min(22vw,25svh),23rem)]"
              aria-label={`${site.name} — ${site.role}`}
            >
              <span className="hero-row-1 flex items-end overflow-hidden pb-[0.04em]" aria-hidden="true">
                <Chars text={site.firstName.toUpperCase()} />
              </span>
              <span className="hero-row-2 flex items-end justify-end overflow-hidden pb-[0.04em] pr-[0.02em]" aria-hidden="true">
                <Chars text={site.lastName.toUpperCase()} />
                <span className="hero-char inline-block text-accent">.</span>
              </span>
            </h1>

            {/* Bottom */}
            <div>
              <div className="hero-line mb-5 h-px origin-left bg-line" />
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="hero-fade type-serif text-[clamp(1.7rem,3vw,2.9rem)] leading-none text-accent">{site.role.toLowerCase()}</p>
                  <p className="hero-fade type-label mt-3 flex items-center gap-2 text-muted">
                    <span className="pulse-dot size-1.5 rounded-full bg-accent" />
                    {site.availability.label}
                  </p>
                </div>
                <span className="hero-fade type-label flex shrink-0 items-center gap-3 text-muted">
                  <span className="hidden sm:inline">Scroll to explore</span>
                  <span className="relative h-8 w-px overflow-hidden bg-line">
                    <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_var(--ease-in-out-quart)_infinite] bg-fg" />
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* The character — stands at the bottom edge; in front of the name on desktop, behind the text on phones */}
          <div className="hero-canvas-wrap pointer-events-none absolute inset-0 flex items-end justify-center">
            <div className="hero-canvas relative h-[70svh] shrink-0 md:h-[90svh]">
              <div className="absolute inset-x-[4%] top-[10%] aspect-square rounded-full bg-accent/20 blur-[110px]" />
              <Character active={play && !covered} className="h-full" />
            </div>
            {/* phones: the text sits over him, so fade his sweater into the page behind it */}
            <div className="absolute inset-x-0 bottom-0 h-[36svh] bg-gradient-to-t from-bg via-bg/85 to-transparent md:hidden" />
          </div>
        </div>

        <div className="hero-dim pointer-events-none absolute inset-0 bg-ink opacity-0" />
      </section>
    </>
  )
}
