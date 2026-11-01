import { useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap, useGSAP, isTouch } from '../../lib/gsap'
import { projects } from '../../data/projects'
import SectionLabel from '../../components/ui/SectionLabel'
import RevealText from '../../components/ui/RevealText'
import Reveal from '../../components/ui/Reveal'
import Button from '../../components/ui/Button'
import TransitionLink from '../../components/ui/TransitionLink'

/** Hover list — a floating preview follows the cursor and swaps per row. */
export default function FeaturedWork() {
  const ref = useRef(null)
  const preview = useRef(null)
  const [active, setActive] = useState(0)
  const featured = projects.filter((p) => p.featured)

  useGSAP(
    () => {
      if (isTouch()) return
      gsap.set(preview.current, { xPercent: -50, yPercent: -50, scale: 0, rotate: -8 })
      const xTo = gsap.quickTo(preview.current, 'x', { duration: 0.7, ease: 'power3' })
      const yTo = gsap.quickTo(preview.current, 'y', { duration: 0.7, ease: 'power3' })
      const rTo = gsap.quickTo(preview.current, 'rotate', { duration: 0.9, ease: 'power3' })
      let lastX = 0
      const list = ref.current.querySelector('.fw-list')
      const onMove = (e) => {
        const r = list.getBoundingClientRect()
        const p = preview.current
        // keep the whole preview inside the list (never clipped by the screen edge)
        xTo(gsap.utils.clamp(p.offsetWidth / 2, r.width - p.offsetWidth / 2, e.clientX - r.left))
        yTo(gsap.utils.clamp(p.offsetHeight / 2, r.height - p.offsetHeight / 2, e.clientY - r.top))
        rTo(gsap.utils.clamp(-14, 14, (e.clientX - lastX) * 0.6))
        lastX = e.clientX
      }
      list.addEventListener('pointermove', onMove)
      return () => list.removeEventListener('pointermove', onMove)
    },
    { scope: ref },
  )

  const show = (v) => gsap.to(preview.current, { scale: v ? 1 : 0, duration: 0.8, ease: 'expo.out', overwrite: 'auto' })

  return (
    <section ref={ref} className="container-x py-28 md:py-44" aria-labelledby="work-title">
      <div className="mb-16 flex flex-col justify-between gap-8 md:mb-24 md:flex-row md:items-end">
        <div>
          <SectionLabel index="03">Selected work</SectionLabel>
          <RevealText as="h2" type="chars" id="work-title" className="type-display mt-8 text-[clamp(3.6rem,10vw,11rem)]">
            Things I’ve built
          </RevealText>
        </div>
        <Button to="/work" variant="outline">
          All projects ({String(projects.length).padStart(2, '0')})
        </Button>
      </div>

      <div className="fw-list relative" onPointerEnter={() => show(true)} onPointerLeave={() => show(false)}>
        {/* Floating preview */}
        <div
          ref={preview}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-20 hidden aspect-video w-[min(34vw,480px)] overflow-hidden rounded-2xl shadow-2xl md:block"
        >
          {featured.map((p, i) => (
            <img
              key={p.slug}
              src={p.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover transition-[clip-path,transform] duration-700 ease-expo"
              style={{
                clipPath: i === active ? 'inset(0 0 0 0)' : i < active ? 'inset(0 0 100% 0)' : 'inset(100% 0 0 0)',
                transform: i === active ? 'scale(1)' : 'scale(1.2)',
              }}
            />
          ))}
        </div>

        <Reveal as="ul" className="border-b border-line" stagger={0.1}>
          {featured.map((p, i) => (
            <li key={p.slug} className="border-t border-line">
              <TransitionLink
                to={`/work/${p.slug}`}
                label={p.title}
                data-cursor="View"
                onPointerEnter={() => setActive(i)}
                className="group relative grid grid-cols-12 items-center gap-4 overflow-hidden py-8 md:py-12"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-surface transition-transform duration-700 ease-expo group-hover:scale-y-100" />
                <img
                  src={p.image}
                  alt={`${p.title} preview`}
                  loading="lazy"
                  decoding="async"
                  className="relative col-span-12 mb-2 aspect-video w-full rounded-xl object-cover md:hidden"
                />
                <span className="type-label relative col-span-2 text-muted md:col-span-1">0{i + 1}</span>
                <span className="type-display relative col-span-10 text-[clamp(2.4rem,6.5vw,6.5rem)] transition-transform duration-700 ease-expo group-hover:translate-x-4 md:col-span-6">
                  {p.title}
                </span>
                <span className="type-label relative col-span-6 text-muted md:col-span-2">{p.category}</span>
                <span className="type-label relative col-span-4 text-muted md:col-span-2">{p.stack.slice(0, 2).join(' · ')}</span>
                <span className="relative col-span-2 flex justify-end md:col-span-1">
                  <span className="grid size-12 place-items-center rounded-full border border-line transition-all duration-500 ease-expo group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
                    <ArrowUpRight className="size-5" />
                  </span>
                </span>
              </TransitionLink>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
