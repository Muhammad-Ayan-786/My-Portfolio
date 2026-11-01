import { createContext, useCallback, useContext, useState } from 'react'
import { flushSync } from 'react-dom'
import { prefersReducedMotion } from '../lib/gsap'

const ThemeContext = createContext(null)
const STORAGE_KEY = 'ma-theme'

const readTheme = () => document.documentElement.dataset.theme || 'dark'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readTheme)

  /** Switch theme with a circular reveal from the click position. */
  const toggleTheme = useCallback(
    (event) => {
      const next = theme === 'dark' ? 'light' : 'dark'
      const apply = () => {
        document.documentElement.dataset.theme = next
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#0c0b10' : '#efeae0')
        try {
          localStorage.setItem(STORAGE_KEY, next)
        } catch {
          /* storage unavailable — theme still applies for this visit */
        }
        flushSync(() => setTheme(next))
      }

      if (!document.startViewTransition || prefersReducedMotion()) return apply()

      const x = event?.clientX ?? window.innerWidth / 2
      const y = event?.clientY ?? 0
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

      const transition = document.startViewTransition(apply)
      transition.ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 1000, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', pseudoElement: '::view-transition-new(root)' },
        )
      })
    },
    [theme],
  )

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
