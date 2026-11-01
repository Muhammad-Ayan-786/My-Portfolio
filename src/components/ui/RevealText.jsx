import { useEffect, useRef } from 'react'
import { gsap, SplitText, useGSAP, prefersReducedMotion } from '../../lib/gsap'

/**
 * Masked text reveal powered by GSAP SplitText.
 *
 * type    'lines' | 'words' | 'chars'
 * scroll  true  → plays when scrolled into view
 *         false → plays when `play` becomes true (used for page intros)
 */
export default function RevealText({
  as: Tag = 'div',
  type = 'lines',
  scroll = true,
  play = true,
  delay = 0,
  stagger,
  duration = 1.25,
  start = 'top 88%',
  rotate = 0,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null)
  const anim = useRef(null)
  const playRef = useRef(play)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const split = SplitText.create(ref.current, {
        type: type === 'lines' ? 'lines' : `lines,${type}`,
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit(self) {
          const targets = self[type]
          const tween = gsap.from(targets, {
            yPercent: 115,
            rotate,
            transformOrigin: '0% 100%',
            duration,
            delay,
            stagger: stagger ?? (type === 'chars' ? 0.028 : type === 'words' ? 0.04 : 0.1),
            ease: 'expo.out',
            paused: !scroll && !playRef.current,
            scrollTrigger: scroll ? { trigger: ref.current, start, once: true } : undefined,
          })
          anim.current = tween
          return tween
        },
      })
      return () => split.revert()
    },
    { scope: ref },
  )

  useEffect(() => {
    playRef.current = play
    if (!scroll && play) anim.current?.play()
  }, [play, scroll])

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}
