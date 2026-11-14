import { useEffect, useRef } from 'react'
import { gsap, isTouch, prefersReducedMotion } from '../../lib/gsap'

/*
 * The hero character. Two cut-out layers (public/character/head.webp + body.webp, same canvas)
 * so the head can move on the neck, with the eyes redrawn as SVG on top of the head so the
 * irises can travel inside the eye openings.
 *
 * All numbers below are in the artwork's own pixel space (W × H). If the artwork is replaced,
 * re-measure these and nothing else needs to change.
 */
const W = 736
const H = 1010
const NECK = { x: 349, y: 650 } // the head pivots here
// The eyes were traced on a 4× zoom of the region starting at (240, 320)
const EYE_SPACE = 'translate(240 320) scale(0.25)'
const EYES = [
  {
    id: 'l',
    cx: 315,
    cy: 258,
    r: 100,
    open: 'M118,262 C135,180 220,128 295,130 C370,132 428,175 433,245 C435,290 433,330 428,347 C380,352 300,350 230,335 C170,320 125,295 118,262 Z',
    box: [110, 120, 330, 240], // x, y, w, h of the opening (for the lid)
  },
  {
    id: 'r',
    cx: 785,
    cy: 322,
    r: 98,
    open: 'M668,330 C668,275 720,215 815,208 C900,205 965,270 978,350 C980,385 970,405 950,410 C880,418 780,412 720,398 C690,390 668,370 668,330 Z',
    box: [660, 198, 326, 226],
  },
]
const LOOK = { x: 52, y: 34 } // how far an iris may travel (zoom units)

// Artwork colours (sampled from the illustration, so the redrawn eyes blend in)
const ART = { lid: '#e3a98d', lash: '#2a1a16', white: '#deddda', shade: '#8d8789', irisRim: '#3b2208', irisOut: '#b0702a', irisIn: '#dfa955', pupil: '#0d0806' }

/**
 * Follows the cursor with his eyes first and his head a beat later, blinks, breathes,
 * and looks around by himself when there is no cursor (touch screens, or the mouse has left).
 */
export default function Character({ active = true, className = '' }) {
  const root = useRef(null)
  const activeRef = useRef(active)

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = root.current
    const head = el.querySelector('.ch-head')
    const body = el.querySelector('.ch-body')
    const irises = [...el.querySelectorAll('.ch-iris')]
    const lids = [...el.querySelectorAll('.ch-lid')]
    const touch = isTouch()

    const ptr = { x: 0, y: 0, moved: -1e9, away: true }
    const look = { x: 0, y: 0 } // smoothed eye target, −1…1
    const pose = { x: 0, y: 0 } // smoothed head target, −1…1
    let nod = 0

    const onMove = (e) => {
      ptr.x = e.clientX
      ptr.y = e.clientY
      ptr.moved = performance.now()
      ptr.away = false
    }
    const onLeave = () => (ptr.away = true)

    // Blink: lids slide down inside the eye openings
    gsap.set(lids, { yPercent: -102 })
    const blink = (twice) => {
      const tl = gsap.timeline()
      tl.to(lids, { yPercent: 0, duration: 0.07, ease: 'power2.in' }).to(lids, { yPercent: -102, duration: 0.13, ease: 'power2.out' })
      if (twice) tl.to(lids, { yPercent: 0, duration: 0.07, ease: 'power2.in' }, '+=0.09').to(lids, { yPercent: -102, duration: 0.13, ease: 'power2.out' })
    }
    let blinkTimer = gsap.delayedCall(2, function loop() {
      if (activeRef.current) blink(Math.random() < 0.2)
      blinkTimer = gsap.delayedCall(2.4 + Math.random() * 3.6, loop)
    })
    const onDown = () => {
      blink(false)
      nod = 1
    }

    const tick = (time) => {
      if (!activeRef.current) return
      const r = el.getBoundingClientRect()
      const now = performance.now()
      // where to look, relative to the face: −1…1 (and beyond, clamped later)
      let tx
      let ty
      if (touch || ptr.away || now - ptr.moved > 5000) {
        tx = Math.sin(time * 0.5) * 0.75 + Math.sin(time * 1.3) * 0.2
        ty = Math.sin(time * 0.37 + 1) * 0.35
      } else {
        const fx = r.left + r.width * 0.5
        const fy = r.top + r.height * 0.38 // eye line
        tx = (ptr.x - fx) / (window.innerWidth * 0.42)
        ty = (ptr.y - fy) / (window.innerHeight * 0.42)
      }
      // the page sliding up over the hero pulls his gaze down
      ty += Math.min(1, window.scrollY / window.innerHeight) * 1.2
      const len = Math.hypot(tx, ty)
      if (len > 1) (tx /= len), (ty /= len)

      look.x += (tx - look.x) * 0.22
      look.y += (ty - look.y) * 0.22
      pose.x += (tx - pose.x) * 0.06
      pose.y += (ty - pose.y) * 0.06
      nod *= 0.9

      for (const iris of irises) iris.setAttribute('transform', `translate(${(look.x * LOOK.x).toFixed(2)} ${(look.y * LOOK.y).toFixed(2)})`)

      const breath = Math.sin(time * 1.6)
      head.style.transform = `translate3d(${(pose.x * 1.1).toFixed(3)}%, ${(pose.y * 0.5 + breath * -0.16 + nod * 0.9).toFixed(3)}%, 0) rotate(${(pose.x * 4.2).toFixed(3)}deg)`
      body.style.transform = `translate3d(${(pose.x * 0.25).toFixed(3)}%, 0, 0) scaleY(${(1 + breath * 0.004).toFixed(4)})`
    }

    gsap.ticker.add(tick)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      gsap.ticker.remove(tick)
      blinkTimer.kill()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={root} aria-hidden="true" className={`relative select-none ${className}`} style={{ aspectRatio: `${W} / ${H}` }}>
      <div
        className="ch-head absolute inset-0 will-change-transform"
        style={{ transformOrigin: `${(NECK.x / W) * 100}% ${(NECK.y / H) * 100}%` }}
      >
        <img src="/character/head.webp" alt="" width={W} height={H} decoding="async" draggable="false" className="absolute inset-0 size-full" />
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full">
          <defs>
            <linearGradient id="ch-white" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={ART.shade} />
              <stop offset="0.34" stopColor={ART.white} />
              <stop offset="1" stopColor="#eeeeec" />
            </linearGradient>
            <radialGradient id="ch-iris">
              <stop offset="0.55" stopColor={ART.irisRim} />
              <stop offset="0.7" stopColor={ART.irisOut} />
              <stop offset="0.86" stopColor={ART.irisIn} />
              <stop offset="0.96" stopColor={ART.irisOut} />
              <stop offset="1" stopColor={ART.irisRim} />
            </radialGradient>
            {/* the upper lid shades the top of the eyeball */}
            <linearGradient id="ch-shade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1a100c" stopOpacity="0.62" />
              <stop offset="0.42" stopColor="#1a100c" stopOpacity="0.12" />
              <stop offset="0.7" stopColor="#1a100c" stopOpacity="0" />
            </linearGradient>
            <filter id="ch-soft" x="-5%" y="-5%" width="110%" height="110%">
              <feGaussianBlur stdDeviation="1.6" />
            </filter>
            {EYES.map((e) => (
              <clipPath key={e.id} id={`ch-open-${e.id}`}>
                <path d={e.open} />
              </clipPath>
            ))}
          </defs>
          <g transform={EYE_SPACE}>
            {EYES.map((e) => (
              <g key={e.id} clipPath={`url(#ch-open-${e.id})`}>
                {/* eye white (covers the painted iris) */}
                <path d={e.open} fill="url(#ch-white)" />
                {/* iris + pupil — this group is what moves */}
                <g className="ch-iris">
                  <circle cx={e.cx} cy={e.cy} r={e.r} fill="url(#ch-iris)" />
                  <circle cx={e.cx} cy={e.cy} r={e.r * 0.8} fill="none" stroke="#f3cf8a" strokeOpacity="0.5" strokeWidth={e.r * 0.26} strokeDasharray="2.5 5" />
                  <circle cx={e.cx} cy={e.cy} r={e.r * 0.62} fill={ART.pupil} />
                  <circle cx={e.cx} cy={e.cy} r={e.r - 2} fill="none" stroke={ART.irisRim} strokeWidth="5" />
                  <ellipse cx={e.cx + e.r * 0.36} cy={e.cy - e.r * 0.4} rx={e.r * 0.2} ry={e.r * 0.15} fill="#fff" opacity="0.92" transform={`rotate(-30 ${e.cx + e.r * 0.36} ${e.cy - e.r * 0.4})`} />
                  <circle cx={e.cx - e.r * 0.34} cy={e.cy + e.r * 0.4} r={e.r * 0.07} fill="#fff" opacity="0.5" />
                </g>
                {/* shadow under the upper lid + a faint rim so the eyeball sits in the socket */}
                <path d={e.open} fill="url(#ch-shade)" />
                <path d={e.open} fill="none" stroke="#1a100c" strokeOpacity="0.22" strokeWidth="18" filter="url(#ch-soft)" />
                {/* eyelid for blinking */}
                <g className="ch-lid" style={{ transformBox: 'fill-box' }}>
                  {/* lid with a curved lower edge + lash line; the extra 44 lets the curve reach the lower lid */}
                  <path
                    d={`M${e.box[0]},${e.box[1] - 4} h${e.box[2]} v${e.box[3]} q${-e.box[2] / 2},88 ${-e.box[2]},0 z`}
                    fill={ART.lid}
                    stroke={ART.lash}
                    strokeWidth="12"
                  />
                </g>
              </g>
            ))}
          </g>
        </svg>
      </div>
      <img
        src="/character/body.webp"
        alt=""
        width={W}
        height={H}
        decoding="async"
        draggable="false"
        className="ch-body absolute inset-0 size-full origin-bottom will-change-transform"
      />
    </div>
  )
}
