import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// Horizontal Projects Show-case Animation
export const useProjectsAnimation = (refElement) => {
  useGSAP((context) => {

    // context helps us to search for elements in scope element
    const track = context.selector('.projects-track')[0]
    const trackDistance = track.scrollWidth - window.innerWidth

    gsap.from('.projects-heading', {
      y: -60,
      duration: 0.8,
      opacity: 0,
      rotate: -10,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: '.projects-heading',
        start: 'top 30%',
      }
    })

    gsap.to(track, {
      x: -trackDistance,
      ease: "none",
      scrollTrigger: {
        trigger: '.projects-wrapper',
        start: 'top 12%',
        end: `+=${trackDistance}`,
        pin: true,
        scrub: 1,
      }
    })

  }, { scope: refElement })
}

// Info Card Animation
export const useProjectCardInfoAnimation = (refElement, showInfo) => {
  useGSAP((context) => {
    const card = context.selector('.info-card')[0]

    if (!card) return

    gsap.killTweensOf(card)

    if (showInfo) {
      gsap.set(card, {
        xPercent: -110,
        opacity: 0,
        visibility: 'visible',
      })

      gsap.to(card, {
        xPercent: 0,
        opacity: 1,
        visibility: 'visible',
        duration: 0.6,
        ease: 'power3.out',
      })
    } else {
      gsap.set(card, {
        visibility: 'visible',
      })

      gsap.to(card, {
        xPercent: -110,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(card, { visibility: 'hidden' })
        },
      })
    }
  }, { scope: refElement, dependencies: [showInfo] })
}