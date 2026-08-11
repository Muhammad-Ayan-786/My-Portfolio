import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useFooterAnimation = (refElement) => {
  useGSAP(() => {

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".footer-section",
        start: "center 70%",
      },
    });

    tl.from(".footer-heading", {
      y: 100,
      opacity: 0,
      duration: 0.9,
      ease: "back.out(1.4)",
    })
      .from(".footer-link", {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
      }, "-=0.4")

      .from(".letter", {
        y: -40,
        duration: 0.8,
        opacity: 0,
        rotate: -10,
        ease: "back.out(1.7)",
        stagger: {
          each: 0.1,
          from: "end",
        }
      })

      .from('.footer-subtitle', {
        y: -40,
        duration: 0.8,
        opacity: 0,
        rotate: -10,
        ease: "back.out(1.7)",
      }, "-=0.6")

  }, { scope: refElement });
};