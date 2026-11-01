import { lazy, Suspense, useEffect, useRef } from 'react'
import { Check } from 'lucide-react'
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap'
import { useIntro } from '../../context/App'
import { site } from '../../data/site'
import { roadmap } from '../../data/roadmap'
import Button from '../../components/ui/Button'
import RevealText from '../../components/ui/RevealText'
import LocalTime from '../../components/ui/LocalTime'

const HeroScene = lazy(() => import('../../components/three/HeroScene'))

const Chars = ({ text }) =>
  text.split('').map((ch, i) => (
    <span key={i} data-ch={ch} className="hero-char paint-char inline-block will-change-transform">
      {ch}
    </span>
  ))

function StageIcon({ status }) {
  if (status === 'complete')
    return (
      <span className="grid size-4 place-items-center rounded-full bg-fg text-bg">
        <Check className="size-2.5" strokeWidth={3.5} />
      </span>
    )
  if (status === 'current')
    return (
      <span className="grid size-4 place-items-center">
        <span className="pulse-dot size-2 rounded-full bg-accent" />
      </span>
    )
  return <span className="size-4 rounded-full border border-dashed border-muted" />
}

export default function Hero() {
  const ref = useRef(null)
  const nameRef = useRef(null)
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

    let running = false
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) gsap.ticker.add(tick)
      if (!entry.isIntersecting && running) gsap.ticker.remove(tick)
      running = entry.isIntersecting
    })
    io.observe(h1)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      io.disconnect()
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
        .from('.hero-serif', { yPercent: 130, duration: 1.4, ease: 'expo.out' }, '<0.35')
        .from('.hero-canvas', { scale: 0.4, autoAlpha: 0, duration: 2.4, ease: 'expo.out' }, 0)
        .from('.hero-line', { scaleX: 0, duration: 1.6, ease: 'expo.inOut' }, 0.3)
        .from('.hero-fade', { autoAlpha: 0, y: 24, duration: 1.2, stagger: 0.07 }, 0.7)
    },
    { scope: ref, dependencies: [play] },
  )

  // Scroll parallax
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const st = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('.hero-row-1', { xPercent: -14, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-row-2', { xPercent: 10, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-canvas-wrap', { yPercent: 30, scale: 0.75, ease: 'none', scrollTrigger: st })
      // Only starts fading once you've genuinely scrolled away, so it's never half-visible at rest
      gsap.to('.hero-bottom', { yPercent: -40, autoAlpha: 0, ease: 'none', scrollTrigger: { ...st, start: '18% top', end: '60% top' } })
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[600px] overflow-hidden" aria-label="Introduction" data-rail-mark="Intro" data-rail-index="00">
      {/* 3D */}
      <div className="hero-canvas-wrap pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="hero-canvas relative aspect-square w-[125vw] max-w-none translate-y-[-6%] md:w-[min(66vw,92svh,980px)] md:translate-y-[-5%]">
          <div className="absolute inset-[18%] rounded-full bg-accent/25 blur-[90px]" />
          <Suspense fallback={null}>
            <HeroScene active={play} className="absolute inset-0" />
          </Suspense>
        </div>
      </div>

      <div className="container-x relative flex h-full flex-col justify-between pb-6 pt-[calc(var(--nav-h)+1.5rem)] md:pb-8">
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

        {/* Name */}
        <h1 ref={nameRef} className="type-display relative select-none text-[length:clamp(4.6rem,min(22vw,27svh),23rem)]" aria-label={`${site.name} — ${site.role}`}>
          <span className="hero-row-1 flex items-end overflow-hidden pb-[0.04em]" aria-hidden="true">
            <Chars text={site.firstName.toUpperCase()} />
            <span className="ml-[0.08em] mb-[0.12em] hidden overflow-hidden pb-1 text-[0.17em] leading-none sm:inline-block">
              <span className="hero-serif type-serif inline-block text-accent">
                full-stack
                <br />
                engineer
              </span>
            </span>
          </span>
          <span className="hero-row-2 flex items-end justify-end overflow-hidden pb-[0.04em] pr-[0.02em]" aria-hidden="true">
            <Chars text={site.lastName.toUpperCase()} />
            <span className="hero-char inline-block text-accent">.</span>
          </span>
        </h1>

        {/* Bottom */}
        <div className="hero-bottom">
          <div className="hero-line mb-5 h-px origin-left bg-line" />
          <div className="grid items-end gap-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="hero-serif-mobile type-serif mb-3 text-2xl text-accent sm:hidden">full-stack engineer</p>
              <RevealText as="p" scroll={false} play={play} delay={delay + 0.6} className="max-w-[38ch] text-base leading-relaxed text-fg/85 md:text-lg">
                {site.tagline}
              </RevealText>
            </div>

            <ol className="flex flex-wrap gap-x-5 gap-y-2 md:col-span-4 md:justify-center" aria-label="Full-stack path">
              {roadmap.map((stage) => (
                <li key={stage.id} className={`hero-fade type-label flex items-center gap-2 ${stage.status === 'next' ? 'text-muted' : 'text-fg'}`}>
                  <StageIcon status={stage.status} />
                  {stage.title}
                </li>
              ))}
            </ol>

            <div className="flex items-center gap-3 md:col-span-3 md:justify-end">
              <span className="hero-fade">
                <Button to="/work" variant="solid">
                  View work
                </Button>
              </span>
              {site.resume && (
                <span className="hero-fade">
                  <Button href={site.resume} variant="outline" target="_blank" rel="noreferrer" icon={false}>
                    Résumé
                  </Button>
                </span>
              )}
            </div>
          </div>

          <div className="hero-fade type-label mt-5 hidden items-center justify-between text-muted md:flex">
            <span className="flex items-center gap-2">
              <span className="pulse-dot size-1.5 rounded-full bg-accent" />
              {site.availability.label}
            </span>
            <span className="flex items-center gap-3">
              Scroll to explore
              <span className="relative h-8 w-px overflow-hidden bg-line">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_var(--ease-in-out-quart)_infinite] bg-fg" />
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
