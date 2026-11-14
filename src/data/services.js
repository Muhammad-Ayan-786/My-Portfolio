/**
 * What you're open to — drives the /services page, the "Open to work" section on Home
 * and the interest pills on the contact form.
 *
 * `interest` must match an entry in INTERESTS (src/pages/Contact.jsx and api/contact.js),
 * so "Start this" pre-selects the right option on the contact form.
 * `tag` is the small badge on each row. `rotator` is the short phrase used in the Home word-roll.
 */
export const services = [
  {
    id: 'job',
    title: 'Full-time & part-time roles',
    rotator: 'a full-time role',
    tag: 'Top priority',
    interest: 'Job opportunity',
    pitch:
      'Looking for a team to grow with, working remotely. Frontend, full-stack or Shopify — I ship production work from week one.',
    deliverables: ['Frontend', 'Full-stack', 'Shopify', 'Remote'],
  },
  {
    id: 'shopify',
    title: 'Shopify stores',
    rotator: 'a Shopify store',
    tag: 'Shipping daily',
    interest: 'Shopify store',
    pitch:
      'A custom storefront that actually sells — theme design and build, product pages, collections and the motion that makes a brand memorable.',
    deliverables: ['Custom theme', 'Store setup', 'Product & collection pages', 'Speed & SEO basics'],
  },
  {
    id: 'portfolio',
    title: 'Portfolio websites',
    rotator: 'your portfolio',
    tag: 'Fast turnaround',
    interest: 'Portfolio website',
    pitch:
      'A personal site that gets you noticed — designed around your work, animated with taste, deployed on your own domain. Quick to build, built to impress.',
    deliverables: ['Design', 'Animation', 'Content setup', 'Domain & deploy'],
  },
  {
    id: 'project',
    title: 'Custom web projects',
    rotator: 'your next big idea',
    tag: 'Freelance',
    interest: 'Custom project',
    pitch:
      'Web apps, dashboards and APIs built end to end — React on the front, Node and MongoDB behind it, and AI features where they genuinely help.',
    deliverables: ['React apps', 'APIs & databases', 'Dashboards', 'AI features'],
  },
  {
    id: 'internship',
    title: 'Internships',
    rotator: 'an internship',
    tag: 'Open',
    interest: 'Internship',
    pitch: 'Happy to learn inside a strong engineering team — and contribute real, shipped work while I do.',
    deliverables: ['Engineering teams', 'Product teams', 'Agencies'],
  },
]

/** Contact-form interest pills (shared with api/contact.js — keep this the single source). */
export const INTERESTS = [...services.map((s) => s.interest), 'Just saying hi']

/** How a freelance project runs, start to finish (Services page). */
export const steps = [
  { title: 'Brief', text: 'A quick call or a few messages: what you sell, who it’s for, what “done” looks like.' },
  { title: 'Design', text: 'Layout, type and motion direction — you see the look before a line of production code.' },
  { title: 'Build', text: 'Developed, tested on every screen size and shared with you as it comes together.' },
  { title: 'Launch', text: 'Live on your domain, handed over with a walkthrough — and I’m a message away after.' },
]
