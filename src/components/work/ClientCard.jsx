import { ArrowUpRight, Lock } from 'lucide-react'

/**
 * A live client store, framed as a browser window.
 * Hover: the store's brand colour glows behind it and the second screenshot wipes in.
 * `detailed` adds the summary + highlights (Work page); Home keeps it compact.
 */
export default function ClientCard({ client, index, detailed = false, className = '' }) {
  const num = String(index + 1).padStart(2, '0')

  return (
    <article className={`client-card group relative ${className}`} style={{ '--brand': client.brand }}>
      <a
        href={client.url}
        target="_blank"
        rel="noreferrer"
        data-cursor="Visit"
        aria-label={`Visit ${client.name} (opens the live store)`}
        className="relative block"
      >
        {/* brand glow */}
        <span className="pointer-events-none absolute inset-x-[8%] -bottom-6 top-[18%] rounded-full bg-[var(--brand)] opacity-0 blur-[70px] transition-opacity duration-700 ease-expo group-hover:opacity-45" />

        <div className="relative overflow-hidden rounded-[1.25rem] border border-line bg-surface shadow-[0_30px_80px_-40px_rgb(0_0_0/0.55)] transition-transform duration-700 ease-expo group-hover:-translate-y-2">
          {/* browser chrome */}
          <div className="flex h-10 items-center gap-3 border-b border-line px-4">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-fg/15 transition-colors duration-500 group-hover:bg-[var(--brand)]" />
              <span className="size-2.5 rounded-full bg-fg/15 transition-colors delay-75 duration-500 group-hover:bg-[var(--brand)] group-hover:opacity-70" />
              <span className="size-2.5 rounded-full bg-fg/15 transition-colors delay-150 duration-500 group-hover:bg-[var(--brand)] group-hover:opacity-40" />
            </span>
            <span className="type-label flex min-w-0 flex-1 items-center justify-center gap-1.5 truncate rounded-full bg-bg/70 px-3 py-1 !text-[0.62rem] normal-case tracking-[0.06em] text-muted">
              <Lock className="size-3 shrink-0" aria-hidden="true" />
              <span className="truncate">{client.domain}</span>
            </span>
            <span className="type-label flex items-center gap-1.5 !text-[0.6rem] text-muted">
              <span className="pulse-dot size-1.5 rounded-full bg-[var(--brand)]" />
              Live
            </span>
          </div>

          {/* screenshots — 16:9 box matches the 1920×1080 images, nothing is cropped */}
          <div className="relative aspect-video overflow-hidden bg-bg">
            <img
              src={client.image}
              alt={`${client.name} storefront`}
              width="1920"
              height="1080"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover transition-transform duration-1000 ease-expo group-hover:scale-[1.04]"
            />
            {client.gallery && (
              <img
                src={client.gallery}
                alt=""
                aria-hidden="true"
                width="1920"
                height="1080"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover transition-[clip-path] duration-1000 ease-expo [clip-path:inset(100%_0_0_0)] group-hover:[clip-path:inset(0_0_0_0)]"
              />
            )}
          </div>
        </div>
      </a>

      {/* meta */}
      <div className="mt-6 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="type-label flex items-center gap-2 text-muted">
            <span className="text-accent">{num}</span>
            <span className="h-px w-6 bg-current opacity-40" />
            {client.industry}
          </p>
          <h3 className="type-display mt-3 text-[clamp(2.4rem,3.4vw,3.9rem)] transition-colors duration-500 group-hover:text-[var(--brand)]">
            {client.name}
          </h3>
        </div>
        <a
          href={client.url}
          target="_blank"
          rel="noreferrer"
          tabIndex={-1}
          aria-hidden="true"
          className="mt-1 grid size-12 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 ease-expo group-hover:rotate-45 group-hover:border-[var(--brand)] group-hover:bg-[var(--brand)] group-hover:text-bone"
        >
          <ArrowUpRight className="size-5" />
        </a>
      </div>

      <p className={`mt-3 text-[0.95rem] leading-relaxed text-fg/75 ${detailed ? '' : 'line-clamp-2'}`}>{client.summary}</p>

      {detailed && (
        <ul className="mt-5 space-y-2 border-t border-line pt-5">
          {client.highlights.map((h) => (
            <li key={h} className="flex items-center gap-3 text-[0.95rem]">
              <span className="size-1.5 shrink-0 rounded-full bg-[var(--brand)]" />
              {h}
            </li>
          ))}
        </ul>
      )}

      <ul className="mt-5 flex flex-wrap gap-1.5">
        {client.stack.map((t) => (
          <li key={t} className="type-label rounded-full border border-line px-3 py-1.5">
            {t}
          </li>
        ))}
      </ul>
    </article>
  )
}
