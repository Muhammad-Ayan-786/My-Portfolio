import { useMemo, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { projects } from '../data/projects'
import { site } from '../data/site'
import PageHeader from '../components/ui/PageHeader'
import TransitionLink from '../components/ui/TransitionLink'
import Reveal from '../components/ui/Reveal'
import SectionLabel from '../components/ui/SectionLabel'
import RevealText from '../components/ui/RevealText'
import ClientCard from '../components/work/ClientCard'
import Workshop from '../components/work/Workshop'
import { clients, job } from '../data/clients'

function ProjectCard({ project, index, total }) {
  return (
    <div className="wk-wrap sticky mb-[12vh] last:mb-0" style={{ top: `calc(var(--nav-h) + ${index * 14}px)` }}>
      <TransitionLink
        to={`/work/${project.slug}`}
        label={project.title}
        data-cursor="Open case"
        className="wk-card group relative grid origin-top overflow-hidden rounded-[1.75rem] border border-line bg-surface md:grid-cols-12"
      >
        {/* Images are 16:9 (1920×1080) — the box matches, so nothing is ever cropped */}
        <div className="relative aspect-video overflow-hidden md:col-span-8 md:self-center">
          <img
            src={project.image}
            alt={`${project.title} — ${project.summary}`}
            width="1920"
            height="1080"
            loading={index < 2 ? 'eager' : 'lazy'}
            decoding="async"
            className="wk-img absolute inset-0 size-full object-cover transition-transform duration-1000 ease-expo group-hover:scale-[1.03]"
          />
          <span className="type-label absolute bottom-4 left-4 rounded-full bg-bg/85 px-3 py-1.5 backdrop-blur-md">{project.category}</span>
        </div>

        <div className="flex flex-col justify-between gap-6 p-6 md:col-span-4 md:p-7 xl:p-9">
          <div className="flex items-start justify-between">
            <span className="type-display text-stroke text-[clamp(3rem,4.5vw,5.5rem)]">{String(index + 1).padStart(2, '0')}</span>
            <span className="type-label text-muted">
              / {String(total).padStart(2, '0')}
            </span>
          </div>

          <div>
            <p className="type-label mb-3 text-muted">
              {project.year} — {project.role}
            </p>
            <h2 className="type-display text-[clamp(2.4rem,3.6vw,4.5rem)] transition-colors duration-500 group-hover:text-accent">{project.title}</h2>
            <p className="mt-4 max-w-[40ch] text-[0.95rem] leading-relaxed text-fg/80">{project.summary}</p>
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {project.stack.map((t) => (
                <li key={t} className="type-label rounded-full border border-line px-3 py-1.5">
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <span className="type-label flex items-center justify-between border-t border-line pt-4">
            View case study
            <span className="grid size-11 place-items-center rounded-full bg-fg text-bg transition-all duration-500 ease-expo group-hover:rotate-45 group-hover:bg-accent group-hover:text-on-accent">
              <ArrowUpRight className="size-5" />
            </span>
          </span>
        </div>
        <div className="wk-shade pointer-events-none absolute inset-0 bg-bg opacity-0" />
      </TransitionLink>
    </div>
  )
}

export default function Work() {
  const ref = useRef(null)
  const categories = useMemo(() => ['All', ...new Set(projects.map((p) => p.category))], [])
  const [filter, setFilter] = useState('All')
  const list = filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const wraps = gsap.utils.toArray('.wk-wrap')
      wraps.forEach((wrap, i) => {
        const card = wrap.querySelector('.wk-card')
        gsap.from(card, { y: 120, rotateX: -12, autoAlpha: 0, duration: 1.4, scrollTrigger: { trigger: wrap, start: 'top 92%', once: true } })

        const next = wraps[i + 1]
        if (!next) return
        const st = { trigger: next, start: 'top bottom', end: 'top top+=120', scrub: true }
        gsap.to(card, { scale: 0.92 - (wraps.length - i) * 0.01, ease: 'none', scrollTrigger: st })
        gsap.to(card.querySelector('.wk-shade'), { opacity: 0.55, ease: 'none', scrollTrigger: st })
      })
      ScrollTrigger.refresh()
    },
    { scope: ref, dependencies: [filter], revertOnUpdate: true },
  )

  return (
    <>
      <title>{`Work — ${site.name}`}</title>
      <meta
        name="description"
        content={`Work by ${site.name}: live Shopify stores (${clients.map((c) => c.name).join(', ')}) and personal projects (${projects.map((p) => p.title).join(', ')}).`}
      />

      <PageHeader
        index="02"
        label="Work"
        title="Work"
        accent="built to be used."
        aside={`(${String(clients.length).padStart(2, '0')} client · ${String(projects.length).padStart(2, '0')} personal)`}
      >
        <p className="max-w-[52ch] text-lg leading-relaxed text-fg/80">
          Live Shopify stores I’ve built for real brands as a {job.title.toLowerCase()} — and the personal products, experiments and hackathon
          builds that got me here, each one a step from frontend to full stack.
        </p>
      </PageHeader>

      {/* Client work */}
      <section className="container-x pb-28 md:pb-44" aria-labelledby="client-title">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel index="01">Client work</SectionLabel>
            <RevealText as="h2" type="chars" id="client-title" className="type-display mt-8 text-[clamp(3.2rem,8vw,8.5rem)]">
              Live on Shopify
            </RevealText>
          </div>
          <p className="type-label max-w-[30ch] text-muted md:text-right">Hover a store to peek inside · click to visit the live site</p>
        </div>
        <Reveal className="mt-14 grid gap-x-8 gap-y-16 md:mt-20 md:grid-cols-2 xl:grid-cols-3" stagger={0.12}>
          {clients.map((c, i) => (
            <ClientCard key={c.slug} client={c} index={i} detailed />
          ))}
        </Reveal>
        <Reveal className="mt-20 md:mt-28">
          <Workshop />
        </Reveal>
      </section>

      {/* Personal projects */}
      <div className="container-x pb-14 md:pb-20">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <SectionLabel index="02">Personal projects</SectionLabel>
            <RevealText as="h2" type="chars" className="type-display mt-8 text-[clamp(3.2rem,8vw,8.5rem)]">
              Built to learn
            </RevealText>
          </div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={filter === c}
                onClick={() => setFilter(c)}
                className={`type-label relative rounded-full border px-4 py-2.5 transition-colors ${
                  filter === c ? 'border-fg text-bg' : 'border-line text-fg hover:border-fg'
                }`}
              >
                {filter === c && <motion.span layoutId="work-filter" className="absolute inset-0 rounded-full bg-fg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <span className="relative">{c}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <section ref={ref} className="container-x pb-24 [perspective:1400px]" aria-label="Projects">
        {list.map((p) => (
          <ProjectCard key={p.slug} project={p} index={projects.indexOf(p)} total={projects.length} />
        ))}
      </section>

      <Reveal as="section" className="container-x pb-32 md:pb-44">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-dashed border-line p-8 md:p-14">
          <div className="pointer-events-none absolute -bottom-1/2 -right-1/4 size-[60%] rounded-full bg-accent-2/25 blur-[110px]" />
          <p className="type-label mb-6 flex items-center gap-2 text-muted">
            <span className="pulse-dot size-1.5 rounded-full bg-accent" /> In the lab
          </p>
          <h2 className="type-display max-w-[16ch] text-[clamp(2.8rem,6.5vw,7rem)]">
            The next projects here <span className="type-serif text-accent-2">will think.</span>
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-fg/80">
            I’m currently building with {site.currently} — LLM-powered features, retrieval and AI-native interfaces. They’ll land on this page
            soon, followed by projects deployed with a full {site.next} pipeline.
          </p>
        </div>
      </Reveal>
    </>
  )
}
