import React, { useEffect, useRef } from 'react'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger)

const CustomCursor = () => {

  const cursorRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current

    // .quickTo is a gsap helper function
    // that smoothly moves the element to
    // a final position, like I'm moving in
    // perspective of 'x'
    const xTo = gsap.quickTo(cursor, 'x', {
      duration: 0.4,
      ease: 'back.out(1.7)',
    })

    const yTo = gsap.quickTo(cursor, 'y', {
      duration: 0.4,
      ease: 'back.out(1.7)',
    })

    const moveCursorFunc = e => {
      xTo(e.clientX)
      yTo(e.clientY)
    }

    window.addEventListener('mousemove', moveCursorFunc)


    /*
    .create - don't animate an element for me, just watch this section while I scroll
    and tell me when certain things happen. And for that certain things, I'm using
    onEnter, onLeave, onEnterBack, and onLeaveBack
    */
    ScrollTrigger.create({
      // .create is tracking Scrolling on hero section
      // and showing cursor on different positions
      trigger: '#hero',
      start: 'top -75%',
      end: 'bottom bottom',

      // When curson is inside hero section
      onEnter: () => gsap.to(cursor, {
        opacity: 0,
        duration: 0.2,
        ease: 'power3.out',
      }),

      // When cursor leaves hero section
      onLeave: () => gsap.to(cursor, {
        opacity: 0,
        duration: 0.2,
        ease: 'power3.out',
      }),

      // When cursor comes back to hero section
      onEnterBack: () => gsap.to(cursor, {
        opacity: 1,
        duration: 0.2,
        ease: 'power3.out',
      }),

      // When cursor leaves hero section again
      onLeaveBack: () => gsap.to(cursor, {
        opacity: 1,
        duration: 0.2,
        ease: 'power3.out',
      }),
    })


    return () => removeEventListener('mousemove', moveCursorFunc)
  }, [])

  return (
    <div
      ref={cursorRef}
      className="
        fixed
        top-0
        left-0
        w-5
        h-5
        bg-[#CCFF00]
        rounded-full
        pointer-events-none
        z-999
        -translate-x-1/2
        -translate-y-1/2
      "
    />
  )
}

export default CustomCursor