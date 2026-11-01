import { useRef } from 'react'
import { Check } from 'lucide-react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { site } from '../data/site'
import { journey } from '../data/journey'
import { skills } from '../data/skills'
import { roadmap, statusLabel } from '../data/roadmap'
import { principles } from '../data/principles'
import PageHeader from '../components/ui/PageHeader'
import SectionLabel from '../components/ui/SectionLabel'
import RevealText from '../components/ui/RevealText'
import Reveal from '../components/ui/Reveal'
import TiltCard from '../components/ui/TiltCard'
import Logo from '../components/ui/Logo'
import LocalTime from '../components/ui/LocalTime'
import Button from '../components/ui/Button'

/* -------------------------------------------------------------------------- */
function IdCard() {
  return (
    <TiltCard className="mx-auto aspect-[3/4.2] w-full max-w-[380px] overflow-hidden rounded-[1.75rem] border border-line bg-surface p-7 shadow-2xl">
      <div className="pointer-events-none absolute -right-1/3 -top-1/4 size-[90%] rounded-full bg-accent/35 blur-[70px]" />
      <div className="pointer-events-none absolute -bottom-1/3 -left-1/4 size-[80%] rounded-full bg-accent-2/35 blur-[70px]" />
      <div className="relative flex h-full flex-col justify-between [transform:translateZ(40px)]">
        <div className="flex items-start justify-between">
          <Logo className="size-10 text-fg" />
          <span className="type-label rounded-full border border-line px-3 py-1.5">Dev ID — {new Date().getFullYear()}</span>
        </div>
        <div>
          <p className="type-label text-muted">Name</p>
          <p className="type-display mt-1 text-6xl">
            {site.firstName}
            <br />
            {site.lastName}
            <span className="text-accent">.</span>
          </p>
          <p className="type-serif mt-2 text-2xl text-accent">{site.role}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-line pt-5">
          <div>
            <p className="type-label text-muted">Based</p>
            <p className="mt-1 text-sm font-semibold">{site.location.city}</p>
          </div>
          <div>
            <p className="type-label text-muted">Local</p>
            <LocalTime className="mt-1 block text-sm font-semibold" />
          </div>
          <div>
            <p className="type-label text-muted">Now</p>
            <p className="mt-1 text-sm font-semibold">{site.currently}</p>
          </div>
          <div>
            <p className="type-label text-muted">Next</p>
            <p className="mt-1 text-sm font-semibold">{site.next}</p>
          </div>
        </div>
        <div className="flex h-8 items-end gap-[3px]" aria-hidden="true">
          {Array.from({ length: 42 }, (_, i) => (
            <span key={i} className="w-full bg-fg" style={{ height: `${30 + ((i * 37) % 70)}%`, opacity: i % 5 === 0 ? 0.3 : 0.85 }} />
          ))}
        </div>
      </div>
    </TiltCard>
  )
}

/* -------------------------------------------------------------------------- */
function Timeline() {
  const ref = useRef(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        '.tl-fill',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.tl-list', start: 'top 60%', end: 'bottom 60%', scrub: true } },
      )
      gsap.utils.toArray('.tl-item').forEach((item) => {
        gsap.from(item.querySelectorAll('.tl-anim'), {
          y: 60,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 1.3,
          scrollTrigger: { trigger: item, start: 'top 80%', once: true },
        })
        gsap.to(item.querySelector('.tl-dot'), {
          backgroundColor: 'var(--accent)',
          borderColor: 'var(--accent)',
          scale: 1.4,
          duration: 0.4,
          scrollTrigger: { trigger: item, start: 'top 60%', toggleActions: 'play none none reverse' },
        })
      })
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="container-x py-24 md:py-40" aria-labelledby="journey-title">
      <SectionLabel index="03">Journey</SectionLabel>
      <RevealText as="h2" type="chars" id="journey-title" className="type-display mt-8 text-[clamp(3.4rem,9vw,9.5rem)]">
        How I got here
      </RevealText>

      <div className="tl-list relative mt-20 md:mt-28">
        <div className="absolute bottom-0 left-[7px] top-0 w-px bg-line md:left-1/2" aria-hidden="true">
          <div className="tl-fill h-full w-full origin-top bg-accent" />
        </div>
        <ol>
        {journey.map((entry, i) => (
          <li key={entry.title} className={`tl-item relative grid pb-20 pl-10 last:pb-0 md:grid-cols-2 md:pl-0`}>
            <span className="tl-dot absolute left-0 top-2 size-[15px] rounded-full border border-fg bg-bg md:left-1/2 md:-translate-x-1/2" />
            <div className={`${i % 2 ? 'md:col-start-2 md:pl-20' : 'md:pr-20 md:text-right'}`}>
              <p className={`tl-anim type-label ${entry.current ? 'text-accent' : 'text-muted'}`}>
                {entry.period}
                {entry.current && ' — you are here'}
              </p>
              <h3 className="tl-anim type-display mt-3 text-[clamp(2.2rem,4.4vw,4.6rem)]">{entry.title}</h3>
              <p className={`tl-anim mt-4 max-w-[46ch] text-lg leading-relaxed text-fg/80 ${i % 2 ? '' : 'md:ml-auto'}`}>{entry.description}</p>
            </div>
          </li>
        ))}
        </ol>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
const statusStyle = {
  complete: 'text-fg',
  current: 'text-accent',
  next: 'text-muted',
}

export default function About() {
  const now = roadmap.find((r) => r.status === 'current')
  const next = roadmap.find((r) => r.status === 'next')

  return (
    <>
      <title>{`About — ${site.name}`}</title>
      <meta name="description" content={`About ${site.name}: a ${site.role.toLowerCase()} based in ${site.location.city}, now building with ${site.currently}.`} />

      <PageHeader index="03" label="About" title="About" accent="the human behind the stack." aside={site.location.short} />

      {/* Intro */}
      <section className="container-x grid items-center gap-16 pb-24 md:grid-cols-12 md:pb-40">
        <div className="md:col-span-7">
          <SectionLabel index="01">Who I am</SectionLabel>
          <RevealText as="p" className="mt-8 text-[clamp(1.7rem,3.3vw,3.3rem)] font-medium leading-[1.12] tracking-[-0.03em]">
            I’m {site.fullName} — a developer from {site.location.city} who fell for the web because it sits exactly where engineering meets
            design.
          </RevealText>
          <Reveal className="mt-10 grid gap-6 text-lg leading-relaxed text-fg/80 md:grid-cols-2">
            <p>
              I started on the frontend, obsessing over layout, type and motion. Then I needed my interfaces to <em>do</em> more, so I learned
              to build the servers, APIs and databases behind them.
            </p>
            <p>
              Today I’m going deep on {site.currently} — teaching products to understand and generate — and {site.next} is next, so everything
              I build can ship and scale on its own.
            </p>
          </Reveal>
          <Reveal className="mt-10 flex flex-wrap gap-3">
            <Button to="/contact">Work with me</Button>
            {site.resume && (
              <Button href={site.resume} variant="outline" target="_blank" rel="noreferrer" icon={false}>
                View résumé
              </Button>
            )}
          </Reveal>
        </div>
        <Reveal className="md:col-span-5">
          <IdCard />
        </Reveal>
      </section>

      {/* Now / Next */}
      <section className="container-x pb-24 md:pb-40" aria-labelledby="now-title">
        <SectionLabel index="02">
          <span id="now-title">Now & next</span>
        </SectionLabel>
        <Reveal className="mt-10 grid gap-4 md:grid-cols-2">
          {[now, next].filter(Boolean).map((stage) => (
            <div
              key={stage.id}
              className={`relative overflow-hidden rounded-[1.75rem] border p-8 md:p-12 ${
                stage.status === 'current' ? 'border-accent bg-surface' : 'border-dashed border-line'
              }`}
            >
              {stage.status === 'current' && <div className="pointer-events-none absolute -right-1/4 -top-1/2 size-[80%] rounded-full bg-accent/25 blur-[90px]" />}
              <p className={`type-label relative flex items-center gap-2 ${stage.status === 'current' ? 'text-accent' : 'text-muted'}`}>
                {stage.status === 'current' && <span className="pulse-dot size-1.5 rounded-full bg-accent" />}
                {statusLabel[stage.status]}
              </p>
              <h3 className="type-display relative mt-6 text-[clamp(3rem,6vw,6.5rem)]">{stage.title}</h3>
              <p className="relative mt-5 max-w-[44ch] text-lg leading-relaxed text-fg/80">{stage.summary}</p>
              <ul className="relative mt-8 flex flex-wrap gap-2">
                {stage.tools.map((t) => (
                  <li key={t} className="type-label rounded-full border border-line px-3.5 py-2">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </section>

      <Timeline />

      {/* Toolbox */}
      <section className="container-x py-24 md:py-40" aria-labelledby="toolbox-title">
        <SectionLabel index="04">Toolbox</SectionLabel>
        <div className="mt-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <RevealText as="h2" type="chars" id="toolbox-title" className="type-display text-[clamp(3.4rem,9vw,9.5rem)]">
            The toolbox
          </RevealText>
          <p className="type-label text-muted">{skills.reduce((n, g) => n + g.items.length, 0)} tools · {skills.length} disciplines</p>
        </div>

        <Reveal className="mt-16 grid gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {skills.map((group, i) => (
            <div key={group.id} className="group relative flex min-h-[280px] flex-col justify-between gap-10 overflow-hidden bg-bg p-7 md:p-9">
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-surface transition-transform duration-700 ease-expo group-hover:scale-y-100" />
              <div className="relative flex items-start justify-between">
                <div>
                  <span className="type-label text-muted">0{i + 1}</span>
                  <h3 className="type-display mt-2 text-4xl md:text-5xl">{group.label}</h3>
                </div>
                <span className={`type-label flex items-center gap-1.5 ${statusStyle[group.status]}`}>
                  {group.status === 'complete' && <Check className="size-3.5" strokeWidth={3} />}
                  {group.status === 'current' && <span className="pulse-dot size-1.5 rounded-full bg-accent" />}
                  {statusLabel[group.status]}
                </span>
              </div>
              <ul className="relative flex flex-wrap gap-x-4 gap-y-2">
                {group.items.map((item) => (
                  <li key={item} className={`text-lg font-medium ${group.status === 'next' ? 'text-muted' : ''}`}>
                    {item}
                    <span className="ml-4 text-accent">/</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Principles */}
      <section className="container-x pb-32 md:pb-44" aria-labelledby="principles-title">
        <SectionLabel index="05">Principles</SectionLabel>
        <RevealText as="h2" type="chars" id="principles-title" className="type-display mt-8 text-[clamp(3.4rem,9vw,9.5rem)]">
          How I work
        </RevealText>
        <Reveal className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => (
            <TiltCard key={p.title} max={10} className="flex h-full min-h-[340px] flex-col justify-between rounded-[1.5rem] border border-line bg-surface p-7">
              <span className="type-display text-stroke text-7xl [transform:translateZ(30px)]">0{i + 1}</span>
              <div className="[transform:translateZ(50px)]">
                <h3 className="type-display text-3xl">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-fg/75">{p.description}</p>
              </div>
            </TiltCard>
          ))}
        </Reveal>
      </section>
    </>
  )
}
