import { useRef } from 'react'
import { gsap, useGSAP, isTouch } from '../../lib/gsap'

/** Pulls its child towards the pointer and snaps back with an elastic ease. */
export default function Magnetic({ strength = 0.35, className = '', children }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const el = ref.current
      if (isTouch()) return
      const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3.out' })

      const move = (e) => {
        const r = el.getBoundingClientRect()
        xTo((e.clientX - (r.left + r.width / 2)) * strength)
        yTo((e.clientY - (r.top + r.height / 2)) * strength)
      }
      const leave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 1.2, ease: 'elastic.out(1, 0.35)', overwrite: true })
      }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      }
    },
    { scope: ref },
  )

  return (
    <span ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </span>
  )
}
