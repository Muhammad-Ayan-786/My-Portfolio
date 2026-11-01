import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap'
import { roadmap, statusLabel } from '../../data/roadmap'
import SectionLabel from '../../components/ui/SectionLabel'
import RevealText from '../../components/ui/RevealText'

const chipStyle = {
  complete: 'bg-fg text-bg',
  current: 'bg-accent text-on-accent',
  next: 'border border-dashed border-muted text-muted',
}

function StageCard({ stage }) {
  const isNext = stage.status === 'next'
  const isCurrent = stage.status === 'current'

  return (
    <article
      className={`path-card relative flex h-full w-full flex-col justify-between gap-6 overflow-hidden rounded-[2rem] border p-7 md:p-10 lg:w-[min(80vw,1120px)] lg:shrink-0 lg:p-[clamp(1.5rem,4svh,2.5rem)] ${
        isCurrent ? 'border-accent bg-surface' : isNext ? 'border-dashed border-line bg-transparent' : 'border-line bg-surface'
      }`}
    >
      {isCurrent && <div className="pointer-events-none absolute -right-1/4 -top-1/3 size-[70%] rounded-full bg-accent/20 blur-[100px]" />}

      <div className="relative flex items-start justify-between gap-6">
        <span className="path-index type-display text-stroke text-[length:clamp(4rem,min(11vw,15svh),11rem)] opacity-60">{stage.index}</span>
        <span className={`type-label flex items-center gap-2 rounded-full px-4 py-2 ${chipStyle[stage.status]}`}>
          {isCurrent && <span className="pulse-dot size-1.5 rounded-full bg-on-accent" />}
          {statusLabel[stage.status]}
        </span>
      </div>

      <div className="relative">
        <p className="type-label mb-3 text-muted">{stage.period}</p>
        <h3 className={`type-display text-[length:clamp(3rem,min(8vw,11svh),8.5rem)] ${isNext ? 'text-muted' : ''}`}>
          {stage.title}
          {isCurrent && <span className="text-accent">.</span>}
        </h3>
        <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-fg/80 xl:text-lg">{stage.summary}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {stage.tools.map((tool) => (
            <li key={tool} className="type-label rounded-full border border-line px-3 py-1.5">
              {tool}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative">
        <div className="type-label mb-3 flex justify-between text-muted">
          <span>Progress</span>
          <span className="tabular-nums text-fg">{stage.progress}%</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-line">
          <div
            className={`path-progress h-full origin-left rounded-full ${isCurrent ? 'bg-accent' : 'bg-fg'}`}
            style={{ transform: `scaleX(${stage.progress / 100})` }}
          />
        </div>
      </div>
    </article>
  )
}

/**
 * Desktop: the section pins and the stages travel horizontally.
 * Mobile: a simple vertical stack.
 */
export default function Path() {
  const ref = useRef(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px)', () => {
        const track = ref.current.querySelector('.path-track')
        const distance = () => track.scrollWidth - window.innerWidth

        const scroll = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.path-pin',
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })

        gsap.to('.path-bar', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.path-pin', start: 'top top', end: () => `+=${distance()}`, scrub: true },
        })

        gsap.utils.toArray('.path-card').forEach((card) => {
          gsap.fromTo(
            card.querySelector('.path-index'),
            { xPercent: 40 },
            { xPercent: -20, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: scroll, start: 'left right', end: 'right left', scrub: true } },
          )
          gsap.from(card, {
            rotateY: -18,
            scale: 0.88,
            transformOrigin: 'left center',
            ease: 'none',
            scrollTrigger: { trigger: card, containerAnimation: scroll, start: 'left right', end: 'left 35%', scrub: true },
          })
          gsap.from(card.querySelector('.path-progress'), {
            scaleX: 0,
            duration: 1.6,
            ease: 'expo.out',
            scrollTrigger: { trigger: card, containerAnimation: scroll, start: 'left 60%', once: true },
          })
        })
      })

      mm.add('(max-width: 1023px)', () => {
        gsap.utils.toArray('.path-card').forEach((card) => {
          gsap.from(card, { y: 80, autoAlpha: 0, duration: 1.3, scrollTrigger: { trigger: card, start: 'top 88%', once: true } })
        })
      })

      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} aria-labelledby="path-title" className="relative">
      <div className="path-pin relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-24 lg:py-0">
        <div className="lg:[perspective:1600px]">
          <div className="path-track flex flex-col gap-6 px-[var(--gutter)] lg:h-[min(84svh,820px)] lg:flex-row lg:items-stretch lg:gap-8">
            {/* Intro panel */}
            <div className="flex flex-col justify-between gap-10 lg:w-[38vw] lg:shrink-0 lg:pr-10">
              <SectionLabel index="02">The path</SectionLabel>
              <div>
                <RevealText as="h2" type="chars" id="path-title" className="type-display text-[clamp(3.6rem,8vw,8.5rem)]">
                  Four stages.
                </RevealText>
                <RevealText as="p" type="words" className="type-serif text-[clamp(2.6rem,5.5vw,6rem)] leading-none text-accent">
                  One engineer.
                </RevealText>
                <p className="mt-8 max-w-[40ch] text-base leading-relaxed text-muted md:text-lg">
                  Full stack isn’t a title — it’s a route. Two stages are behind me, one is under my hands right now, and the next is already
                  mapped out.
                </p>
              </div>
              <p className="type-label hidden items-center gap-3 text-muted lg:flex">
                Keep scrolling <span className="inline-block animate-pulse">→</span>
              </p>
            </div>

            {roadmap.map((stage) => (
              <StageCard key={stage.id} stage={stage} />
            ))}
            <div className="hidden w-[6vw] shrink-0 lg:block" />
          </div>
        </div>

        {/* Overall progress */}
        <div className="container-x absolute inset-x-0 bottom-6 hidden lg:block">
          <div className="h-px bg-line">
            <div className="path-bar h-full origin-left scale-x-0 bg-accent" />
          </div>
        </div>
      </div>
    </section>
  )
}
