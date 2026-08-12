import { useGSAP } from "@gsap/react"
import gsap from "gsap"

export const useLoaderAnimation = (refElement, setLoading) => {
  useGSAP(() => {
    const tl = gsap.timeline()

    tl.from('.loader-letter', {
      y: "random(-400, 400)",
      x: "random(-400, 400)",
      duration: 1,
      opacity: 0,
      rotate: -10,
      filter: "blur(10px)",
      scale: 0,
      ease: "back.out(1.7)",
      stagger: 0.1
    })
      .add(() => { }, "+=1.2") // This gives a 1.2 second delay

      .to(".loader-letter", {
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0,
        filter: "blur(8px)",
        duration: 0.2,
        ease: "power3.in",
        stagger: 0.03,
        color: "var(--color-accent)",
      })

      .to('.loader-left', {
        yPercent: -100,
        duration: 1,
        ease: "power3.out",
      })
      .to('.loader-right', {
        yPercent: 100,
        duration: 1,
        ease: "power3.out",
      }, "<")

      .add(() => { setLoading(false) }) // This sets loading to false

  }, { scope: refElement })
}