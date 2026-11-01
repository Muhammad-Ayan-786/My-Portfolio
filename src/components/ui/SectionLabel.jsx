/** Small "(01) — Label" heading used at the top of sections. */
export default function SectionLabel({ index, children, className = '' }) {
  return (
    <div data-rail-mark="" data-rail-index={index} className={`type-label flex items-center gap-3 text-muted ${className}`}>
      {index && <span className="text-accent">({index})</span>}
      <span className="h-px w-10 bg-current opacity-40" />
      <span data-rail-label>{children}</span>
    </div>
  )
}
