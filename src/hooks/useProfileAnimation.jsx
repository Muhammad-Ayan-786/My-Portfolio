import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export const useProfileAnimation = (refElement) => {
  useGSAP(() => {

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#profile-card",
        start: "top 40%",
      }
    })


    // title
    tl.from('.profile-title', {
      y: 100,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    })

      // vertical quote line
      .from('.profile-bar', {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 0.8,
        ease: 'power3.inOut',
      }, '-=0.5')

      // quote
      .from('.profile-quote', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.5')

      // label
      .from('.profile-label', {
        y: 30,
        opacity: 0,
        duration: 0.5,
      }, '-=0.4')

      // bio card
      .from('.profile-bio', {
        x: 100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.7')

      // info
      .from('.profile-info > div', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.4')


  }, { scope: refElement })
}