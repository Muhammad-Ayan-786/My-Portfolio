import { useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap'
import { site } from '../../data/site'
import { roadmap } from '../../data/roadmap'
import Button from '../../components/ui/Button'
import RevealText from '../../components/ui/RevealText'

function StageIcon({ status }) {
  if (status === 'complete')
    return (
      <span className="dock-icon grid size-4 place-items-center rounded-full bg-fg text-bg">
        <Check className="size-2.5" strokeWidth={3.5} />
      </span>
    )
  if (status === 'current')
    return (
      <span className="dock-icon grid size-4 place-items-center">
        <span className="pulse-dot size-2 rounded-full bg-accent" />
      </span>
    )
  return <span className="dock-icon size-4 rounded-full border border-dashed border-muted" />
}

/**
 * Top edge of the sheet that slides over the hero: the one-line pitch,
 * the full-stack path at a glance and the two main actions.
 * Plays as one sequence once the sheet has risen into view:
 * handle → pitch (line by line) → path (one stage at a time) → buttons → rule.
 */
export default function IntroDock() {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      // opacity (not autoAlpha) so the buttons stay reachable by keyboard before they animate in
      gsap.set('.dock-stage', { opacity: 0, y: 26 })
      gsap.set('.dock-icon', { scale: 0 })
      gsap.set('.dock-cta', { opacity: 0, y: 44, scale: 0.8 })
      gsap.set('.dock-handle, .dock-rule', { scaleX: 0 })

      gsap
        .timeline({
          scrollTrigger: { trigger: ref.current, start: 'top 64%', once: true, onEnter: () => setShown(true) },
        })
        .to('.dock-handle', { scaleX: 1, duration: 0.9, ease: 'expo.out' })
        .to('.dock-stage', { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'expo.out' }, 0.45)
        .to('.dock-icon', { scale: 1, duration: 0.7, stagger: 0.12, ease: 'back.out(3)' }, 0.5)
        .to('.dock-cta', { opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.12, ease: 'back.out(1.7)' }, 0.85)
        .to('.dock-rule', { scaleX: 1, duration: 1.6, ease: 'expo.inOut' }, 0.3)
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className="container-x pb-4 pt-5 md:pt-6">
      {/* sheet handle */}
      <span aria-hidden="true" className="dock-handle mx-auto mb-10 block h-1 w-12 rounded-full bg-fg/15 md:mb-14" />

      <div className="grid items-end gap-10 md:grid-cols-12">
        <RevealText
          as="p"
          scroll={false}
          play={shown}
          delay={0.15}
          stagger={0.12}
          className="max-w-[30ch] text-[clamp(1.35rem,2.1vw,2rem)] font-medium leading-[1.2] tracking-[-0.02em] md:col-span-5"
        >
          {site.tagline}
        </RevealText>

        <ol className="flex flex-wrap gap-x-5 gap-y-2 md:col-span-4 md:justify-center" aria-label="Full-stack path">
          {roadmap.map((stage) => (
            <li key={stage.id} className={`dock-stage type-label flex items-center gap-2 ${stage.status === 'next' ? 'text-muted' : 'text-fg'}`}>
              <StageIcon status={stage.status} />
              {stage.title}
            </li>
          ))}
        </ol>

        <div className="flex items-center gap-3 md:col-span-3 md:justify-end">
          <span className="dock-cta inline-block">
            <Button to="/work" variant="solid">
              View work
            </Button>
          </span>
          {site.resume && (
            <span className="dock-cta inline-block">
              <Button href={site.resume} variant="outline" target="_blank" rel="noreferrer" icon={false}>
                Résumé
              </Button>
            </span>
          )}
        </div>
      </div>
      <div className="dock-rule mt-10 h-px origin-left bg-line md:mt-14" />
    </div>
  )
}
