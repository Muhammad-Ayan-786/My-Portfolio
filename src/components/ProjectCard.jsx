import React from 'react';
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ExternalLink, Info } from "lucide-react";
import { useProjectCardInfoAnimation } from '../hooks/useProjectsAnimation';

const ProjectCard = ({ project }) => {
  const [showInfo, setShowInfo] = useState(false);

  const projectCardRef = useRef(null);
  useProjectCardInfoAnimation(projectCardRef, showInfo)


  return (
    <div ref={projectCardRef} className="project-card w-screen shrink-0 flex flex-col gap-6 px-6 md:px-12">
      {/* Project Image Container */}
      <div className="relative w-full border border-primary bg-neutral-100 overflow-hidden">

        {/* Project Image */}
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-[85vh] object-cover object-top filter grayscale hover:grayscale-0 transition-all duration-700"
        />

        {/* Controls */}
        <div className="absolute top-6 right-6 z-30 flex flex-col gap-2">
          {/* Live Project */}
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="group relative w-12 h-12 border border-primary bg-accent flex items-center justify-center text-primary transition-all duration-300 hover:-translate-y-1 hover:translate-x-1 active:translate-x-0 active:translate-y-0"
          >
            <span className="absolute inset-0 z-0 border border-primary bg-white opacity-0 transition-all duration-300 group-hover:opacity-100" />
            <ExternalLink size={20} className="relative z-10 transition-transform duration-300 group-hover:rotate-45" />
          </a>

          {/* Info Toggle */}
          <button
            type="button"
            onClick={() => setShowInfo((prev) => !prev)}
            className="group relative w-12 h-12 border border-primary bg-primary flex items-center justify-center text-white transition-all duration-300 hover:-translate-y-1 hover:translate-x-1 active:translate-x-0 active:translate-y-0 cursor-pointer"
          >
            <span className="absolute inset-0 z-0 border border-primary bg-accent translate-x-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:opacity-100" />
            <Info size={20} className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary" />
          </button>

        </div>

        {/* Project Info Card */}
        <div
          className="info-card absolute bottom-8 left-8 z-20 w-[calc(100%-4rem)] md:max-w-2xl"
          style={{
            opacity: 0,
            visibility: "hidden",
          }}
        >

          {/* Acid-green Offset Shadow */}
          <div className="absolute inset-0 bg-accent border border-primary translate-x-2 translate-y-2" />

          {/* Main Content Box */}
          <div className="relative z-10 bg-white border border-primary p-6 flex flex-col gap-4">

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-extrabold tracking-tight uppercase text-primary">
              {project.title}
            </h3>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, idx) => (
                <span key={idx} className="bg-primary text-white font-mono text-xs uppercase px-2 py-1 rounded-none">
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-800 leading-relaxed">
              {project.description}
            </p>

          </div>
        </div>

      </div>
    </div>
  )
}

export default ProjectCard