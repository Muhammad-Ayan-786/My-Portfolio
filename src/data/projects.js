/**
 * Projects. Each object becomes a card on /work, a row on Home (if
 * `featured`) and its own case-study page at /work/:slug.
 *
 * To add a project: drop a screenshot in /public/projects and copy one of
 * the objects below. `slug` must be unique and URL-friendly.
 */
export const projects = [
  {
    slug: 'sky-mart',
    title: 'Sky-Mart',
    category: 'E-commerce',
    year: '2026',
    role: 'Design & Frontend',
    featured: true,
    image: '/projects/skymart.webp',
    liveUrl: 'https://sky-mart-nine-neon.vercel.app/',
    repoUrl: null,
    stack: ['React', 'Redux Toolkit', 'Tailwind CSS', 'Auth'],
    summary: 'An e-commerce storefront where layout, typography and hierarchy do the selling.',
    description:
      'Sky-Mart is an online store built around the details that make shopping feel effortless. A clear visual hierarchy guides the eye from product to cart, typography carries the brand, and the interface stays fast while global state does the heavy lifting behind the scenes.',
    highlights: [
      'User authentication flow',
      'Global product & cart state with Redux Toolkit',
      'Typography-led, fully responsive layout',
    ],
  },
  {
    slug: 'careertrack',
    title: 'CareerTrack',
    category: 'Productivity',
    year: '2026',
    role: 'Frontend Engineering',
    featured: true,
    image: '/projects/career-track.webp',
    liveUrl: 'https://reduxtoolkit-hackathon-project.vercel.app/',
    repoUrl: null,
    stack: ['React', 'Redux Toolkit', 'Tailwind CSS'],
    summary: 'A job-hunt command centre for applications, interviews and follow-ups.',
    description:
      'Job hunting is chaos: dozens of applications, interview stages and follow-ups scattered across tabs. CareerTrack turns that chaos into a single, structured pipeline — built during a Redux Toolkit hackathon, with state modelled so every application moves cleanly from one stage to the next.',
    highlights: [
      'Pipeline view for every application stage',
      'Normalised Redux Toolkit state',
      'Built under hackathon time pressure',
    ],
  },
  {
    slug: 'productive-dashboard',
    title: 'Productive Dashboard',
    category: 'Dashboard',
    year: '2026',
    role: 'Design & Development',
    featured: true,
    image: '/projects/productive-dashboard.webp',
    liveUrl: 'https://productivity-dashboard-lovat.vercel.app/',
    repoUrl: null,
    stack: ['JavaScript', 'HTML', 'CSS'],
    summary: 'A real-time productivity dashboard with zero frameworks and minimal render cost.',
    description:
      'A real-time monitoring dashboard written in plain JavaScript. No framework, no virtual DOM — just careful DOM updates, well-structured state and visual representations of data that stay responsive as everything changes.',
    highlights: [
      'Framework-free, hand-rolled state management',
      'Live-updating widgets with minimal re-rendering',
      'Clean, glanceable data visualisation',
    ],
  },
  {
    slug: 'finpro-track',
    title: 'FinPro Track',
    category: 'Finance',
    year: '2026',
    role: 'Design & Development',
    featured: false,
    image: '/projects/finpro-track.webp',
    liveUrl: 'https://cohort-3-0-rosy.vercel.app/',
    repoUrl: null,
    stack: ['JavaScript', 'HTML', 'CSS'],
    summary: 'A personal finance tracker that shows where the money actually goes.',
    description:
      'FinPro Track records income and expenses and turns them into spending patterns you can actually read. Built with vanilla JavaScript to master the fundamentals — data handling, persistence and UI updates without a framework to lean on.',
    highlights: [
      'Income & expense tracking',
      'Spending-pattern breakdowns',
      'Built entirely with vanilla JavaScript',
    ],
  },
]

export const getProject = (slug) => projects.find((p) => p.slug === slug)

export const getNextProject = (slug) => {
  const i = projects.findIndex((p) => p.slug === slug)
  return projects[(i + 1) % projects.length]
}
