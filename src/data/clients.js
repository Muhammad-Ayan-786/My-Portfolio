/**
 * Professional / client work.
 *
 * `job`     — your current role (shown on Home, Work, About). Set `company` to show the employer's name.
 * `clients` — stores you've shipped. Screenshots live in /public/clients (1920×1080 WebP):
 *             `image` is the cover, `gallery` is swapped in on hover.
 *             `brand` is the store's own colour — used only as a glow/accent on its card.
 * `workshop` — the build that's still in progress (rendered as a "coming soon" card). Set to null to hide.
 */
export const job = {
  title: 'Shopify Developer',
  company: null, // e.g. 'Acme Studio'
  type: 'Full-time',
  since: 'Oct 2026',
  summary:
    'I design and build Shopify storefronts for real South African brands — custom themes, motion-rich product pages and checkout-ready catalogues, shipped live.',
}

export const clients = [
  {
    slug: 'root-and-bloom',
    name: 'Root & Bloom',
    industry: 'Wellness & supplements',
    url: 'https://www.rootandbloom.online/',
    domain: 'rootandbloom.online',
    image: '/clients/root-and-bloom.webp',
    gallery: '/clients/root-and-bloom-2.webp',
    brand: '#2f7d32',
    summary:
      'A South African wellness label — moringa, ashwagandha, collagen, Absolute Hydration electrolytes, Carb Burn and more — given a calm, editorial storefront where the products float in 3D space.',
    highlights: ['Floating 3D product hero', 'Product-led storytelling sections', 'Routine & affiliate pages'],
    stack: ['Shopify', 'Custom theme', 'UI design', 'Motion'],
  },
  {
    slug: 'dos-and-donuts',
    name: 'Do’s & Donuts',
    industry: 'Food & events',
    url: 'https://www.dosanddonuts.co.za/',
    domain: 'dosanddonuts.co.za',
    image: '/clients/dos-and-donuts.webp',
    gallery: '/clients/dos-and-donuts-2.webp',
    brand: '#e0569b',
    summary:
      'A mini-donut kiosk brand that’s all sugar and personality — a video-led storefront selling party boxes, birthday boxes and DIY decorating kits, with a playful pink identity throughout.',
    highlights: ['Full-bleed video hero', 'Do’s · Donuts · Sprinkles story cards', 'Online ordering for boxes & kits'],
    stack: ['Shopify', 'Custom theme', 'Video', 'Email capture'],
  },
  {
    slug: 'beverage-bank',
    name: 'Beverage Bank',
    industry: 'Wholesale & retail drinks',
    url: 'https://www.beveragebank.co.za/',
    domain: 'beveragebank.co.za',
    image: '/clients/beverage-bank.webp',
    gallery: '/clients/beverage-bank-2.webp',
    brand: '#e5202e',
    summary:
      'A Johannesburg drinks wholesaler — soft drinks, energy, water and juices by the case — with a loud, ice-cold identity, animated cans and a trade-account flow for shops and offices.',
    highlights: ['Animated 3D can hero', 'Bento collection grid', 'Wholesale trade-account flow'],
    stack: ['Shopify', 'Custom theme', 'UI design', 'B2B'],
  },
]

export const workshop = {
  name: '47Home',
  industry: 'Furniture',
  summary:
    'A fully 3D, scroll-driven furniture experience — walk through rooms, spin pieces in real time and shop straight from the scene. The most ambitious build yet.',
  eta: 'Launching Dec 2026 – Jan 2027',
  // Build phases — flip `done` as you go and the card updates
  phases: [
    { label: 'Art direction', done: true },
    { label: '3D scenes', done: false, active: true },
    { label: 'Store build', done: false },
    { label: 'Launch', done: false },
  ],
}
