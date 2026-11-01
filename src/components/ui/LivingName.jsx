import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/gsap'

const HOLD = 0.9 // seconds a flipped letter stays orange before rolling back

/**
 * Footer name: solid, heavy letters. Hovering a letter flips it split-flap
 * style into the orange serif italic, then it rolls back by itself — so
 * sliding the cursor across the name sends a wave of orange letters through it.
 * The word is fitted exactly to the container width.
 */
export default function LivingName({ text, className = '', letterClassName = '' }) {
  const wrap = useRef(null)
  const row = useRef(null)
  const letters = text.split('')

  useEffect(() => {
    const container = wrap.current
    const cells = [...row.current.children]
    const solids = cells.map((c) => c.querySelector('.ln-solid'))
    const serifs = cells.map((c) => c.querySelector('.ln-serif'))

    // Fit the word to the full container width
    const measure = () => {
      row.current.style.fontSize = '100px'
      row.current.style.fontSize = `${(100 * container.clientWidth) / row.current.scrollWidth}px`
    }
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    document.fonts?.ready.then(measure)
    measure()

    if (prefersReducedMotion()) return () => ro.disconnect()

    // The serif is wider than the condensed display face — narrow it so neighbours don't collide
    gsap.set(serifs, { yPercent: 105, rotate: 6, scaleX: 0.84, transformOrigin: '50% 100%' })

    const flipped = cells.map(() => false)
    const timers = cells.map(() => null)

    const flipBack = (i) => {
      flipped[i] = false
      gsap.to(solids[i], { yPercent: 0, rotate: 0, duration: 0.8, ease: 'expo.out', overwrite: 'auto' })
      gsap.to(serifs[i], { yPercent: 105, rotate: 6, duration: 0.8, ease: 'expo.out', overwrite: 'auto' })
    }

    const flip = (i) => {
      timers[i]?.kill()
      timers[i] = gsap.delayedCall(HOLD, () => flipBack(i))
      if (flipped[i]) return
      flipped[i] = true
      gsap.to(solids[i], { yPercent: -105, rotate: -6, duration: 0.7, ease: 'expo.out', overwrite: 'auto' })
      gsap.to(serifs[i], { yPercent: 0, rotate: 0, duration: 0.9, ease: 'elastic.out(1, 0.6)', overwrite: 'auto' })
    }

    const handlers = cells.map((cell, i) => {
      if (letters[i] === ' ') return null
      const h = () => flip(i)
      cell.addEventListener('pointerenter', h)
      return h
    })

    return () => {
      ro.disconnect()
      timers.forEach((t) => t?.kill())
      cells.forEach((c, i) => handlers[i] && c.removeEventListener('pointerenter', handlers[i]))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `letters` is derived from `text`
  }, [text])

  return (
    <div ref={wrap} className={`w-full ${className}`} aria-label={text}>
      <div ref={row} className="inline-flex whitespace-nowrap" aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            className="relative flex shrink-0 justify-center [clip-path:inset(0_-60%_0_-60%)]"
            data-cursor={ch === ' ' ? undefined : 'hide'}
          >
            <span className={`relative flex justify-center ${letterClassName}`}>
              <span className="ln-solid living-char inline-block whitespace-pre">{ch}</span>
              <span className="ln-serif type-serif absolute inset-x-0 bottom-0 text-center text-[1.02em] leading-[0.8] text-accent">
                {ch.trim() ? ch : ''}
              </span>
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
