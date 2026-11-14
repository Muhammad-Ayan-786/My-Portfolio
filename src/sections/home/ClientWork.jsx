import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap'
import { job, clients } from '../../data/clients'
import SectionLabel from '../../components/ui/SectionLabel'
import RevealText from '../../components/ui/RevealText'
import Reveal from '../../components/ui/Reveal'
import Button from '../../components/ui/Button'
import ClientCard from '../../components/work/ClientCard'
import Workshop from '../../components/work/Workshop'

/**
 * Day job: the live client stores.
 * Desktop — the browser windows start stacked like a dealt deck in the middle
 * and fan out into a row as you scroll. Mobile — a simple stagger.
 */
export default function ClientWork() {
  const ref = useRef(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px)', () => {
        const grid = ref.current.querySelector('.cw-grid')
        const cards = gsap.utils.toArray('.cw-item', grid)
        const mid = (cards.length - 1) / 2
        // distance from each card to the grid's centre line
        const toCentre = (el) => {
          const g = grid.getBoundingClientRect()
          const r = el.getBoundingClientRect()
          return g.left + g.width / 2 - (r.left + r.width / 2)
        }
        gsap.fromTo(
          cards,
          {
            x: (i, el) => toCentre(el),
            y: (i) => 60 + Math.abs(i - mid) * 40,
            rotate: (i) => (i - mid) * 7,
            scale: 0.86,
            zIndex: (i) => (i === Math.round(mid) ? 3 : 1),
          },
          {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            ease: 'power2.inOut',
            scrollTrigger: { trigger: grid, start: 'top 92%', end: 'top 28%', scrub: 1, invalidateOnRefresh: true },
          },
        )
      })

      mm.add('(max-width: 1023px)', () => {
        gsap.utils.toArray('.cw-item').forEach((el) => {
          gsap.from(el, { y: 80, autoAlpha: 0, duration: 1.3, scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
        })
      })

      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="container-x py-28 md:py-44" aria-labelledby="dayjob-title">
      <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
        <div>
          <SectionLabel index="03">Day job</SectionLabel>
          <RevealText as="h2" type="chars" id="dayjob-title" className="type-display mt-8 text-[clamp(3.4rem,9vw,10rem)]">
            {job.title}
          </RevealText>
          <RevealText as="p" type="words" className="type-serif text-[clamp(2.2rem,5vw,5.5rem)] leading-none text-accent">
            shipping stores for real brands.
          </RevealText>
        </div>
        <Reveal className="max-w-[40ch] lg:pb-3">
          <p className="type-label flex items-center gap-2 text-muted">
            <span className="pulse-dot size-1.5 rounded-full bg-accent" />
            {job.type}
            {job.company ? ` · ${job.company}` : ''} · since {job.since}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-fg/80">{job.summary}</p>
        </Reveal>
      </div>

      <div className="cw-grid mt-16 grid gap-14 md:mt-24 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {clients.map((c, i) => (
          <div key={c.slug} className="cw-item relative">
            <ClientCard client={c} index={i} />
          </div>
        ))}
      </div>

      <Reveal className="mt-20 md:mt-28">
        <Workshop />
      </Reveal>

      <div className="mt-12 flex justify-center">
        <Button to="/work" variant="outline">
          All client & personal work
        </Button>
      </div>
    </section>
  )
}
