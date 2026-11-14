/**
 * "Ma" monogram — the site's two type voices in one mark: a Bricolage Grotesque
 * (800, condensed) M with an Instrument Serif italic a. Outlines are baked from the
 * real fonts, so it renders identically everywhere (favicon.svg uses the same paths).
 * The M inherits currentColor; the a uses the accent. Hover tilt: .logo-mark in index.css.
 */
export default function Logo({ className = '' }) {
  return (
    <svg viewBox="7 14 50 36" className={`logo-mark ${className}`} aria-hidden="true">
      <path className="lm-m" fill="currentColor" d="M8.63 47L8.63 15L20.8 15L24 39.73L24.15 39.73L27.11 15L38.79 15L38.79 47L31.71 47L31.71 22.03L31.57 22.03L27.35 47L20.08 47L15.86 22.03L15.71 22.03L15.71 47Z" />
      <path className="lm-a" fill="var(--accent)" d="M36.7 48.06Q34.85 48.06 33.82 46.47Q32.79 44.87 32.79 41.79Q32.79 38.86 33.61 35.9Q34.44 32.94 35.88 30.27Q37.32 27.59 39.14 25.54Q40.97 23.48 43 22.27Q45.03 21.06 47.04 21.06Q48.01 21.06 48.89 21.45Q49.76 21.83 50.33 22.66Q50.64 23.12 50.94 23.12Q51.25 23.12 51.56 22.66Q52.13 21.83 52.49 21.6Q52.85 21.37 53.16 21.37Q53.82 21.37 53.67 22.09L49.09 41.79Q48.32 45.13 50.12 45.13Q51.3 45.13 52.26 43.54Q53.21 41.94 54.18 38.6Q54.34 38.03 54.85 38.03Q55.21 38.03 55.32 38.34Q55.42 38.65 55.32 39.06Q54.34 43.9 52.69 45.98Q51.05 48.06 48.73 48.06Q46.73 48.06 45.88 46.37Q45.03 44.67 45.7 41.74L46.37 38.91Q46.47 38.55 46.24 38.5Q46.01 38.45 45.85 38.75Q43.02 43.95 40.84 46.01Q38.65 48.06 36.7 48.06ZM37.98 45.44Q39.22 45.44 40.71 43.95Q42.2 42.46 43.67 40.09Q45.13 37.73 46.37 35Q47.6 32.27 48.35 29.75Q49.09 27.23 49.09 25.49Q49.09 22.35 46.88 22.35Q45.54 22.35 44.05 23.56Q42.56 24.77 41.2 26.82Q39.84 28.88 38.73 31.48Q37.62 34.07 36.96 36.88Q36.29 39.68 36.29 42.35Q36.29 44.15 36.72 44.8Q37.16 45.44 37.98 45.44Z" />
    </svg>
  )
}
