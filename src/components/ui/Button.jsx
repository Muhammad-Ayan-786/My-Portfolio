import { ArrowUpRight } from 'lucide-react'
import Magnetic from './Magnetic'
import TransitionLink from './TransitionLink'

const styles = {
  solid: 'bg-fg text-bg',
  accent: 'bg-accent text-on-accent',
  outline: 'border border-fg/25 text-fg',
}

/**
 * Pill button with a liquid fill on hover, rolling label and magnetic pull.
 * Renders a page-transition link for internal `to`, or an <a> for `href`.
 */
export default function Button({ to, href, variant = 'solid', icon = true, children, className = '', ...rest }) {
  const label = typeof children === 'string' ? children : undefined
  const inner = (
    <>
      <span className="absolute inset-0 translate-y-[101%] rounded-[inherit] bg-accent transition-transform duration-700 ease-expo group-hover:translate-y-0" />
      <span className="roll relative z-10">
        <span data-text={label}>{children}</span>
      </span>
      {icon && (
        <ArrowUpRight
          className="relative z-10 size-4 transition-transform duration-700 ease-expo group-hover:rotate-45"
          strokeWidth={2.2}
          aria-hidden="true"
        />
      )}
    </>
  )

  const cls = `group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-6 py-3.5 type-label !text-[0.72rem] transition-colors duration-500 hover:text-on-accent ${styles[variant]} ${className}`

  return (
    <Magnetic strength={0.25}>
      {to ? (
        <TransitionLink to={to} className={cls} data-cursor="hide" {...rest}>
          {inner}
        </TransitionLink>
      ) : (
        <a href={href} className={cls} data-cursor="hide" {...rest}>
          {inner}
        </a>
      )}
    </Magnetic>
  )
}
