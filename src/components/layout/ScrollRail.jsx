import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { gsap, ScrollTrigger, isTouch, prefersReducedMotion } from '../../lib/gsap'
import { useLenis } from '../../context/SmoothScroll'

const MIN_THUMB = 34
const lerp = (a, b, t) => a + (b - a) * t
const clamp01 = (v) => Math.min(1, Math.max(0, v))

/**
 * The site's scrollbar — a floating "instrument" on the right edge (desktop only).
 *  • thumb stretches with scroll velocity and drags an accent ghost behind it
 *  • ticks are built automatically from every [data-rail-mark] (SectionLabel, hero, footer)
 *  • hover reveals the section names (click to jump), drag the thumb, or click the rail
 *  • a live readout shows % + the current section while scrolling
 */
export default function ScrollRail() {
  const lenis = useLenis()
  const { pathname } = useLocation()
  const [enabled] = useState(() => !isTouch())
  const [marks, setMarks] = useState([])
  const [current, setCurrent] = useState(-1)

  const root = useRef(null)
  const rail = useRef(null)
  const thumb = useRef(null)
  const ghost = useRef(null)
  const fill = useRef(null)
  const readout = useRef(null)
  const pct = useRef(null)
  const geo = useRef({ railH: 0, thumbH: MIN_THUMB, limit: 0 })
  const marksRef = useRef([])
  const dragging = useRef(false)

  // Hide the native scrollbar while the rail is mounted
  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-rail')
    return () => document.documentElement.classList.remove('has-rail')
  }, [enabled])

  // Measure section marks (re-run on route change, ScrollTrigger refresh and layout changes)
  useEffect(() => {
    if (!enabled || !lenis) return
    let raf = 0
    const measure = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const limit = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
        const seen = new Set()
        const list = []
        document.querySelectorAll('[data-rail-mark]').forEach((el) => {
          const box = el.closest('section, footer') || el
          if (seen.has(box)) return
          seen.add(box)
          const top = box.getBoundingClientRect().top + window.scrollY
          const label = el.getAttribute('data-rail-mark') || el.querySelector('[data-rail-label]')?.textContent || ''
          list.push({ pos: limit ? clamp01(top / limit) : 0, label: label.trim(), index: el.getAttribute('data-rail-index') || '' })
        })
        list.sort((a, b) => a.pos - b.pos)
        // The page header carries the page number — on the rail the top of the page is always 00
        if (list[0]?.pos < 0.02) list[0].index = '00'
        marksRef.current = list
        setMarks(list)
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    ScrollTrigger.addEventListener('refresh', measure)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      ScrollTrigger.removeEventListener('refresh', measure)
      window.removeEventListener('resize', measure)
    }
  }, [enabled, lenis, pathname])

  // Per-frame render loop
  useEffect(() => {
    if (!enabled || !lenis) return
    const reduced = prefersReducedMotion()
    const ty = gsap.quickTo(readout.current, 'y', { duration: 0.6, ease: 'power3.out' })
    let ghostY = 0
    let stretch = 1
    let lastIndex = -1
    let lastActive = 0
    let shown = false
    let lastPct = -1

    const tick = () => {
      const railH = rail.current.clientHeight
      const limit = lenis.limit
      const scrollable = limit > 40
      root.current.style.opacity = scrollable ? '' : '0'
      if (!scrollable) return

      const thumbH = Math.max(MIN_THUMB, Math.min(railH * 0.4, (railH * window.innerHeight) / (limit + window.innerHeight)))
      geo.current = { railH, thumbH, limit }
      const p = clamp01(lenis.scroll / limit)
      const travel = railH - thumbH
      const y = p * travel
      const v = lenis.velocity || 0

      // Velocity stretch + ghost trail
      stretch = lerp(stretch, reduced ? 1 : 1 + Math.min(Math.abs(v) / 28, 1.4), 0.18)
      ghostY = reduced ? y : lerp(ghostY, y, 0.075)
      rail.current.style.setProperty('--th', `${thumbH}px`)
      thumb.current.style.height = `${thumbH}px`
      thumb.current.style.transform = `translate3d(0,${y}px,0) scaleY(${stretch.toFixed(3)})`
      thumb.current.style.transformOrigin = v >= 0 ? '50% 100%' : '50% 0%'
      ghost.current.style.height = `${thumbH}px`
      ghost.current.style.transform = `translate3d(0,${ghostY}px,0)`
      ghost.current.style.opacity = Math.min(1, Math.abs(ghostY - y) / 40).toFixed(3)
      fill.current.style.transform = `scaleY(${((y + thumbH / 2) / railH).toFixed(4)})`

      // Readout follows the thumb
      ty(y + thumbH / 2)
      const n = Math.round(p * 100)
      if (n !== lastPct) {
        lastPct = n
        pct.current.textContent = String(n).padStart(3, '0')
      }

      // Current section
      const list = marksRef.current
      let idx = -1
      for (let i = 0; i < list.length; i++) if (list[i].pos <= p + 0.004) idx = i
      if (idx !== lastIndex) {
        lastIndex = idx
        setCurrent(idx)
      }

      // Wake while moving / dragging, sleep after a beat
      const now = performance.now()
      if (Math.abs(v) > 0.3 || dragging.current) lastActive = now
      const active = now - lastActive < 1100
      if (active !== shown) {
        shown = active
        root.current.toggleAttribute('data-active', active)
      }
    }

    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [enabled, lenis])

  if (!enabled) return null

  const toY = (clientY) => {
    const { railH, thumbH, limit } = geo.current
    const r = rail.current.getBoundingClientRect()
    return clamp01((clientY - r.top - thumbH / 2) / (railH - thumbH)) * limit
  }

  const onTrackDown = (e) => {
    if (e.button !== 0 || e.target.closest('[data-rail-tick]')) return
    e.preventDefault()
    const { railH, thumbH, limit } = geo.current
    const thumbTop = rail.current.getBoundingClientRect().top + (lenis.scroll / limit) * (railH - thumbH)
    const onThumb = e.clientY >= thumbTop - 6 && e.clientY <= thumbTop + thumbH + 6

    if (!onThumb) {
      lenis.scrollTo(toY(e.clientY), { duration: 1.4 })
      return
    }

    // Drag the thumb
    dragging.current = true
    document.documentElement.classList.add('rail-dragging')
    const startY = e.clientY
    const startScroll = lenis.scroll
    const move = (ev) => {
      const target = startScroll + ((ev.clientY - startY) / (railH - thumbH)) * limit
      lenis.scrollTo(Math.min(limit, Math.max(0, target)), { lerp: 0.25 })
    }
    const up = () => {
      dragging.current = false
      document.documentElement.classList.remove('rail-dragging')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const jump = (pos) => lenis?.scrollTo(pos * lenis.limit, { duration: 1.6 })

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="scroll-rail group/rail fixed right-0 top-1/2 z-[140] hidden h-[64svh] w-14 -translate-y-1/2 transition-opacity duration-500 md:block"
      onPointerDown={onTrackDown}
      data-cursor="dot"
    >
      <div ref={rail} className="absolute bottom-0 right-[18px] top-0 w-[3px]">
        {/* track + progress */}
        <span className="rail-track absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-fg/15" />
        <span ref={fill} className="absolute inset-x-0 left-1/2 top-0 h-full w-px -translate-x-1/2 origin-top bg-accent" />
        <span className="absolute -top-2 left-1/2 size-1 -translate-x-1/2 rounded-full bg-fg/40" />
        <span className="absolute -bottom-2 left-1/2 size-1 -translate-x-1/2 rounded-full bg-fg/40" />

        {/* section ticks */}
        {marks.map((m, i) => {
          const on = i === current
          return (
            <button
              key={`${m.label}-${i}`}
              type="button"
              tabIndex={-1}
              data-rail-tick
              data-cursor="dot"
              onClick={() => jump(m.pos)}
              className="group/tick absolute right-1/2 flex -translate-y-1/2 items-center gap-3 py-1.5 pl-6"
              style={{ top: `calc(${m.pos} * (100% - var(--th, ${MIN_THUMB}px)) + var(--th, ${MIN_THUMB}px) / 2)` }}
            >
              <span
                className="rail-label type-label pointer-events-none flex translate-x-3 items-center gap-2 whitespace-nowrap opacity-0 transition-all duration-500 ease-expo group-hover/rail:translate-x-0 group-hover/rail:opacity-100 group-hover/tick:text-accent"
                style={{ transitionDelay: `${i * 35}ms` }}
              >
                <span
                  className={`flex items-center gap-2 rounded-full border px-2.5 py-1 shadow-[0_6px_20px_-8px_rgb(0_0_0/0.45)] ${
                    on ? 'border-fg bg-fg text-bg' : 'border-line bg-bg text-fg'
                  }`}
                >
                  {m.index && <span className="text-accent">{m.index}</span>}
                  {m.label}
                </span>
              </span>
              <span
                className={`h-px shrink-0 transition-all duration-500 ease-expo group-hover/tick:w-6 group-hover/tick:bg-accent ${
                  on ? 'w-4 bg-accent' : 'w-2 bg-fg/40 group-hover/rail:w-3'
                }`}
              />
            </button>
          )
        })}

        {/* ghost + thumb */}
        <span ref={ghost} className="pointer-events-none absolute left-0 top-0 w-full rounded-full bg-accent/70 blur-[1px]" />
        <span
          ref={thumb}
          className="rail-thumb pointer-events-none absolute left-1/2 top-0 -ml-[1.5px] w-[3px] rounded-full bg-fg transition-[width,margin,background-color] duration-500 ease-expo group-hover/rail:-ml-[3px] group-hover/rail:w-[6px]"
        />

        {/* readout */}
        <div ref={readout} className="pointer-events-none absolute right-5 top-0 -translate-y-1/2">
          <div className="rail-readout type-label flex translate-x-2 items-center gap-2 whitespace-nowrap rounded-full bg-fg py-1.5 pl-2.5 pr-3 text-bg opacity-0 shadow-[0_8px_30px_-10px_rgb(0_0_0/0.5)] transition-all duration-500 ease-expo">
            <span ref={pct} className="tabular-nums text-accent">
              000
            </span>
            <span className="opacity-50">/</span>
            <span>{marks[current]?.label || 'Scroll'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
