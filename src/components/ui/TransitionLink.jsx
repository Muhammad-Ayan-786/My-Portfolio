import { Link } from 'react-router'
import { usePageTransition } from '../../context/Transition'

/**
 * Drop-in replacement for <Link> that plays the page-transition curtain.
 * Still a real <a href>, so cmd/ctrl-click, new tabs and SEO all work.
 */
export default function TransitionLink({ to, label, onClick, children, ...rest }) {
  const { go } = usePageTransition()

  const handleClick = (e) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target) return
    e.preventDefault()
    go(to, label)
  }

  return (
    <Link to={to} onClick={handleClick} {...rest}>
      {children}
    </Link>
  )
}
