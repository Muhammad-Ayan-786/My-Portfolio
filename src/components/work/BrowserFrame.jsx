import { Lock } from 'lucide-react'

/**
 * macOS-style browser window: traffic lights, address pill, "Live" badge and a 16:9 screen.
 * Colours follow `--brand` from the nearest ancestor (the dots light up in it on group-hover).
 * `address` is a node so callers can stack/animate several domains in one pill.
 */
export default function BrowserFrame({ address, children, className = '' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.25rem] border border-line bg-surface shadow-[0_40px_100px_-50px_rgb(0_0_0/0.6)] ${className}`}
    >
      <div className="flex h-10 items-center gap-3 border-b border-line px-4">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-fg/15 transition-colors duration-500 group-hover:bg-[var(--brand)]" />
          <span className="size-2.5 rounded-full bg-fg/15 transition-colors delay-75 duration-500 group-hover:bg-[var(--brand)] group-hover:opacity-70" />
          <span className="size-2.5 rounded-full bg-fg/15 transition-colors delay-150 duration-500 group-hover:bg-[var(--brand)] group-hover:opacity-40" />
        </span>
        <span className="type-label flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-bg/70 px-3 py-1 !text-[0.62rem] normal-case tracking-[0.06em] text-muted">
          <Lock className="size-3 shrink-0" aria-hidden="true" />
          <span className="min-w-0 truncate">{address}</span>
        </span>
        <span className="type-label flex items-center gap-1.5 !text-[0.6rem] text-muted">
          <span className="pulse-dot size-1.5 rounded-full bg-[var(--brand)]" />
          Live
        </span>
      </div>
      {/* 16:9 box matches the 1920×1080 screenshots — nothing is cropped */}
      <div className="relative aspect-video overflow-hidden bg-bg">{children}</div>
    </div>
  )
}
