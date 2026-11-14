import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { prefersReducedMotion } from '../../lib/gsap'

/* Ashima 3D simplex noise */
const noise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`

const vertex = /* glsl */ `
uniform float uTime;
uniform float uDistort;
uniform float uFreq;
varying vec3 vNormal;
varying vec3 vView;
varying float vNoise;
${noise}
vec3 displace(vec3 p){
  float n = snoise(p * uFreq + vec3(uTime * .22));
  float n2 = snoise(p * uFreq * 2.1 - vec3(uTime * .13)) * .18;
  return p + normalize(p) * (n + n2) * uDistort;
}
void main(){
  vec3 pos = displace(position);
  // recompute normal from neighbouring displaced points
  vec3 up = abs(normal.y) > .99 ? vec3(1.,0.,0.) : vec3(0.,1.,0.);
  vec3 t = normalize(cross(normal, up));
  vec3 b = normalize(cross(normal, t));
  float e = .01;
  vec3 nA = displace(position + t * e);
  vec3 nB = displace(position + b * e);
  vec3 n = normalize(cross(nA - pos, nB - pos));
  if (dot(n, normal) < 0.) n = -n;
  vNoise = snoise(position * uFreq + vec3(uTime * .22));
  vec4 mv = modelViewMatrix * vec4(pos, 1.);
  vView = normalize(-mv.xyz);
  vNormal = normalize(normalMatrix * n);
  gl_Position = projectionMatrix * mv;
}`

const fragment = /* glsl */ `
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vView;
varying float vNoise;
void main(){
  vec3 N = normalize(vNormal);
  float fres = pow(1. - clamp(dot(N, vView), 0., 1.), 2.4);
  float t = smoothstep(-.55, .75, vNoise);
  vec3 col = mix(uA, uB, t);
  float bands = sin(vNoise * 7. + uTime * .5) * .5 + .5;
  col = mix(col, uC, bands * bands * .16);
  vec3 L = normalize(vec3(.5, .7, .9));
  float diff = clamp(dot(N, L), 0., 1.);
  float spec = pow(clamp(dot(reflect(-L, N), vView), 0., 1.), 28.);
  col *= .45 + .75 * diff;
  col += spec * uC * .55;
  col += fres * mix(uB, uC, .35) * .85;
  gl_FragColor = vec4(col, 1.);
}`

const readColor = (name) => new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#ffffff')

/**
 * Hero centrepiece: a liquid, noise-displaced sphere with iridescent
 * shading, wrapped in a slowly orbiting particle ring. Follows the pointer,
 * re-tints on theme change and pauses when off-screen.
 */
export default function HeroScene({ active = true, className = '' }) {
  const mount = useRef(null)
  const activeRef = useRef(active)
  const controls = useRef(null)

  useEffect(() => {
    const el = mount.current
    const reduced = prefersReducedMotion()
    const mobile = window.innerWidth < 768

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 1.75))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    camera.position.set(0, 0, 6)

    const uniforms = {
      uTime: { value: 0 },
      uDistort: { value: 0.24 },
      uFreq: { value: 0.85 },
      uA: { value: readColor('--blob-a') },
      uB: { value: readColor('--blob-b') },
      uC: { value: readColor('--blob-c') },
    }

    const blob = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.25, mobile ? 28 : 64),
      new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms }),
    )
    const group = new THREE.Group()
    group.add(blob)

    // Particle ring
    const count = mobile ? 900 : 1800
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 2.1 + Math.pow(Math.random(), 2) * 1.6
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.35 * radius * 0.4
      positions[i * 3 + 2] = Math.sin(angle) * radius
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const pMat = new THREE.PointsMaterial({
      size: mobile ? 0.022 : 0.018,
      color: readColor('--particles'),
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      sizeAttenuation: true,
    })
    const ring = new THREE.Points(pGeo, pMat)
    ring.rotation.set(0.42, 0, 0.18)
    group.add(ring)
    scene.add(group)

    // Resize
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el
      renderer.setSize(w, h, false)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    resize()

    // Theme re-tint
    const mo = new MutationObserver(() => {
      uniforms.uA.value = readColor('--blob-a')
      uniforms.uB.value = readColor('--blob-b')
      uniforms.uC.value = readColor('--blob-c')
      pMat.color = readColor('--particles')
      if (reduced) renderer.render(scene, camera)
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    // Pointer
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, energy: 0 }
    let lastX = 0
    let lastY = 0
    const onMove = (e) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1
      const speed = Math.hypot(e.clientX - lastX, e.clientY - lastY)
      pointer.energy = Math.min(1, pointer.energy + speed / 600)
      lastX = e.clientX
      lastY = e.clientY
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    // Loop — only while visible
    let elapsed = 0
    let last = 0
    let raf = 0
    let running = false
    const tick = () => {
      const now = performance.now()
      elapsed += Math.min(0.05, (now - last) / 1000)
      last = now
      const t = elapsed
      pointer.x += (pointer.tx - pointer.x) * 0.045
      pointer.y += (pointer.ty - pointer.y) * 0.045
      pointer.energy *= 0.96
      uniforms.uTime.value = t
      uniforms.uDistort.value = 0.22 + pointer.energy * 0.18 + Math.sin(t * 0.6) * 0.03
      group.rotation.y = t * 0.12 + pointer.x * 0.55
      group.rotation.x = pointer.y * 0.35
      ring.rotation.y = -t * 0.08
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    let visible = false
    const start = () => {
      if (running || reduced || !visible || !activeRef.current || document.hidden) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      visible ? start() : stop()
    })
    io.observe(el)
    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)
    controls.current = { start, stop }

    // Compile shaders + draw one frame now, so the reveal has no hitch
    renderer.compile(scene, camera)
    renderer.render(scene, camera)

    // Fade in once the first frame is drawn
    requestAnimationFrame(() => el.classList.add('opacity-100'))

    return () => {
      stop()
      controls.current = null
      io.disconnect()
      ro.disconnect()
      mo.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVisibility)
      blob.geometry.dispose()
      blob.material.dispose()
      pGeo.dispose()
      pMat.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  // Runs only once the page is revealed (keeps the preloader smooth) and while the hero is uncovered
  useEffect(() => {
    activeRef.current = active
    if (active) controls.current?.start()
    else controls.current?.stop()
  }, [active])

  return <div ref={mount} aria-hidden="true" className={`opacity-0 transition-opacity duration-[1.6s] ${className}`} />
}
