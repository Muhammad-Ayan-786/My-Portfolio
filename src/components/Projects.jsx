import React, { useRef } from 'react';
import ProjectCard from './ProjectCard';
import { projects } from '../data/projects';
import { useProjectsAnimation } from '../hooks/useProjectsAnimation';

const Projects = () => {

  const projectsRef = useRef(null)
  useProjectsAnimation(projectsRef)

  return (
    <section ref={projectsRef} id="projects" className="w-full border-b border-[#2b1200] overflow-hidden">

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative mb-20 md:mb-28 overflow-hidden">
        {/* Section Index */}
        <div className="flex items-center justify-between mb-6">
          <span className="font-mono text-xs md:text-sm tracking-[0.25em] uppercase">
            03 / SELECTED WORK
          </span>

          <span className="font-mono text-xs md:text-sm tracking-[0.25em] uppercase text-[#2b1200]/50">
            PROJECTS / 2026
          </span>
        </div>

        {/* Giant Heading */}
        <div className="relative border-t-2 border-b-2 border-[#2b1200] py-6 md:py-8">
          <h2 className="projects-heading text-[5rem] md:text-[8rem] lg:text-[10rem] leading-[0.75] font-black tracking-tighter uppercase text-[#2b1200]">
            SELECTED
            <br />
            WORK<span className="text-[#CCFF00]">.</span>
          </h2>
        </div>

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