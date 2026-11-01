import { AnimatePresence, motion } from 'motion/react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/Theme'
import Magnetic from '../ui/Magnetic'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Magnetic strength={0.4}>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        data-cursor={isDark ? 'Light' : 'Dark'}
        className={`relative grid size-11 place-items-center overflow-hidden rounded-full border border-line bg-bg/60 backdrop-blur-md transition-colors hover:border-accent ${className}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ y: 22, rotate: -90, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: -22, rotate: 90, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="grid place-items-center"
          >
            {isDark ? <Moon className="size-[18px]" strokeWidth={1.8} /> : <Sun className="size-[18px]" strokeWidth={1.8} />}
          </motion.span>
        </AnimatePresence>
      </button>
    </Magnetic>
  )
}
