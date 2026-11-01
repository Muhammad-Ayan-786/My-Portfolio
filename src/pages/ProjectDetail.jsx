import { useRef } from 'react'
import { data, useLoaderData } from 'react-router'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { useIntro } from '../context/App'
import { getNextProject, getProject } from '../data/projects'
import { site } from '../data/site'
import RevealText from '../components/ui/RevealText'
import Reveal from '../components/ui/Reveal'
import TransitionLink from '../components/ui/TransitionLink'
import Magnetic from '../components/ui/Magnetic'
import SectionLabel from '../components/ui/SectionLabel'

/** Route loader — resolves the project from the URL or throws a 404. */
export function loader({ params }) {
  const project = getProject(params.slug)
  if (!project) throw data('Project not found', { status: 404 })
  return { project, next: getNextProject(params.slug) }
}

function CaseStudy({ project, next }) {
  const ref = useRef(null)
  const { play, delay } = useIntro()

  useGSAP(
    () => {
      if (!play || prefersReducedMotion()) return
      gsap
        .timeline({ delay })
        .from('.cs-fade', { autoAlpha: 0, y: 30, stagger: 0.07, duration: 1.2 }, 0.4)
        .fromTo('.cs-cover', { clipPath: 'inset(18% 12% 0% 12% round 2rem)' }, { clipPath: 'inset(0% 0% 0% 0% round 2rem)', duration: 1.8, ease: 'expo.inOut' }, 0.2)
        .from('.cs-cover img', { scale: 1.5, duration: 2.2, ease: 'expo.out' }, 0.2)
    },
    { scope: ref, dependencies: [play] },
  )

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      // Parallax the whole frame (not the image inside it) so the screenshot is never cropped
      gsap.to('.cs-cover-wrap', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: { trigger: '.cs-cover-wrap', start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.from('.cs-next-img', {
        scale: 1.4,
        ease: 'none',
        scrollTrigger: { trigger: '.cs-next', start: 'top bottom', end: 'bottom bottom', scrub: true },
      })
    },
    { scope: ref },
  )

  const meta = [
    { label: 'Role', value: project.role },
    { label: 'Year', value: project.year },
    { label: 'Category', value: project.category },
    { label: 'Stack', value: project.stack.join(', ') },
  ]

  return (
    <article ref={ref}>
      <title>{`${project.title} — Case study — ${site.name}`}</title>
      <meta name="description" content={project.summary} />

      <header className="container-x pt-[calc(var(--nav-h)+3.5rem)] md:pt-[calc(var(--nav-h)+5rem)]">
        <div className="cs-fade flex items-center justify-between">
          <TransitionLink to="/work" className="type-label group flex items-center gap-2 text-muted hover:text-fg">
            <ArrowLeft className="size-4 transition-transform duration-500 ease-expo group-hover:-translate-x-1" />
            All work
          </TransitionLink>
          <span className="type-label text-muted">Case study</span>
        </div>

        <RevealText as="h1" type="chars" scroll={false} play={play} delay={delay} className="type-display mt-10 text-[clamp(4rem,13.5vw,15rem)]">
          {project.title}
        </RevealText>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 md:grid-cols-5">
          {meta.map((m) => (
            <div key={m.label} className="cs-fade">
              <p className="type-label mb-2 text-muted">{m.label}</p>
              <p className="font-medium">{m.value}</p>
            </div>
          ))}
          <div className="cs-fade col-span-2 md:col-span-1 md:justify-self-end">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="type-label group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-on-accent"
            >
              Live site
              <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
            </a>
          </div>
        </div>
      </header>

      <div className="cs-cover-wrap container-x mt-12 md:mt-16">
        <div className="cs-cover relative mx-auto aspect-video max-w-[1600px] overflow-hidden rounded-[2rem] bg-surface">
          <img
            src={project.image}
            alt={`${project.title} screenshot`}
            width="1920"
            height="1080"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
        </div>
      </div>

      <section className="container-x grid gap-10 py-24 md:grid-cols-12 md:py-40">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-[calc(var(--nav-h)+2rem)]">
            <SectionLabel index="01">Overview</SectionLabel>
          </div>
        </div>
        <div className="md:col-span-8">
          <RevealText as="p" className="text-[clamp(1.6rem,3.2vw,3.2rem)] font-medium leading-[1.15] tracking-[-0.025em]">
            {project.description}
          </RevealText>

          <div className="mt-20">
            <SectionLabel index="02">Highlights</SectionLabel>
            <Reveal as="ol" className="mt-8 border-b border-line">
              {project.highlights.map((h, i) => (
                <li key={h} className="flex items-baseline gap-6 border-t border-line py-6 md:gap-10">
                  <span className="type-label text-accent">0{i + 1}</span>
                  <span className="text-xl font-medium md:text-3xl md:tracking-tight">{h}</span>
                </li>
              ))}
            </Reveal>
          </div>

          <Reveal className="mt-20 flex flex-wrap items-center gap-6">
            <Magnetic strength={0.3}>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                data-cursor="Visit"
                className="group grid size-44 place-items-center rounded-full bg-fg text-center text-bg transition-colors duration-500 hover:bg-accent hover:text-on-accent md:size-56"
              >
                <span className="type-display text-2xl md:text-3xl">
                  Visit
                  <br />
                  live ↗
                </span>
              </a>
            </Magnetic>
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noreferrer" className="type-label underline decoration-accent underline-offset-4">
                View source ↗
              </a>
            )}
          </Reveal>
        </div>
      </section>

      {/* Next project */}
      <TransitionLink to={`/work/${next.slug}`} label={next.title} data-cursor="Next" className="cs-next group relative block overflow-hidden bg-ink text-bone">
        <img
          src={next.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="cs-next-img absolute inset-0 size-full object-cover object-top opacity-35 transition-opacity duration-700 group-hover:opacity-55"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/40 to-transparent" />
        <div className="container-x relative flex min-h-[70svh] flex-col justify-end py-14">
          <p className="type-label mb-6 text-bone/70">Next project →</p>
          <h2 className="type-display text-[clamp(4rem,14vw,15rem)] transition-transform duration-1000 ease-expo group-hover:translate-x-6">
            {next.title}
          </h2>
        </div>
      </TransitionLink>
    </article>
  )
}

export default function ProjectDetail() {
  const { project, next } = useLoaderData()
  // key forces a fresh mount (and fresh intro) when moving between case studies
  return <CaseStudy key={project.slug} project={project} next={next} />
}
