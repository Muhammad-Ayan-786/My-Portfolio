import { useEffect, useRef, useState } from 'react'
import { gsap, isTouch, prefersReducedMotion } from '../../lib/gsap'

/**
 * Two-part cursor: a precise dot + a lagging ring.
 * Add data-cursor="view" | "open" | "drag" | any text to an element to make
 * the ring expand with that label. data-cursor="hide" hides the ring.
 */
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const text = useRef(null)
  const [enabled] = useState(() => !isTouch() && !prefersReducedMotion())

  useEffect(() => {
    if (!enabled) return
    const root = document.documentElement
    root.classList.add('has-cursor')

    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, autoAlpha: 0 })
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3' })

    let visible = false
    let mode = ''

    const setMode = (next, label = '') => {
      if (next === mode && text.current.textContent === label) return
      mode = next
      text.current.textContent = label
      const cfg = {
        // Size is animated with width/height (not scale) so the label text stays razor sharp
        '': { width: 40, height: 40, backgroundColor: 'rgba(0,0,0,0)', borderColor: 'var(--fg)', opacity: 1 },
        link: { width: 76, height: 76, backgroundColor: 'rgba(0,0,0,0)', borderColor: 'var(--accent)', opacity: 1 },
        label: { width: 104, height: 104, backgroundColor: 'var(--accent)', borderColor: 'var(--accent)', opacity: 1 },
        hide: { width: 16, height: 16, opacity: 0 },
        text: { width: 20, height: 20, opacity: 0.4 },
        dot: { width: 8, height: 8, opacity: 0 }, // ring collapses into the dot — pinpoint precision (scroll rail)
      }[next]
      gsap.to(ring.current, { ...cfg, duration: 0.6, ease: 'expo.out', overwrite: 'auto' })
      gsap.to(text.current, { autoAlpha: next === 'label' ? 1 : 0, duration: 0.3 })
      gsap.to(dot.current, { scale: next === 'label' || next === 'hide' ? 0 : 1, duration: 0.4 })
    }

    const onMove = (e) => {
      if (!visible) {
        visible = true
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY })
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 })
      }
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }

    const onOver = (e) => {
      const target = e.target.closest?.('[data-cursor], a, button, input, textarea, select, label')
      if (!target) return setMode('')
      const attr = target.getAttribute('data-cursor')
      if (attr === 'hide') return setMode('hide')
      if (attr === 'dot') return setMode('dot')
      if (attr) return setMode('label', attr)
      if (/INPUT|TEXTAREA|SELECT/.test(target.tagName)) return setMode('text')
      setMode('link')
    }

    const onLeave = () => {
      visible = false
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 })
    }
    const onDown = () => gsap.to(dot.current, { scale: 2.5, duration: 0.25 })
    const onUp = () => gsap.to(dot.current, { scale: mode === 'label' || mode === 'hide' ? 0 : 1, duration: 0.5 })

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200]">
      <div
        ref={ring}
        className="fixed left-0 top-0 flex size-10 items-center justify-center rounded-full border border-fg will-change-transform"
      >
        <span ref={text} className="type-label invisible whitespace-nowrap !text-[0.68rem] !font-semibold !tracking-[0.1em] text-on-accent antialiased" />
      </div>
      <div ref={dot} className="fixed left-0 top-0 size-1.5 rounded-full bg-accent will-change-transform" />
    </div>
  )
}
