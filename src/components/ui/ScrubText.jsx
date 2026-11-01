import { useRef } from 'react'
import { gsap, SplitText, useGSAP, prefersReducedMotion } from '../../lib/gsap'

/** Words light up one by one as you scroll through the paragraph. */
export default function ScrubText({ as: Tag = 'p', className = '', children }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const split = SplitText.create(ref.current, {
        type: 'words',
        autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(
            self.words,
            { opacity: 0.12 },
            {
              opacity: 1,
              stagger: 0.1,
              ease: 'none',
              scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'bottom 45%', scrub: true },
            },
          )
        },
      })
      return () => split.revert()
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
