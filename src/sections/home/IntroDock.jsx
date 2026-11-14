import { Check } from 'lucide-react'
import { site } from '../../data/site'
import { roadmap } from '../../data/roadmap'
import Button from '../../components/ui/Button'
import Reveal from '../../components/ui/Reveal'
import RevealText from '../../components/ui/RevealText'

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

/**
 * Top edge of the sheet that slides over the hero: the one-line pitch,
 * the full-stack path at a glance and the two main actions.
 */
export default function IntroDock() {
  return (
    <div className="container-x pb-4 pt-5 md:pt-6">
      {/* sheet handle */}
      <span aria-hidden="true" className="mx-auto mb-10 block h-1 w-12 rounded-full bg-fg/15 md:mb-14" />

      <div className="grid items-end gap-10 md:grid-cols-12">
        <RevealText as="p" className="max-w-[30ch] text-[clamp(1.35rem,2.1vw,2rem)] font-medium leading-[1.2] tracking-[-0.02em] md:col-span-5">
          {site.tagline}
        </RevealText>

        <Reveal as="ol" className="flex flex-wrap gap-x-5 gap-y-2 md:col-span-4 md:justify-center" aria-label="Full-stack path" stagger={0.06} y={24}>
          {roadmap.map((stage) => (
            <li key={stage.id} className={`type-label flex items-center gap-2 ${stage.status === 'next' ? 'text-muted' : 'text-fg'}`}>
              <StageIcon status={stage.status} />
              {stage.title}
            </li>
          ))}
        </Reveal>

        <Reveal className="flex items-center gap-3 md:col-span-3 md:justify-end" y={24}>
          <Button to="/work" variant="solid">
            View work
          </Button>
          {site.resume && (
            <Button href={site.resume} variant="outline" target="_blank" rel="noreferrer" icon={false}>
              Résumé
            </Button>
          )}
        </Reveal>
      </div>
      <div className="mt-10 h-px bg-line md:mt-14" />
    </div>
  )
}
