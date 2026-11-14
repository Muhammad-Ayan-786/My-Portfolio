import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap'
import BrowserFrame from './BrowserFrame'
import Button from '../ui/Button'

/**
 * Editorial row for one live store: a big browser window on one side, the story on the other.
 * `flip` swaps the sides (zig-zag). Hover the window: brand glow + the second screen wipes in.
 */
export default function ClientRow({ client, index, flip = false }) {
  const ref = useRef(null)
  const num = String(index + 1).padStart(2, '0')

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px)', () => {
        // window drifts against the scroll, number drifts with it — depth without distraction
        gsap.fromTo('.cr-frame', { y: 70, rotate: flip ? -1.5 : 1.5 }, {
          y: -50,
          rotate: 0,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
      gsap.from('.cr-copy > *', {
        y: 50,
        opacity: 0,
        stagger: 0.07,
        duration: 1.2,
        scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <article ref={ref} className="group grid items-center gap-10 lg:grid-cols-12 lg:gap-16" style={{ '--brand': client.brand }}>
      <a
        href={client.url}
        target="_blank"
        rel="noreferrer"
        data-cursor="Visit"
        aria-label={`Visit ${client.name} (opens the live store)`}
        className={`cr-frame relative block lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}
      >
        <span className="pointer-events-none absolute inset-x-[10%] -bottom-8 top-[20%] rounded-full bg-[var(--brand)] opacity-20 blur-[80px] transition-opacity duration-700 ease-expo group-hover:opacity-50" />
        <BrowserFrame address={client.domain} className="transition-transform duration-700 ease-expo group-hover:-translate-y-2">
          <img
            src={client.image}
            alt={`${client.name} storefront`}
            width="1920"
            height="1080"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover transition-transform duration-1000 ease-expo group-hover:scale-[1.03]"
          />
          {client.gallery && (
            <img
              src={client.gallery}
              alt=""
              aria-hidden="true"
              width="1920"
              height="1080"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover transition-[clip-path] duration-1000 ease-expo [clip-path:inset(0_0_0_100%)] group-hover:[clip-path:inset(0_0_0_0)]"
            />
          )}
        </BrowserFrame>
      </a>

      <div className={`relative lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}>
        <div className="cr-copy relative">
          <div className="flex items-end gap-4 border-b border-line pb-4">
            <span aria-hidden="true" className="cr-num type-display text-stroke select-none text-[clamp(4.5rem,7vw,7rem)] !leading-[0.8]">
              {num}
            </span>
            <p className="type-label mb-1 flex items-center gap-2 text-muted">
              <span className="size-2 rounded-full bg-[var(--brand)]" />
              {client.industry}
            </p>
          </div>
          <h3 className="type-display mt-5 text-[clamp(3rem,5.6vw,6rem)] transition-colors duration-500 group-hover:text-[var(--brand)]">
            {client.name}
          </h3>
          <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-fg/80">{client.summary}</p>
          <ul className="mt-7 grid gap-2.5 border-t border-line pt-6">
            {client.highlights.map((h) => (
              <li key={h} className="flex items-center gap-3">
                <span className="h-px w-5 shrink-0 bg-[var(--brand)]" />
                {h}
              </li>
            ))}
          </ul>
          <ul className="mt-6 flex flex-wrap gap-1.5">
            {client.stack.map((t) => (
              <li key={t} className="type-label rounded-full border border-line px-3 py-1.5">
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button href={client.url} target="_blank" rel="noreferrer" variant="outline">
              Visit live store
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
