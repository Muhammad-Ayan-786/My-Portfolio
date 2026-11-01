import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap'

/**
 * Fades + lifts its direct children (or elements marked [data-reveal])
 * into view with a stagger when scrolled into the viewport.
 */
export default function Reveal({ as: Tag = 'div', y = 60, stagger = 0.08, delay = 0, start = 'top 88%', className = '', children, ...rest }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const marked = ref.current.querySelectorAll('[data-reveal]')
      const targets = marked.length ? marked : ref.current.children
      gsap.from(targets, {
        y,
        // opacity (not autoAlpha) so hidden content stays keyboard-focusable
        opacity: 0,
        duration: 1.3,
        delay,
        stagger,
        ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start, once: true },
      })
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}
