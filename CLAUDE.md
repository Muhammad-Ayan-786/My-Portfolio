# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal portfolio of **Mohd Ayan** — full-stack engineer (Frontend ✓ → Backend ✓ → Generative AI now → DevOps next), working full-time as a Shopify Developer and open to jobs + freelance.
Live at https://mohd-ayan-dev.vercel.app (Vercel). Heavily animated, light + dark themes, desktop and mobile.

**Pages / sections**
- `/` Home — Hero (sticky stage: an illustrated character whose eyes and head follow the cursor, framed by the split name; the rest of the page is a rounded sheet that slides over it), IntroDock (tagline, path, CTAs at the top of the sheet), Manifesto, Tapes (skill marquees), Path (4-stage roadmap, pinned horizontal scroll on desktop), Day job (pinned browser-window showcase that flips through the client stores on scroll + 47Home workshop card), Personal projects, Open to work (word-roll)
- `/work` — client stores (zig-zag editorial rows) + personal projects · `/work/:slug` — personal-project case study (unknown slug → 404 via loader)
- `/services` — "Hire me": offers (hover-expand rows), for-recruiters card, process
- `/about` — intro, now & next, journey timeline, toolbox, principles
- `/contact` — direct email/socials + form backed by `api/contact.js`
- Global: preloader, custom cursor, custom scrollbar ("ScrollRail"), navbar, curtain page transitions, footer with hover-animated name

## Stack

React 19 · Vite 7 · react-router v8 (data router) · Tailwind CSS v4 · GSAP 3 (ScrollTrigger, SplitText, `@gsap/react`) · Lenis (smooth scroll) · Motion (`motion/react`) · Three.js (custom GLSL) · lucide-react · Fontsource (self-hosted fonts) · Vercel serverless function + Resend for email.

## Commands

```bash
npm install
npm run dev      # dev server; also serves /api/* via a Vite plugin
npm run build    # → dist/
npm run preview  # serves dist/ — does NOT serve /api
npm run lint     # must stay at zero errors
```

No test suite. Verify with `npm run lint && npm run build`, then check animated UI in a browser (both themes, desktop + mobile width).

## Where things live

```
api/contact.js        Vercel function: POST /api/contact (contact form → email)
public/               favicons, og-image, manifest, robots/sitemap, projects/*.webp
src/
  data/               ← ALL site content (see below). Edit here, not in components.
  pages/              one file per route (+ NotFound, ErrorPage)
  sections/home/      Home page sections (Hero, IntroDock, Manifesto, Tapes, Path, ClientWork, FeaturedWork, OpenTo)
  components/
    layout/           global chrome: RootLayout, Preloader, Cursor, ScrollRail, Navbar, MobileMenu, Footer, ThemeToggle
    ui/               reusable bits: RevealText, Reveal, ScrubText, Magnetic, Marquee, Button, TransitionLink,
                      PageHeader, SectionLabel, TiltCard, LivingName (footer name), LocalTime, Logo
    hero/             Character (hero character: head + body cut-outs, SVG eyes that track the cursor, blink, breathing)
    three/            HeroScene (WebGL blob — the previous hero centrepiece, currently not mounted)
    work/             BrowserFrame (macOS window, colours from `--brand`), ClientRow (editorial store row), Workshop (in-progress build, CSS-3D cubes)
  context/            Theme, SmoothScroll (Lenis), App (load state), Transition (page curtains)
  lib/gsap.js         the ONLY place gsap plugins are registered/imported from
  router.jsx          route table
  index.css           design tokens + global CSS helpers
```

## Content (`src/data/`)

Components render from these files; to change content, edit data only.

| File | Drives |
|---|---|
| `site.js` | name, role, tagline, email, socials, résumé link (Google Drive URL; `null` hides all résumé buttons), location/time zone, availability, current/next focus |
| `clients.js` | `job` (current role), `clients` (live stores → Home Day job + Work), `workshop` (in-progress build; `null` hides it). Screenshots: `public/clients/*.webp`, 1920×1080, cover + `gallery` hover image |
| `services.js` | offers on `/services` + Home "Open to work", `INTERESTS` for the contact form, process `steps` |
| `projects.js` | Home featured list (`featured: true`), `/work` cards, `/work/:slug` pages. `slug` must be unique. Images: `public/projects/*.webp`, **1920×1080** |
| `roadmap.js` | the 4 stages; `status` (`complete`/`current`/`next`) + `progress` feed badges, stats and the hero |
| `skills.js` | About toolbox + Home skill tapes |
| `journey.js`, `principles.js` | About timeline and "how I work" cards |
| `navigation.js` | navbar, mobile menu, footer links, and transition-curtain labels |

## Animation approach

- **One clock.** Lenis runs on `gsap.ticker` (`autoRaf: false`) and pushes `ScrollTrigger.update`. Scroll programmatically with `useLenis().scrollTo(...)`, not `window.scrollTo`.
- **Import gsap from `src/lib/gsap.js`** (also exports `prefersReducedMotion()` and `isTouch()`). Use `useGSAP` with a `scope` ref so animations clean up.
- **Intro sync.** `useIntro()` (`context/App.jsx`) returns `{play, delay}`: intros wait until the preloader lifts (`loaded`) or the transition curtain clears.
- **Navigation** goes through the curtain transition: use `TransitionLink` / `<Button to=...>` for internal links, never a plain `<Link>`.
- **Reusable motion:** `RevealText` (SplitText chars/words/lines), `Reveal` (fade-up children), `ScrubText`, `Magnetic`, `TiltCard`. Motion (`motion/react`) is used for UI state (layoutId pills, AnimatePresence).
- **Custom cursor** (`layout/Cursor.jsx`, fine pointers only): links/buttons/inputs get default states automatically. Opt in with `data-cursor`:
  - `"hide"` — hide the cursor
  - `"dot"` — ring collapses to a precise dot (used on the ScrollRail)
  - any other text, e.g. `"View"` — ring grows into an accent bubble showing that label
- **ScrollRail** (`layout/ScrollRail.jsx`) replaces the native scrollbar on desktop (`html.has-rail`); touch keeps the native one. Its section ticks are auto-built from `[data-rail-mark]` — `SectionLabel` adds it, as do the hero and footer — so new sections should use `<SectionLabel>`.
- **Reduced motion** is respected everywhere: check `prefersReducedMotion()` before adding animation.

## Styling conventions

- **Tokens live in `src/index.css`.** 4-colour palette (`--c-ink`, `--c-bone`, `--c-ember`, `--c-violet`) → semantic tokens (`--bg`, `--bg-elev`, `--fg`, `--fg-muted`, `--line`, `--accent`, `--accent-2`…) defined for light in `:root` and dark in `:root[data-theme="dark"]`, exposed to Tailwind via `@theme inline` (`bg-bg`, `bg-surface`, `text-fg`, `text-muted`, `border-line`, `text-accent`…). Fonts: `--font-display` (Bricolage Grotesque), `--font-body` (Manrope), `--font-serif` (Instrument Serif), `--font-code` (JetBrains Mono).
- Style with Tailwind utilities on those tokens; **don't hardcode colours** in components. Exception: emails rendered in `api/contact.js` use inline hex (email clients can't read CSS vars).
- Type helpers: `.type-display` (big condensed uppercase), `.type-serif` (italic accent), `.type-label` (mono micro-labels), `.container-x` (page gutter/max width).
- `dark:` follows `data-theme` on `<html>`, not the OS. Theme is saved in localStorage `ma-theme`; an inline script in `index.html` applies it before first paint; toggling uses a View Transition circular reveal. Three.js reads `--blob-*` / `--particles` and re-tints on theme change.

## Contact backend

- `api/contact.js`: validation, spam traps (hidden `website` honeypot + `elapsed` < 3 s), best-effort per-IP rate limit, sends via the Resend REST API (plain `fetch`) with Reply-To = visitor.
- Env vars (names only; values go in `.env` locally and Vercel → Settings → Environment Variables): `RESEND_API_KEY` (required), `CONTACT_TO`, `CONTACT_FROM`. Template: `.env.example`.
- Dev: the `vercelApi` plugin in `vite.config.js` loads `.env` and serves `/api/*`. **`.env` is only read at startup — restart `npm run dev` after editing it.**
- Sender is Resend's shared test address, which only delivers to the Resend account owner's inbox, and Gmail files these mails as spam (accepted as-is). A verified custom domain + `CONTACT_FROM` would fix both.

## Easy to break / non-obvious

- **Form ↔ function contract:** field names (`name`, `email`, `message`, `interest`, `website`, `elapsed`) and length limits are duplicated in `src/pages/Contact.jsx` and `api/contact.js` — change both together. `INTERESTS` is single-sourced in `src/data/services.js` (the API imports it via `../src/data/services.js`, so keep that file free of browser-only code). `/contact?interest=<value>` pre-selects a pill.
- **`vercel.json` rewrite** sends every non-file path to `index.html` but must keep excluding `api/`, or the form receives HTML instead of JSON.
- **Domain is hardcoded** in `index.html` (canonical, OG/Twitter, JSON-LD), `public/sitemap.xml` and `public/robots.txt`. Update all of them if the URL changes; add new routes to the sitemap. JSON-LD in `index.html` also duplicates personal info from `site.js`.
- **Adding a page:** route in `router.jsx` (lazy via `page()`), entry in `navigation.js`, open it with `PageHeader` + `SectionLabel`s, add its own `<title>`/`<meta>` (React 19 renders them into `<head>`), and add it to the sitemap.
- **Pinned ScrollTriggers** on Home: `Path.jsx` (horizontal) and `ClientWork.jsx` (store showcase; its length is `STEP × stores`). `ScrollReset` in `RootLayout` refreshes on route change *and* whenever document height changes (fonts, split text, lazy content); the footer reveal uses `refreshPriority: -1` so it is measured after the pins. New scroll effects near the page bottom should do the same.
- **`Reveal` animates `opacity`, not `autoAlpha`,** on purpose — `visibility: hidden` would make content unreachable by keyboard Tab.
- **Home hero is `position: sticky`** and `.home-sheet` (in `pages/Home.jsx`) slides over it; `Hero.jsx` sets the hero `invisible` and stops WebGL once fully covered. Keep new Home sections inside `.home-sheet`. On phones the hero text sits above the character (`max-md:z-10`), on desktop the character is in front of the name. The ScrollRail "Intro" mark is a zero-height span before the hero because a sticky element can't be measured.
- **Hero character (`components/hero/Character.jsx`)**: `public/character/head.webp` + `body.webp` are two cut-outs on the same 736×1010 canvas (exported at 2×); the head pivots at `NECK`. The eyes are redrawn in SVG over the artwork — `EYES` holds each eye's opening path and iris centre/radius in the artwork's pixel space, `ART` the sampled colours. Replacing the artwork means re-measuring those constants. `public/character/3image.png` is the original artwork the cut-outs were made from (kept for reference; the page does not load it).
- **Cursor ring size uses width/height, not `scale`,** so labels stay sharp.
- **Logo / favicons:** the "Ma" monogram (Bricolage 800 condensed M + Instrument Serif italic a) is stored as baked SVG paths, identical in `components/ui/Logo.jsx` and `public/favicon.svg`. The favicon wraps them in an "aurora" tile (violet + ember corner light, glass rim, glowing a); `favicon-32.png`, `icon-192/512.png` and the full-bleed `apple-touch-icon.png` are renders of that SVG. Change them together.
- **React hooks lint is strict:** no ref reads during render, no setState in effects. Use CSS variables written from effects or tickers (see ScrollRail's `--th`), or the prev-value pattern.
- **Display-type sizing** uses `svh`/`vw` clamps tuned so the hero fits a laptop viewport and the Path cards don't clip; test at roughly 1366×768 and phone width after touching them. Footer `LivingName` auto-fits its text to the container width.
- **Bundle:** vendor chunks (react, gsap, motion, three) are split manually in `vite.config.js`; HeroScene is lazy-loaded and only renders after the preloader (`active` prop). Keep Three.js out of the main chunk.
- **ESLint config:** ignores unused-var false positives for JSX `motion`/`Tag`, allows `loader` exports, turns off react-refresh in `src/context/`, and uses Node globals for `api/**` and `vite.config.js`.
