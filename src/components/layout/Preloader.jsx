import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/gsap'
import { useApp } from '../../context/App'
import { useLenis } from '../../context/SmoothScroll'
import { roadmap } from '../../data/roadmap'
import { site } from '../../data/site'
import Logo from '../ui/Logo'

const COLUMNS = 6
const WORDS = [...roadmap.map((r) => r.title), 'Full-Stack']
const VISITED_KEY = 'ma-visited'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const windowLoaded = () =>
  document.readyState === 'complete' ? Promise.resolve() : new Promise((r) => window.addEventListener('load', r, { once: true }))

const hasVisited = () => {
  try {
    return sessionStorage.getItem(VISITED_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * The first impression.
 * 1. Interface slides in from behind masks.
 * 2. An odometer counts to 100 in uneven bursts (waits for fonts + assets),
 *    while the word roller walks the path: Frontend → Backend → Gen AI → DevOps
 *    and lands on "Full-Stack".
 * 3. Everything slides out, then six ink columns and six accent columns lift
 *    in a staggered wave to reveal the site — the hero animates in underneath.
 * Repeat visits in the same session get a ~1s express version.
 */
export default function Preloader() {
  const { setLoaded } = useApp()
  const lenis = useLenis()
  const lenisRef = useRef(lenis)
  const root = useRef(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    lenisRef.current = lenis
    if (!done) lenis?.stop()
  }, [lenis, done])

  useEffect(() => {
    document.getElementById('boot')?.remove()
    const html = document.documentElement
    html.style.overflow = 'hidden'

    let cancelled = false
    const ctx = gsap.context(() => {}, root)
    const q = gsap.utils.selector(root)

    const finish = () => {
      html.style.overflow = ''
      lenisRef.current?.start()
      setLoaded(true)
      try {
        sessionStorage.setItem(VISITED_KEY, '1')
      } catch {
        /* ignore */
      }
    }

    if (prefersReducedMotion()) {
      ctx.add(() => {
        gsap.to(root.current, { autoAlpha: 0, duration: 0.4, delay: 0.3, onStart: finish, onComplete: () => setDone(true) })
      })
      return () => ctx.revert()
    }

    const fast = hasVisited()
    const digits = q('.pl-digit')
    const hundreds = q('.pl-hundreds')[0]
    const bar = q('.pl-bar')[0]
    const list = q('.pl-words')[0]
    const stages = q('.pl-stage')
    const glow = q('.pl-glow')[0]
    const counter = { v: 0 }
    let lastWord = 0

    const render = () => {
      const v = Math.round(counter.v)
      const s = String(v).padStart(3, '0')
      digits.forEach((col, i) => (col.style.transform = `translateY(${-Number(s[i]) * 10}%)`))
      hundreds.style.opacity = v >= 100 ? 1 : 0.18
      bar.style.transform = `scaleX(${v / 100})`
      glow.style.transform = `translate(25%, 35%) scale(${0.4 + v / 140})`
      glow.style.opacity = 0.25 + v / 160
      stages.forEach((el, i) => (el.dataset.on = String(v >= (i + 1) * 25 - 1)))
      const w = v >= 100 ? WORDS.length - 1 : Math.min(WORDS.length - 2, Math.floor(v / 25))
      if (w !== lastWord) {
        lastWord = w
        gsap.to(list, { yPercent: (-w * 100) / WORDS.length, duration: 0.8, ease: 'expo.out', overwrite: true })
      }
    }

    const assets = Promise.race([Promise.all([document.fonts?.ready, windowLoaded()]), wait(4500)])

    const run = async () => {
      // 1 — intro (counting starts while it is still settling)
      ctx.add(() =>
        gsap
          .timeline({ defaults: { ease: 'expo.out' } })
          .from(q('.pl-in'), { yPercent: 115, duration: fast ? 0.7 : 1.2, stagger: 0.04 })
          .from(q('.pl-fade'), { autoAlpha: 0, duration: 0.8, stagger: 0.05 }, '<0.1')
          .from(q('.pl-track'), { scaleX: 0, duration: 1, ease: 'expo.inOut' }, '<'),
      )
      await wait(fast ? 250 : 550)
      if (cancelled) return

      // 2 — count in bursts
      const steps = fast ? [[86, 0.5]] : [[24, 0.55], [49, 0.5], [74, 0.55], [92, 0.45]]
      for (const [to, d] of steps) {
        await ctx.add(() => gsap.to(counter, { v: to, duration: d, ease: 'power3.inOut', onUpdate: render }))
        if (cancelled) return
        if (!fast) await wait(90)
      }
      await assets
      if (cancelled) return
      await ctx.add(() => gsap.to(counter, { v: 100, duration: fast ? 0.35 : 0.6, ease: 'power3.out', onUpdate: render }))
      await wait(fast ? 150 : 300)
      if (cancelled) return

      // 3 — exit wave
      ctx.add(() =>
        gsap
          .timeline({ onComplete: () => setDone(true) })
          .to(q('.pl-in'), { yPercent: -115, duration: 0.6, stagger: 0.02, ease: 'expo.in' })
          .to(q('.pl-fade'), { autoAlpha: 0, duration: 0.4 }, '<')
          .to(glow, { scale: 4, autoAlpha: 0, duration: 0.9, ease: 'expo.in' }, '<')
          .add(finish, '-=0.3')
          .to(q('.pl-col'), { yPercent: -100, duration: 1.05, stagger: { each: 0.045, from: 'start' }, ease: 'expo.inOut' }, '<')
          .to(q('.pl-col-accent'), { yPercent: -100, duration: 1.05, stagger: { each: 0.045, from: 'start' }, ease: 'expo.inOut' }, '<0.12'),
      )
    }
    run()

    return () => {
      cancelled = true
      ctx.revert()
      html.style.overflow = ''
    }
  }, [setLoaded])

  if (done) return null

  const cols = Array.from({ length: COLUMNS })

  return (
    <div ref={root} className="fixed inset-0 z-[150] text-bone" role="status" aria-live="polite" aria-label="Loading portfolio">
      {/* Curtain columns */}
      <div className="absolute inset-0 flex">
        {cols.map((_, i) => (
          <div key={i} className="pl-col-accent -mx-px h-full flex-1 bg-accent" />
        ))}
      </div>
      <div className="absolute inset-0 flex">
        {cols.map((_, i) => (
          <div key={i} className="pl-col -mx-px h-full flex-1 bg-ink" />
        ))}
      </div>

      {/* Content */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="pl-glow pointer-events-none absolute bottom-0 right-0 size-[80vmax] rounded-full opacity-0 blur-3xl [background:radial-gradient(circle,var(--c-ember)_0%,var(--c-violet)_35%,transparent_68%)]" />

        <div className="relative flex h-full flex-col justify-between px-[var(--gutter)] py-6 md:py-8">
          {/* Top bar */}
          <div className="type-label flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="pl-in inline-flex items-center gap-3">
                <Logo className="w-8 text-bone" />
                {site.name}
              </span>
            </div>
            <div className="hidden overflow-hidden md:block">
              <span className="pl-in inline-block text-bone/60">{site.role}</span>
            </div>
            <div className="overflow-hidden text-right">
              <span className="pl-in inline-block text-bone/60">Portfolio ©{new Date().getFullYear()}</span>
            </div>
          </div>

          {/* Word roller */}
          <div>
            <div className="mb-4 overflow-hidden">
              <span className="pl-in type-label inline-block text-bone/50">( Loading the stack )</span>
            </div>
            <div className="type-display h-[1em] overflow-hidden text-[clamp(3.4rem,12vw,12.5rem)] leading-none">
              <div className="pl-in">
                <div className="pl-words">
                  {WORDS.map((w, i) => (
                    <div key={w} className={`h-[1em] whitespace-nowrap leading-none ${i === WORDS.length - 1 ? 'type-serif text-ember' : ''}`}>
                      {w}
                      {i === WORDS.length - 1 ? '.' : ''}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: stages + counter */}
          <div className="flex flex-col-reverse gap-8 md:flex-row md:items-end md:justify-between">
            <ol className="grid grid-cols-2 gap-x-8 gap-y-3 sm:flex sm:gap-8">
              {roadmap.map((stage) => (
                <li key={stage.id} className="overflow-hidden">
                  <span
                    data-on="false"
                    className="pl-stage pl-in type-label group/s flex items-center gap-2 text-bone/35 transition-colors duration-500 data-[on=true]:text-bone"
                  >
                    <span className="size-1.5 rounded-full border border-current transition-all duration-500 group-data-[on=true]/s:border-ember group-data-[on=true]/s:bg-ember" />
                    {stage.index} {stage.title}
                  </span>
                </li>
              ))}
            </ol>

            <div className="type-display flex items-start self-end overflow-hidden text-[clamp(6rem,21vw,19rem)] leading-none tabular-nums">
              {[0, 1, 2].map((i) => (
                <span key={i} className={`pl-in relative inline-block h-[1em] overflow-hidden ${i === 0 ? 'pl-hundreds' : ''}`}>
                  <span className="pl-digit block transition-transform duration-500 ease-expo">
                    {Array.from({ length: 10 }, (_, d) => (
                      <span key={d} className="block h-[1em] text-center">
                        {d}
                      </span>
                    ))}
                  </span>
                </span>
              ))}
              <span className="pl-in type-serif mt-[0.12em] inline-block text-[0.22em] text-ember">%</span>
            </div>
          </div>
        </div>

        {/* Progress hairline */}
        <div className="pl-track absolute inset-x-0 bottom-0 h-[3px] origin-left bg-bone/10">
          <div className="pl-bar h-full origin-left scale-x-0 bg-ember" />
        </div>
      </div>
    </div>
  )
}
