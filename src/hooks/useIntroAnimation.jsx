import { useGSAP } from "@gsap/react"
import gsap from 'gsap'

export const useIntroAnimation = (refElement, isLoading) => {
  useGSAP(() => {
    if (isLoading) return

    const tl = gsap.timeline()

    // Navbar
    tl.from('.nav-logo', {
      y: -60,
      duration: 0.8,
      delay: 0.2,
      opacity: 0,
      rotate: -10,
      ease: "back.out(1.7)",
    })
      .from('.nav-link', {
        y: -60,
        duration: 0.8,
        opacity: 0,
        rotate: -10,
        ease: "back.out(1.7)",
        stagger: 0.1
      }, "-=0.6")
      .from('.nav-resume', {
        y: -60,
        duration: 0.8,
        opacity: 0,
        rotate: -10,
        ease: "back.out(1.7)",
      }, "-=0.6")

      // Hero top info
      .from('.hero-top', {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      })

      // Mohd - 1 name
      .from('.letter-mohd', {
        y: 120,
        opacity: 0,
        scale: 0.8,
        rotate: 8,
        duration: 1,
        stagger: 0.08,
        ease: "power4.out"
      }, "-=0.3")

      // underline under Mohd
      .from('.hero-underline', {
        scaleX: 0,
        duration: 0.8,
        ease: 'power3.inOut'
      }, "-=0.6")

      // main photo
      .from('.hero-photo', {
        clipPath: 'inset(0 100% 0 0)',
        scale: 1.08,
        duration: 1.2,
        ease: 'power4.inOut'
      })

      // photo label (01 / ME)
      .from('.hero-photo-label', {
        scale: 0,
        rotation: -8,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
      }, "-=0.7")

      // Ayan - 2 name
      .from('.letter-ayan', {
        x: 180,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "power4.out"
      }, "-=0.7")

      // role - Frontend Developer
      .from('.hero-tag', {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: "power4.out"
      }, "-=0.4")

      .from('.hero-making', {
        y: 15,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out"
      }, "-=0.4")

      // typewriter container
      .from('.hero-typewriter', {
        y: 15,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.3")

      // paragraph
      .from('.hero-paragraph', {
        y: 25,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.3")

      // projects & view resume
      .from('.hero-actions', {
        y: 25,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      }, "-=0.35")

      .from('.hero-meta', {
        opacity: 0,
        y: 10,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.2")

  }, { scope: refElement, dependencies: [isLoading] })
}
