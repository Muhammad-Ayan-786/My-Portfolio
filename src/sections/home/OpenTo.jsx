import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../../lib/gsap'
import { services } from '../../data/services'
import { site } from '../../data/site'
import SectionLabel from '../../components/ui/SectionLabel'
import RevealText from '../../components/ui/RevealText'
import Reveal from '../../components/ui/Reveal'
import Button from '../../components/ui/Button'
import TransitionLink from '../../components/ui/TransitionLink'

/**
 * "Hire me for —" with a word-roll that cycles through everything I'm open to,
 * then the offers as quick links into the Services page / contact form.
 */
export default function OpenTo() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const words = gsap.utils.toArray('.ot-word')
      if (prefersReducedMotion() || words.length < 2) return
      gsap.set(words, { yPercent: 110 })
      gsap.set(words[0], { yPercent: 0 })

      // A self-scheduling chain instead of a repeating timeline: every step swaps
      // current → next in one motion, so the wrap from the last phrase back to the
      // first is identical to every other step (no blank beat at the loop seam).
      let i = 0
      const swap = () => {
        const cur = words[i]
        i = (i + 1) % words.length
        gsap.to(cur, { yPercent: -110, duration: 0.8, ease: 'expo.inOut', overwrite: true })
        gsap.fromTo(words[i], { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: 'expo.inOut', overwrite: true })
        next.restart(true)
      }
      const next = gsap.delayedCall(2.2, swap).pause()

      // only spin while on screen
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (self.isActive ? next.restart(true) : next.pause()),
      })
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="container-x pb-28 pt-10 md:pb-44" aria-labelledby="opento-title">
      <div className="relative overflow-hidden rounded-4xl border border-line bg-surface p-8 md:p-14 xl:p-20">
        <div className="pointer-events-none absolute -right-1/4 -top-1/2 size-[70%] rounded-full bg-accent/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-1/2 -left-1/4 size-[60%] rounded-full bg-accent-2/20 blur-[120px]" />

        <div className="relative flex items-center justify-between gap-6">
          <SectionLabel index="05">Open to work</SectionLabel>
          <span className="type-label hidden items-center gap-2 rounded-full bg-fg px-3 py-1.5 text-bg sm:flex">
            <span className="pulse-dot size-1.5 rounded-full bg-accent" />
            Available now
          </span>
        </div>

        <h2 id="opento-title" className="relative mt-10">
          <RevealText as="span" type="chars" className="type-display block text-[clamp(3.6rem,10vw,11rem)]">
            Hire me for
          </RevealText>
          <span className="type-serif grid overflow-hidden pb-[0.12em] text-[clamp(2.6rem,7.2vw,8rem)] leading-[1.02] text-accent">
            {services.map((s, i) => (
              <span key={s.id} className="ot-word col-start-1 row-start-1 block whitespace-nowrap" aria-hidden={i > 0 ? true : undefined}>
                {s.rotator}.
              </span>
            ))}
          </span>
          <span className="sr-only">{services.map((s) => s.rotator).join(', ')}.</span>
        </h2>

        <div className="relative mt-14 grid gap-10 border-t border-line pt-10 lg:grid-cols-12">
          <Reveal as="ul" className="flex flex-wrap content-start gap-2 lg:col-span-7" stagger={0.05}>
            {services.map((s) => (
              <li key={s.id}>
                <TransitionLink
                  to={`/contact?interest=${encodeURIComponent(s.interest)}`}
                  label="Contact"
                  className={`group type-label flex items-center gap-2 rounded-full border px-4 py-2.5 transition-colors duration-500 hover:border-accent hover:bg-accent hover:text-on-accent ${s.id === 'job' ? 'border-fg bg-fg text-bg' : 'border-line'
                    }`}
                >
                  {s.title}
                  <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:rotate-45" />
                </TransitionLink>
              </li>
            ))}
          </Reveal>
          <Reveal className="lg:col-span-5">
            <p className="text-lg leading-relaxed text-fg/80">
              Hiring for a full-time or part-time role? That’s my top priority right now. Need a store, a portfolio or a product built? I take on
              freelance work too — based in {site.location.city}, working remotely.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/services">See services</Button>
              {site.resume && (
                <Button href={site.resume} variant="outline" target="_blank" rel="noreferrer" icon={false}>
                  Résumé
                </Button>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
