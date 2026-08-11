import { useGSAP } from "@gsap/react"
import gsap from 'gsap'

export const useIntroAnimation = (refElement, isLoading) => {
  useGSAP(() => {
    if (isLoading) return

    const tl = gsap.timeline()

    tl.from('.nav-logo', {
      y: -60,
      duration: 0.8,
      delay: 0.2,
      opacity: 0,
      rotate: -10,
      ease: "back.out(1.7)",
    }).from('.nav-link', {
      y: -60,
      duration: 0.8,
      opacity: 0,
      rotate: -10,
      ease: "back.out(1.7)",
      stagger: 0.1
    }, "-=0.6").from('.nav-resume', {
      y: -60,
      duration: 0.8,
      opacity: 0,
      rotate: -10,
      ease: "back.out(1.7)",
    }, "-=0.6").from('.letter', {
      y: 40,
      duration: 0.8,
      opacity: 0,
      ease: "back.out(1.7)",
      stagger: 0.05
    }, "-=0.3").from('.hero-underline', {
      scaleX: 0,
      duration: 0.8,
      ease: 'power3.inOut'
    }, "-=0.6").from('.hero-tag', {
      y: 20,
      opacity: 0,
      duration: 0.6
    }, "-=0.3").from('.hero-typewriter', {
      y: 20,
      opacity: 0,
      duration: 0.6
    }, "-=0.3").from('.hero-paragraph', {
      y: 20,
      opacity: 0,
      duration: 0.6
    }, "-=0.3").from('.hero-photo', {
      clipPath: 'inset(0 100% 0 0)',
      duration: 1,
      ease: 'power2.inOut'
    }, "-=0.3")
  }, { scope: refElement, dependencies: [isLoading] })
}
