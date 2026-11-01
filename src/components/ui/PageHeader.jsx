import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap'
import { useIntro } from '../../context/App'
import RevealText from './RevealText'
import SectionLabel from './SectionLabel'

/** Big intro header used by inner pages: giant title + serif accent line. */
export default function PageHeader({ index, label, title, accent, aside, children }) {
  const ref = useRef(null)
  const { play, delay } = useIntro()

  useGSAP(
    () => {
      if (!play || prefersReducedMotion()) return
      gsap.from('.ph-fade', { autoAlpha: 0, y: 30, duration: 1.2, stagger: 0.08, delay: delay + 0.5 })
      gsap.from('.ph-line', { scaleX: 0, duration: 1.6, ease: 'expo.inOut', delay })
    },
    { scope: ref, dependencies: [play] },
  )

  return (
    <header ref={ref} className="container-x pb-16 pt-[calc(var(--nav-h)+4.5rem)] md:pb-24 md:pt-[calc(var(--nav-h)+7rem)]">
      <div className="ph-fade flex items-center justify-between gap-6">
        <SectionLabel index={index}>{label}</SectionLabel>
        {aside && <div className="type-label text-muted">{aside}</div>}
      </div>

      <h1 className="mt-8 md:mt-12">
        <RevealText as="span" type="chars" scroll={false} play={play} delay={delay} className="type-display block text-[clamp(4.2rem,15vw,16.5rem)]">
          {title}
        </RevealText>
        {accent && (
          <RevealText
            as="span"
            scroll={false}
            play={play}
            delay={delay + 0.35}
            className="type-serif block text-[clamp(2.6rem,8vw,8.5rem)] leading-[0.95] text-accent md:pl-[12vw]"
          >
            {accent}
          </RevealText>
        )}
      </h1>

      <div className="ph-line mt-12 h-px origin-left bg-line md:mt-16" />
      {children && <div className="ph-fade mt-10">{children}</div>}
    </header>
  )
}
