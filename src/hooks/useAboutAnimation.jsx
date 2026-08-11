import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export const useAboutAnimation = (refElement) => {
  useGSAP(() => {

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".about-heading",
        start: "center 40%",
      }
    })

    tl.from('.about-heading', {
      y: -60,
      duration: 0.8,
      opacity: 0,
      rotate: -10,
      ease: "back.out(1.7)",
    }).from('.quote-line', {
      scaleY: 0,
      transformOrigin: "top",
      duration: 0.5,
      opacity: 0,
      ease: "power3.out",
    }, "-=0.4").from('.about-quote', {
      clipPath: "inset(0 100% 0 0)",
      duration: 0.8,
      opacity: 0,
      ease: "back.out(1.7)",
    }, "-=0.5").from('.about-box', {
      clipPath: "inset(0 100% 0 0)",
      duration: 0.8,
      opacity: 0,
      ease: "power3.out",
    }).from('.about-box-content', {
      y: 40,
      duration: 0.8,
      opacity: 0,
      ease: "back.out(1.7)",
    }, "-=0.5")
  }, { scope: refElement })
}