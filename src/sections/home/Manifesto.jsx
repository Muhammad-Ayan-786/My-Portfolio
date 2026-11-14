import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap'
import { projects } from '../../data/projects'
import { allSkills } from '../../data/skills'
import { roadmap } from '../../data/roadmap'
import { site } from '../../data/site'
import { clients } from '../../data/clients'
import ScrubText from '../../components/ui/ScrubText'
import SectionLabel from '../../components/ui/SectionLabel'

export default function Manifesto() {
  const ref = useRef(null)
  const done = roadmap.filter((r) => r.status === 'complete').length

  // Every number is derived from the data files — add a project, it updates.
  const stats = [
    { value: clients.length, suffix: '', label: 'Client stores live' },
    { value: projects.length, suffix: '', label: 'Personal projects shipped' },
    { value: allSkills.length, suffix: '+', label: 'Technologies in the toolbox' },
    { value: done, suffix: `/${roadmap.length}`, label: 'Stages of the full-stack path' },
  ]

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.utils.toArray('.stat-num').forEach((el) => {
        const end = Number(el.dataset.value)
        const obj = { v: 0 }
        gsap.to(obj, {
          v: end,
          duration: 2,
          ease: 'expo.out',
          onUpdate: () => (el.textContent = String(Math.round(obj.v)).padStart(2, '0')),
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })
      gsap.from('.stat', {
        y: 80,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 1.4,
        scrollTrigger: { trigger: '.stats', start: 'top 88%', once: true },
      })
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="container-x py-28 md:py-44" aria-labelledby="manifesto-title">
      <SectionLabel index="01">
        <span id="manifesto-title">Manifesto</span>
      </SectionLabel>

      <ScrubText className="mt-10 max-w-[26ch] text-[clamp(2rem,4.9vw,5.4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
        I’m {site.firstName} — a full-stack engineer who builds the <em className="type-serif text-accent">whole thing.</em> Pixel-perfect
        interfaces, the APIs that power them, and now the <em className="type-serif text-accent-2">intelligence</em> inside them.
        By day I ship <em className="type-serif text-accent">Shopify stores</em> for real brands. Frontend and backend: done.{' '}
        {site.currently}: building. {site.next}: next.
      </ScrubText>

      <dl className="stats mt-24 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:mt-32 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="stat flex flex-col justify-between gap-16 bg-bg p-8 md:p-10">
            <dt className="type-label text-muted">{s.label}</dt>
            <dd className="type-display flex items-start text-[clamp(5rem,9vw,9rem)]">
              <span className="stat-num tabular-nums" data-value={s.value}>
                {String(s.value).padStart(2, '0')}
              </span>
              <span className="type-serif ml-1 text-[0.4em] text-accent">{s.suffix}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
