import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { services, steps } from '../data/services'
import { job, clients } from '../data/clients'
import { site } from '../data/site'
import PageHeader from '../components/ui/PageHeader'
import SectionLabel from '../components/ui/SectionLabel'
import RevealText from '../components/ui/RevealText'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import TransitionLink from '../components/ui/TransitionLink'

const contactFor = (s) => `/contact?interest=${encodeURIComponent(s.interest)}`

/** One offer. Hover (or focus) unfolds the details; touch screens always show them. */
function ServiceRow({ service, index }) {
  const top = service.id === 'job'
  return (
    <li className="svc group relative border-t border-line focus-within:z-10">
      <span className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-surface transition-transform duration-700 ease-expo group-focus-within:scale-y-100 group-hover:scale-y-100" />

      <div className="relative grid grid-cols-12 items-center gap-4 py-8 md:py-10">
        <span className="type-label col-span-2 text-muted md:col-span-1">{String(index + 1).padStart(2, '0')}</span>
        <h3 className="type-display col-span-10 text-[clamp(2.3rem,6vw,6.5rem)] transition-transform duration-700 ease-expo group-hover:translate-x-3 md:col-span-7">
          {service.title}
        </h3>
        <span className="col-span-12 md:col-span-2 md:justify-self-start">
          <span
            className={`type-label inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${
              top ? 'bg-accent text-on-accent' : 'border border-line text-muted'
            }`}
          >
            {top && <span className="pulse-dot size-1.5 rounded-full bg-on-accent" />}
            {service.tag}
          </span>
        </span>
        <span className="col-span-12 hidden justify-end md:col-span-2 md:flex">
          <span className="grid size-14 place-items-center rounded-full border border-line transition-all duration-500 ease-expo group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
            <ArrowUpRight className="size-6" />
          </span>
        </span>
      </div>

      {/* details — grid-rows trick animates height without measuring */}
      <div className="relative grid grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-expo group-focus-within:grid-rows-[1fr] group-hover:grid-rows-[1fr] [@media(hover:none)]:grid-rows-[1fr]">
        <div className="overflow-hidden">
          <div className="grid gap-8 pb-10 md:grid-cols-12 md:pb-12">
            <p className="text-lg leading-relaxed text-fg/80 md:col-span-5 md:col-start-2">{service.pitch}</p>
            <div className="flex flex-col justify-between gap-6 md:col-span-5 md:col-start-8">
              <ul className="flex flex-wrap gap-2">
                {service.deliverables.map((d) => (
                  <li key={d} className="type-label rounded-full border border-line bg-bg px-3 py-1.5">
                    {d}
                  </li>
                ))}
              </ul>
              <TransitionLink
                to={contactFor(service)}
                label="Contact"
                className="type-label inline-flex items-center gap-2 self-start border-b border-accent pb-1 text-accent transition-[gap] duration-500 hover:gap-4"
              >
                {top ? 'Let’s talk about the role' : 'Start this'}
                <ArrowUpRight className="size-4" />
              </TransitionLink>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

export default function Services() {
  const ref = useRef(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('.pr-line', {
        scaleX: 0,
        duration: 2,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: '.pr-steps', start: 'top 82%', once: true },
      })
      gsap.from('.pr-step', {
        y: 60,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 1.2,
        scrollTrigger: { trigger: '.pr-steps', start: 'top 82%', once: true },
      })
    },
    { scope: ref },
  )

  const liveStores = clients.length

  return (
    <>
      <title>{`Services — ${site.name}`}</title>
      <meta
        name="description"
        content={`${site.name} is open to work: full-time and part-time roles, Shopify stores, portfolio websites, custom web projects and internships.`}
      />

      <PageHeader
        index="03"
        label="Services"
        title="Hire me"
        accent="for whatever you’re building."
        aside={
          <span className="flex items-center gap-2">
            <span className="pulse-dot size-1.5 rounded-full bg-accent" />
            Open to work
          </span>
        }
      >
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <p className="max-w-[50ch] text-lg leading-relaxed text-fg/80">
            I’m a {site.role.toLowerCase()} working full-time as a {job.title} — {liveStores} live stores so far. I’m open to a permanent role
            and take on freelance work alongside it, from quick portfolio sites to full custom builds.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button to="/contact">Get in touch</Button>
            {site.resume && (
              <Button href={site.resume} variant="outline" target="_blank" rel="noreferrer" icon={false}>
                Résumé
              </Button>
            )}
          </div>
        </div>
      </PageHeader>

      <div ref={ref}>
        {/* Offers */}
        <section className="container-x pb-28 md:pb-44" aria-labelledby="offers-title">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionLabel index="01">Open to</SectionLabel>
              <RevealText as="h2" type="chars" id="offers-title" className="type-display mt-8 text-[clamp(3.2rem,8vw,8.5rem)]">
                Ways to work together
              </RevealText>
            </div>
            <p className="type-label text-muted [@media(hover:none)]:hidden">Hover a row for details</p>
          </div>
          <Reveal as="ul" className="mt-14 border-b border-line md:mt-20" stagger={0.08}>
            {services.map((s, i) => (
              <ServiceRow key={s.id} service={s} index={i} />
            ))}
          </Reveal>
        </section>

        {/* For recruiters */}
        <section className="container-x pb-28 md:pb-44" aria-labelledby="recruiters-title">
          <SectionLabel index="02">For recruiters</SectionLabel>
          <Reveal className="mt-10">
            <div className="relative grid overflow-hidden rounded-[2rem] bg-fg text-bg md:grid-cols-12">
              <div className="pointer-events-none absolute -right-1/4 -top-1/2 size-[70%] rounded-full bg-accent/30 blur-[120px]" />
              <div className="relative p-8 md:col-span-7 md:p-14">
                <h2 id="recruiters-title" className="type-display text-[clamp(3rem,7vw,7.5rem)]">
                  Looking for <span className="type-serif text-accent">a dev?</span>
                </h2>
                <p className="mt-6 max-w-[46ch] text-lg leading-relaxed opacity-80">
                  Full-time or part-time, fully remote from {site.location.city}. I bring production Shopify experience, a full-stack
                  React + Node toolkit and a habit of shipping.
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  {site.resume && (
                    <Button href={site.resume} variant="accent" target="_blank" rel="noreferrer">
                      View résumé
                    </Button>
                  )}
                  <Button to={`/contact?interest=${encodeURIComponent(services[0].interest)}`} variant="outline" className="!border-bg/30 !text-bg">
                    Contact me
                  </Button>
                </div>
              </div>
              <dl className="relative grid grid-cols-2 gap-px border-t border-bg/15 bg-bg/15 md:col-span-5 md:border-l md:border-t-0">
                {[
                  ['Role', 'Frontend · Full-stack · Shopify'],
                  ['Type', 'Full-time · Part-time · Remote'],
                  ['Based in', `${site.location.city}, ${site.location.short.split(', ')[1]}`],
                  ['Time zone', `${site.location.timeZoneLabel} (UTC+2)`],
                  ['Now', `${job.title}`],
                  ['Shipped', `${liveStores} live stores`],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col justify-between gap-6 bg-fg p-6 md:p-7">
                    <dt className="type-label opacity-50">{k}</dt>
                    <dd className="text-lg font-semibold leading-snug">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </section>

        {/* Process */}
        <section className="container-x pb-32 md:pb-44" aria-labelledby="process-title">
          <SectionLabel index="03">Process</SectionLabel>
          <RevealText as="h2" type="chars" id="process-title" className="type-display mt-8 text-[clamp(3.2rem,8vw,8.5rem)]">
            How a project runs
          </RevealText>
          <div className="pr-steps relative mt-16 md:mt-24">
            <span className="pr-line absolute left-0 right-0 top-[1.1rem] hidden h-px origin-left bg-accent md:block" />
            <ol className="grid gap-12 md:grid-cols-4 md:gap-8">
              {steps.map((p, i) => (
                <li key={p.title} className="pr-step relative">
                  <span className="relative grid size-9 place-items-center rounded-full bg-accent text-sm font-bold text-on-accent">{i + 1}</span>
                  <h3 className="type-display mt-8 text-[clamp(2.4rem,3.4vw,3.6rem)]">{p.title}</h3>
                  <p className="mt-4 max-w-[32ch] leading-relaxed text-fg/75">{p.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </>
  )
}
