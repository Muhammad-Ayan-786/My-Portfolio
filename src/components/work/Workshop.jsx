import { useRef } from 'react'
import { Check } from 'lucide-react'
import { gsap, useGSAP, isTouch, prefersReducedMotion } from '../../lib/gsap'
import { workshop } from '../../data/clients'

const FACES = ['front', 'back', 'left', 'right', 'top', 'bottom']

/** CSS-3D cube: six faces, sized by --s (see .wire-cube in index.css). */
function Cube({ className = '' }) {
  return (
    <div className={`wire-cube ${className}`} aria-hidden="true">
      {FACES.map((f) => (
        <span key={f} className={`face face-${f}`} />
      ))}
    </div>
  )
}

/**
 * "In the workshop" — the build that isn't live yet (47Home).
 * Always ink-dark, blueprint grid, a wireframe room spinning in real 3D
 * that leans toward the cursor.
 */
export default function Workshop({ className = '' }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      if (!workshop || isTouch() || prefersReducedMotion()) return
      const stage = ref.current.querySelector('.ws-stage')
      const rx = gsap.quickTo(stage, 'rotateX', { duration: 1.2, ease: 'power3' })
      const ry = gsap.quickTo(stage, 'rotateY', { duration: 1.2, ease: 'power3' })
      const move = (e) => {
        const r = ref.current.getBoundingClientRect()
        ry(((e.clientX - r.left) / r.width - 0.5) * 30)
        rx(-((e.clientY - r.top) / r.height - 0.5) * 22)
      }
      const leave = () => {
        rx(0)
        ry(0)
      }
      const el = ref.current
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      }
    },
    { scope: ref },
  )

  if (!workshop) return null

  return (
    <article
      ref={ref}
      data-cursor="Soon"
      className={`blueprint relative grid overflow-hidden rounded-[1.75rem] bg-ink text-bone md:grid-cols-12 ${className}`}
    >
      {/* glow */}
      <div className="pointer-events-none absolute -left-1/4 top-1/3 size-[70%] rounded-full bg-ember/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-1/4 -top-1/3 size-[60%] rounded-full bg-violet/30 blur-[120px]" />

      {/* copy */}
      <div className="relative flex flex-col justify-between gap-10 p-8 md:col-span-6 md:p-12 xl:p-14">
        <div>
          <p className="type-label flex items-center gap-2 text-bone/60">
            <span className="pulse-dot size-1.5 rounded-full bg-ember" />
            In the workshop · {workshop.industry}
          </p>
          <h3 className="type-display mt-6 text-[clamp(4rem,9vw,9.5rem)]">
            {workshop.name}
            <span className="text-ember">.</span>
          </h3>
          <p className="type-serif mt-2 text-[clamp(1.8rem,3vw,3rem)] leading-none text-ember">built in three dimensions.</p>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-bone/75">{workshop.summary}</p>
        </div>

        <div>
          <ol className="flex flex-wrap gap-2">
            {workshop.phases.map((p, i) => (
              <li
                key={p.label}
                className={`type-label flex items-center gap-2 rounded-full border px-3.5 py-2 ${
                  p.done ? 'border-bone/30 bg-bone text-ink' : p.active ? 'border-ember text-ember' : 'border-dashed border-bone/25 text-bone/50'
                }`}
              >
                {p.done ? <Check className="size-3.5" strokeWidth={3} /> : p.active ? <span className="pulse-dot size-1.5 rounded-full bg-ember" /> : <span>0{i + 1}</span>}
                {p.label}
              </li>
            ))}
          </ol>
          <p className="type-label mt-6 text-bone/60">{workshop.eta}</p>
        </div>
      </div>

      {/* 3D stage */}
      <div className="relative min-h-[320px] overflow-hidden md:col-span-6 md:min-h-[520px]" style={{ perspective: '1100px' }}>
        <span className="type-display text-stroke-bone pointer-events-none absolute inset-0 grid select-none place-items-center text-[clamp(12rem,26vw,24rem)] opacity-25">
          47
        </span>
        <div className="ws-stage absolute inset-0 grid place-items-center [transform-style:preserve-3d]">
          <div className="relative grid place-items-center [transform-style:preserve-3d]">
            <Cube className="cube-outer" />
            <Cube className="cube-inner absolute" />
            <span className="ws-orbit absolute" aria-hidden="true" />
          </div>
        </div>
        <span className="type-label absolute bottom-6 right-6 text-bone/45">3D preview · work in progress</span>
      </div>
    </article>
  )
}
