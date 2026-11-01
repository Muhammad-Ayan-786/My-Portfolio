import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../../lib/gsap'

/**
 * Infinite marquee that speeds up and flips direction with scroll velocity.
 * `reverse` makes it travel left-to-right by default.
 */
export default function Marquee({ items, reverse = false, speed = 40, className = '', renderItem }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const track = ref.current.querySelector('.mq-track')
      const dir = reverse ? 1 : -1
      const tween = gsap.fromTo(
        track,
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, duration: speed, ease: 'none', repeat: -1 },
      )

      let current = 1
      const trigger = ScrollTrigger.create({
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate(self) {
          const v = self.getVelocity() / 220
          const boost = gsap.utils.clamp(-6, 6, v) * -dir
          current = self.direction === 1 ? 1 : -1
          gsap.to(tween, { timeScale: (1 + Math.abs(boost)) * current, duration: 0.3, overwrite: true })
          gsap.to(tween, { timeScale: current, duration: 1.2, delay: 0.3 })
        },
      })
      return () => trigger.kill()
    },
    { scope: ref, dependencies: [items.length] },
  )

  const row = items.map((item, i) => (
    <span key={i} className="flex shrink-0 items-center">
      {renderItem ? renderItem(item, i) : item}
    </span>
  ))

  return (
    <div ref={ref} className={`overflow-hidden ${className}`} aria-label={items.join(', ')}>
      <div className="mq-track flex w-max will-change-transform" aria-hidden="true">
        <div className="flex shrink-0">{row}</div>
        <div className="flex shrink-0">{row}</div>
      </div>
    </div>
  )
}
