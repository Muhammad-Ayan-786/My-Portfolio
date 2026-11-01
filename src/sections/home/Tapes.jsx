import { allSkills } from '../../data/skills'
import { roadmap } from '../../data/roadmap'
import Marquee from '../../components/ui/Marquee'

const Star = () => (
  <svg viewBox="0 0 24 24" className="mx-[0.5em] size-[0.55em] shrink-0" aria-hidden="true">
    <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0Z" fill="currentColor" />
  </svg>
)

/** Two crossed "tapes" of scrolling text — velocity-reactive marquees. */
export default function Tapes() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36" aria-label="Skills">
      <div className="relative -rotate-[4deg] scale-110 bg-accent py-4 text-on-accent md:py-6">
        <Marquee
          items={allSkills}
          speed={50}
          renderItem={(item) => (
            <span className="type-display flex items-center text-[clamp(2.6rem,6vw,6rem)]">
              {item}
              <Star />
            </span>
          )}
        />
      </div>
      <div className="relative -mt-14 rotate-[3deg] scale-110 bg-fg py-4 text-bg md:-mt-20 md:py-6">
        <Marquee
          items={[...roadmap.map((r) => r.title), 'Full-Stack']}
          reverse
          speed={36}
          renderItem={(item, i) => (
            <span className="flex items-center text-[clamp(2.6rem,6vw,6rem)]">
              <span className={i % 2 ? 'type-serif' : 'type-display'}>{item}</span>
              <span className="type-label mx-[1em] !text-[0.18em] opacity-60">→</span>
            </span>
          )}
        />
      </div>
    </section>
  )
}
