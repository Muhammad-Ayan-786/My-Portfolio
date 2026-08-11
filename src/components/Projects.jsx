import React, { useRef } from 'react';
import ProjectCard from './ProjectCard';
import { projects } from '../data/projects';
import { useProjectsAnimation } from '../hooks/useProjectsAnimation';

const Projects = () => {

  const projectsRef = useRef(null)
  useProjectsAnimation(projectsRef)

  return (
    <section ref={projectsRef} id="projects" className="w-full border-b border-[#2b1200] overflow-hidden">

      {/* Heading */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-18 pb-12">
        <h2 className="projects-heading text-5xl md:text-7xl font-black uppercase tracking-tighter">
          Selected Work
        </h2>
      </div>

      {/* Projects */}
      <div className="projects-wrapper w-full overflow-hidden">

        {/* Track */}
        <div className="projects-track flex w-max">
          {projects.map(project => <ProjectCard key={project.id} project={project} />)}
        </div>

      </div>

    </section>
  )
}

export default Projects