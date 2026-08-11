import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export const useSkillsAnimation = (refElement) => {
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".skills-heading",
        start: "center 50%",
      }
    })

    tl.from('.skills-heading', {
      y: -60,
      duration: 0.8,
      opacity: 0,
      rotate: -10,
      ease: "back.out(1.7)",
    })
      .from('.skills-box', {
        scaleX: 0,
        transformOrigin: "left",
        duration: 0.8,
        ease: "power3.out",
      }, "-=0.3")

      .from(".skills-column", {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "back.out(1.4)",
      }, "-=0.3")

      .from(".skill-tag", {
        y: 20,
        scale: 0.7,
        opacity: 0,
        rotate: -3,
        duration: 0.5,
        stagger: 0.08,
        ease: "back.out(1.7)",
      }, "-=0.2")

  }, { scope: refElement })
}