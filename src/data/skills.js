/**
 * The toolbox. Add a skill to any `items` array (or add a whole new
 * category object) and it appears on the About page and in the
 * scrolling marquee on Home automatically.
 *
 * status: 'complete' | 'current' | 'next'  (same meaning as roadmap.js)
 */
export const skills = [
  {
    id: 'frontend',
    label: 'Frontend',
    status: 'complete',
    items: ['HTML', 'CSS', 'JavaScript', 'React', 'Redux Toolkit', 'TanStack Query', 'Tailwind CSS'],
  },
  {
    id: 'backend',
    label: 'Backend',
    status: 'complete',
    items: ['Node.js', 'Express', 'REST APIs', 'Auth', 'JWT', 'Socket.IO', 'Validation',],
  },
  {
    id: 'database',
    label: 'Database',
    status: 'complete',
    items: ['MongoDB', 'Mongoose', 'Aggregation', 'Indexing', 'Redis', 'Cache'],
  },
  {
    id: 'genai',
    label: 'Generative AI',
    status: 'current',
    items: ['LLM APIs', 'Prompt Engineering', 'RAG', 'LangChain', 'LangGraph', 'MCP', 'Agentic AI'],
  },
  {
    id: 'tools',
    label: 'Tools',
    status: 'complete',
    items: ['Git', 'GitHub', 'VS Code', 'Claude', 'Postman', 'Vite', 'Vercel', 'MongoDB Compass'],
  },
  {
    id: 'devops',
    label: 'DevOps',
    status: 'next',
    items: ['Docker', 'CI/CD', 'AWS', 'Kubernetes'],
  },
]

/** Flat list of every skill already learned or in progress (used by the marquee). */
export const allSkills = skills
  .filter((group) => group.status !== 'next')
  .flatMap((group) => group.items)
