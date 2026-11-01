# Mohd Ayan — Portfolio

Personal portfolio of **Mohd Ayan**, full-stack engineer from Johannesburg.
Frontend ✓ → Backend ✓ → **Generative AI (now)** → DevOps (next).

Live: https://mohd-ayan-dev.vercel.app

## Stack

| Concern            | Tool                                                             |
| ------------------ | ---------------------------------------------------------------- |
| UI                 | React 19 + Vite                                                  |
| Routing            | React Router (data router, lazy routes, loaders)                 |
| Styling            | Tailwind CSS v4 — every token lives in `src/index.css` `:root`   |
| Motion             | GSAP (ScrollTrigger, SplitText), Motion, Lenis smooth scroll     |
| 3D                 | Three.js with a custom GLSL shader (lazy-loaded)                 |
| Fonts (self-host)  | Bricolage Grotesque · Manrope · Instrument Serif · JetBrains Mono |

## Scripts

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # serve the production build
npm run lint
```

## Editing content — no component code needed

Everything on the site is generated from plain data files in `src/data/`:

| File            | Controls                                                          |
| --------------- | ----------------------------------------------------------------- |
| `site.js`       | Name, role, tagline, email, socials, location, résumé, availability |
| `skills.js`     | Toolbox on About + the scrolling skills tape on Home              |
| `roadmap.js`    | The 4-stage full-stack path (status + progress %)                  |
| `projects.js`   | Home list, `/work` showcase and each `/work/:slug` case study      |
| `journey.js`    | Timeline on About                                                 |
| `principles.js` | "How I work" cards on About                                        |
| `navigation.js` | Navbar, mobile menu and footer links                               |

**Add a skill:** push a string into any `items` array in `skills.js`.
**Add a project:** drop a screenshot into `public/projects/` and copy an object in `projects.js` (give it a unique `slug`).
**Finish a stage:** set `status: 'complete'` and `progress: 100` in `roadmap.js` — stats, badges and the hero update automatically.

## Theming

Colours, fonts, easing and spacing tokens are CSS variables in `src/index.css`.
The palette is four colours — ink `#0C0B10`, bone `#F1ECE2`, ember `#FF4A1C`, violet `#7C5CFF` —
mapped to semantic tokens (`--bg`, `--fg`, `--accent`, …) for the light theme in `:root` and the dark theme in
`:root[data-theme="dark"]`. Tailwind utilities like `bg-bg`, `text-fg` and `text-accent` read from them.

## Structure

```
src/
  components/
    layout/   RootLayout, Navbar, MobileMenu, Footer, Preloader, Cursor, ThemeToggle
    three/    HeroScene (WebGL blob)
    ui/       RevealText, ScrubText, Reveal, Magnetic, Marquee, Button, TiltCard, …
  context/    Theme, SmoothScroll (Lenis), App (load state), Transition (page curtains)
  data/       ← edit these
  pages/      Home, Work, ProjectDetail, About, Contact, NotFound, ErrorPage
  sections/   Home page sections
  router.jsx  Route config
```

## Contact form backend

`api/contact.js` is a Vercel serverless function (`POST /api/contact`). It validates input, filters spam
(honeypot field, "filled too fast" check, per-IP rate limit) and delivers the message to your inbox through
[Resend](https://resend.com), with Reply-To set to the visitor.

1. Create a free Resend account **with the inbox that should receive messages**, and create an API key.
2. Vercel → Project → Settings → Environment Variables: add `RESEND_API_KEY` (see `.env.example` for optional keys), then redeploy.
3. Local dev: copy `.env.example` to `.env` and fill in the key — `npm run dev` serves `/api/*` too.

If the service fails, the form offers a pre-filled "send from your email app" fallback.

## Deploy

`vercel.json` rewrites every non-API path to `index.html` so deep links like `/about` work on refresh, and caches hashed assets for a year.
