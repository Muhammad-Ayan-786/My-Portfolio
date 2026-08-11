import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { timelineEntries } from "../data/journey"

gsap.registerPlugin(ScrollTrigger)

export const useTimeLineAnimation = (refElement) => {
  useGSAP(() => {

    gsap.from('.evolution-heading', {
      y: -60,
      duration: 0.8,
      opacity: 0,
      rotate: -10,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: '.evolution-heading',
        start: 'center 75%',
      }
    })

    gsap.from('.timeline-line', {
      scaleY: 0,
      scrollTrigger: {
        trigger: '.timeline-line',
        start: 'center 50%',
        end: 'bottom -40%',
        scrub: 1
      }
    })


    timelineEntries.forEach((entry, idx) => {
      gsap.from(`#timeline-item-${idx} .timeline-marker`, {
        scale: 0,
        duration: 0.4,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: `#timeline-item-${idx}`,
          start: 'top 75%',
          end: 'bottom 25%',
          scrub: 1
        }
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: `#timeline-item-${idx}`,
          start: 'top 75%',
          end: 'bottom 50%',
          scrub: 1
        }
      })

      tl.from(`#timeline-item-${idx} .timeline-tag`, {
        y: 15,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.15
      }).from(`#timeline-item-${idx} .timeline-title`, {
        y: 15,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, "-=0.3").from(`#timeline-item-${idx} .timeline-desc`, {
        y: 15,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, "-=0.3")
    })


  }, { scope: refElement })
}