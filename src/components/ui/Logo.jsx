/** "A" monogram — same mark as the favicon. Inherits currentColor. */
export default function Logo({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M15 51 L32 14 L49 51" fill="none" stroke="currentColor" strokeWidth="8" strokeLinejoin="miter" strokeLinecap="square" />
      <rect x="21" y="36" width="22" height="6.5" fill="var(--accent)" />
      <circle cx="51" cy="13" r="4.5" fill="var(--accent)" />
    </svg>
  )
}
