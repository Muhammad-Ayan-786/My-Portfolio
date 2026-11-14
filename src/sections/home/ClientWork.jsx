import { Fragment, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap'
import { useLenis } from '../../context/SmoothScroll'
import { job, clients } from '../../data/clients'
import SectionLabel from '../../components/ui/SectionLabel'
import RevealText from '../../components/ui/RevealText'
import Reveal from '../../components/ui/Reveal'
import Button from '../../components/ui/Button'
import BrowserFrame from '../../components/work/BrowserFrame'
import ClientRow from '../../components/work/ClientRow'
import Workshop from '../../components/work/Workshop'

const pad = (n) => String(n).padStart(2, '0')
const STEP = 3 // timeline units per store: 2 to "live" in it (cover → second screen), 1 to hand over to the next

/**
 * Day job — the live client stores.
 * Desktop: one big browser window pins in place while you scroll; each store's homepage wipes up,
 * a second screen slides across, and the counter / store list / details change in sync.
 * Below lg (or with reduced motion): editorial rows.
 */
export default function ClientWork() {
  const ref = useRef(null)
  const tlRef = useRef(null)
  const lenis = useLenis()
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px)', () => {
        const q = gsap.utils.selector(ref)
        const n = clients.length
        const covers = q('.cw-cover')
        const gals = q('.cw-gal')
        const panels = q('.cw-panel')
        const names = q('.cw-name')
        const bars = q('.cw-bar')
        const domains = q('.cw-domain')
        const glows = q('.cw-glow')

        gsap.set(covers.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' })
        gsap.set(gals, { clipPath: 'inset(0% 0% 0% 100%)' })
        gsap.set(panels.slice(1), { autoAlpha: 0, y: 40 })
        gsap.set(domains.slice(1), { autoAlpha: 0, yPercent: 100 })
        gsap.set(glows.slice(1), { opacity: 0 })
        gsap.set(names.slice(1), { opacity: 0.35 })
        gsap.set(bars, { scaleX: 0 })

        let current = 0
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: q('.cw-show')[0],
            start: 'top top',
            end: () => `+=${window.innerHeight * 0.55 * (STEP * n - 1)}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
          onUpdate() {
            const i = Math.min(n - 1, Math.floor((this.time() + 0.5) / STEP))
            if (i !== current) {
              current = i
              setActive(i)
            }
          },
        })

        clients.forEach((_, i) => {
          const at = i * STEP
          tl.addLabel(`c${i}`, at)
          tl.to(bars[i], { scaleX: 1, duration: 2 }, at)
          tl.to(q('.cw-digits'), { yPercent: (-100 * i) / n, duration: 0.6, ease: 'power3.inOut' }, at - (i ? 0.6 : 0))
          if (gals[i]) tl.to(gals[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.inOut' }, at + 0.6)
          if (i === n - 1) return

          // hand over to the next store
          const t = at + 2
          tl.to(covers[i + 1], { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power3.inOut' }, t)
            .to(panels[i], { autoAlpha: 0, y: -40, duration: 0.45 }, t)
            .to(panels[i + 1], { autoAlpha: 1, y: 0, duration: 0.5 }, t + 0.5)
            .to(domains[i], { autoAlpha: 0, yPercent: -100, duration: 0.4 }, t + 0.2)
            .to(domains[i + 1], { autoAlpha: 1, yPercent: 0, duration: 0.4 }, t + 0.5)
            .to(glows[i], { opacity: 0, duration: 1 }, t)
            .to(glows[i + 1], { opacity: 0.35, duration: 1 }, t)
            .to(names[i], { opacity: 0.35, duration: 0.5 }, t)
            .to(names[i + 1], { opacity: 1, duration: 0.5 }, t + 0.3)
        })
        tl.to({}, { duration: 0.4 }) // a beat on the last store before the pin releases
        tlRef.current = tl

        return () => {
          tlRef.current = null
        }
      })

      return () => mm.revert()
    },
    { scope: ref },
  )

  // Click a store name → glide to its chapter of the pinned timeline
  const jump = (i) => {
    const st = tlRef.current?.scrollTrigger
    if (st && lenis) lenis.scrollTo(st.labelToScroll(`c${i}`) + 2, { duration: 1.4 })
  }

  const current = clients[active]

  return (
    <section ref={ref} className="py-28 md:py-44" aria-labelledby="dayjob-title">
      <div className="container-x flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
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

      {/* Desktop: pinned showcase */}
      <div className="cw-show relative hidden motion-safe:lg:block" style={{ '--brand': current.brand }}>
        <div className="flex h-[100svh] items-center">
          <div className="container-x grid w-full grid-cols-12 items-center gap-10 pt-[calc(var(--nav-h)*0.6)] xl:gap-14">
            {/* left: counter, store list, details */}
            <div className="col-span-5 xl:col-span-4">
              <div className="flex items-end gap-3">
                <span className="type-display block h-[1em] overflow-hidden text-[clamp(5rem,8vw,8.5rem)] !leading-none" aria-hidden="true">
                  <span className="cw-digits block">
                    {clients.map((c, i) => (
                      <span key={c.slug} className="flex h-[1em] items-center">
                        {pad(i + 1)}
                      </span>
                    ))}
                  </span>
                </span>
                <span className="type-label pb-2 text-muted">/ {pad(clients.length)} live stores</span>
              </div>

              <ol className="mt-8 border-t border-line">
                {clients.map((c, i) => (
                  <li key={c.slug} className="relative border-b border-line" style={{ '--b': c.brand }}>
                    <button
                      type="button"
                      onClick={() => jump(i)}
                      className="cw-name flex w-full items-center justify-between gap-4 py-3.5 text-left"
                    >
                      <span className="type-display text-[clamp(1.6rem,2.2vw,2.5rem)]">{c.name}</span>
                      <span className="type-label text-muted">{pad(i + 1)}</span>
                    </button>
                    <span className="cw-bar absolute -bottom-px left-0 h-0.5 w-full origin-left bg-[var(--b)]" />
                  </li>
                ))}
              </ol>

              <div className="mt-8 grid">
                {clients.map((c) => (
                  <div key={c.slug} className="cw-panel col-start-1 row-start-1" style={{ '--b': c.brand }}>
                    <p className="type-label flex items-center gap-2 text-muted">
                      <span className="size-2 rounded-full bg-[var(--b)]" />
                      {c.industry}
                    </p>
                    <p className="mt-3 line-clamp-3 leading-relaxed text-fg/80">{c.summary}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="type-label inline-flex items-center gap-2 border-b border-[var(--b)] pb-1 transition-[gap] duration-500 hover:gap-4"
                      >
                        Visit {c.domain}
                        <ArrowUpRight className="size-4" />
                      </a>
                      <span className="type-label text-muted">{c.stack.slice(1, 3).join(' · ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* right: the browser window */}
            <div className="relative col-span-7 xl:col-span-8">
              {clients.map((c, i) => (
                <span
                  key={c.slug}
                  aria-hidden="true"
                  className="cw-glow pointer-events-none absolute inset-x-[8%] -bottom-10 top-[15%] rounded-full blur-[90px]"
                  style={{ background: c.brand, opacity: i === 0 ? 0.35 : 0 }}
                />
              ))}
              <a
                href={current.url}
                target="_blank"
                rel="noreferrer"
                data-cursor="Visit"
                aria-label={`Visit ${current.name} (opens the live store)`}
                className="group relative block"
              >
                <BrowserFrame
                  address={
                    <span className="relative grid overflow-hidden">
                      {clients.map((c) => (
                        <span key={c.slug} className="cw-domain col-start-1 row-start-1 truncate">
                          {c.domain}
                        </span>
                      ))}
                    </span>
                  }
                >
                  {clients.map((c) => (
                    <Fragment key={c.slug}>
                      <img
                        src={c.image}
                        alt={`${c.name} storefront`}
                        width="1920"
                        height="1080"
                        decoding="async"
                        className="cw-cover absolute inset-0 size-full object-cover"
                      />
                      {c.gallery && (
                        <img
                          src={c.gallery}
                          alt=""
                          aria-hidden="true"
                          width="1920"
                          height="1080"
                          loading="lazy"
                          decoding="async"
                          className="cw-gal absolute inset-0 size-full object-cover"
                        />
                      )}
                    </Fragment>
                  ))}
                </BrowserFrame>
              </a>
              <p className="type-label mt-5 flex items-center justify-between text-muted">
                <span>Scroll to flip through · click to visit</span>
                <span className="flex items-center gap-2">
                  <span className="pulse-dot size-1.5 rounded-full bg-[var(--brand)]" />
                  {current.name}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet: editorial rows */}
      <div className="cw-rows container-x mt-16 grid gap-24 md:mt-24 motion-safe:lg:hidden">
        {clients.map((c, i) => (
          <ClientRow key={c.slug} client={c} index={i} flip={i % 2 === 1} />
        ))}
      </div>

      <div className="container-x">
        <Reveal className="mt-24 md:mt-28 lg:mt-16">
          <Workshop />
        </Reveal>
        <div className="mt-12 flex justify-center">
          <Button to="/work" variant="outline">
            All client & personal work
          </Button>
        </div>
      </div>
    </section>
  )
}
