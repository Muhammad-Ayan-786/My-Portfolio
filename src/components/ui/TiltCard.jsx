import { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react'

/** 3D tilt + moving glare, driven by Motion springs. */
export default function TiltCard({ max = 14, className = '', children, ...rest }) {
  const ref = useRef(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const spring = { stiffness: 160, damping: 18, mass: 0.6 }
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring)
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring)
  const gx = useTransform(px, (v) => `${v * 100}%`)
  const gy = useTransform(py, (v) => `${v * 100}%`)
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgb(255 255 255 / 0.22), transparent 55%)`

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <div className="[perspective:1200px]">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={`relative will-change-transform ${className}`}
        {...rest}
      >
        {children}
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay" style={{ background: glare }} />
      </motion.div>
    </div>
  )
}
