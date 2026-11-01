/**
 * The full-stack path — rendered as the pinned horizontal scroll on Home
 * and the "Now / Next" board on About.
 *
 * status: 'complete' | 'current' | 'next'
 * progress: 0 – 100 (drives the progress meter)
 */
export const roadmap = [
  {
    id: 'frontend',
    index: '01',
    title: 'Frontend',
    status: 'complete',
    progress: 100,
    period: '2025 — 2026',
    summary:
      'Interfaces that feel alive. Semantic HTML, modern CSS, component architecture in React, predictable state and motion that serves the story.',
    tools: ['HTML', 'CSS', 'JavaScript', 'React', 'Redux Toolkit', 'TanStack Query', 'Tailwind CSS', 'GSAP'],
  },
  {
    id: 'backend',
    index: '02',
    title: 'Backend',
    status: 'complete',
    progress: 100,
    period: '2026',
    summary:
      'The engine room. REST APIs, authentication, data modelling and type-safe servers that keep the interface honest.',
    tools: ['Node.js', 'Express', 'REST APIs', 'Auth', 'MongoDB', 'Redis', 'Socket.IO'],
  },
  {
    id: 'genai',
    index: '03',
    title: 'Generative AI',
    status: 'current',
    progress: 35,
    period: 'Right now',
    summary:
      'Teaching software to think. LLM APIs, prompt engineering, retrieval-augmented generation and AI-native product experiences.',
    tools: ['LLM APIs', 'Prompt Engineering', 'RAG', 'LangChain', 'LangGraph', 'MCP', 'Agentic AI'],
  },
  {
    id: 'devops',
    index: '04',
    title: 'DevOps',
    status: 'next',
    progress: 0,
    period: 'Up next',
    summary:
      'Shipping at scale. Containers, automated pipelines, cloud infrastructure and the observability to sleep at night.',
    tools: ['Docker', 'CI/CD', 'GitHub Actions', 'AWS', 'Kubernetes'],
  },
]

export const statusLabel = {
  complete: 'Completed',
  current: 'In progress',
  next: 'Up next',
}
