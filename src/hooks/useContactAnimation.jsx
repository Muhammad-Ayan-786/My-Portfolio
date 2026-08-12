import { useGSAP } from "@gsap/react"
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const useContactAnimation = (refElement) => {
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.contact-section',
        start: "top 50%",
      }
    })

    tl.from(".contact-label", {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "back.out(1.4)",
    })
      .from(".contact-heading", {
        clipPath: "inset(0 0 100% 0)",
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      }, "-=0.2")

      .from(".contact-description", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      }, "-=0.6")

      .from(".contact-link", {
        x: -80,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.4)",
        stagger: 0.1
      }, "-=0.4")

      .from('.contact-link-label', {
        x: 80,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.4)",
        stagger: 0.1
      }, "-=0.4")

      .from(".contact-form", {
        x: 100,
        opacity: 0,
        duration: 0.9,
        ease: "back.out(1.4)",
      }, "-=0.6")

      .from(".contact-field", {
        y: 30,
        x: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
      })

      .from(".contact-submit", {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
      }, "-=0.2")

      .from(".contact-form-shadow", {
        scale: 0.85,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      }, "-=0.7")

  }, { scope: refElement })
}