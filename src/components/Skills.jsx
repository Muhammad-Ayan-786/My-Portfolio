import React, { useRef } from 'react';
import { skills } from '../data/skills';
import { useSkillsAnimation } from '../hooks/useSkillsAnimation';

const Skills = () => {

  const skillsRef = useRef(null)
  useSkillsAnimation(skillsRef)

  return (
    <section ref={skillsRef} id="skills" className="w-full border-b border-[#2b1200] bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 flex flex-col items-center">

        {/* Headline */}
        <h2 className="skills-heading text-4xl md:text-6xl font-black tracking-tight uppercase mb-16 select-none" id="skills-heading">
          TECH STACK
        </h2>

        {/* Columns Grid */}
        <div className="skills-box grid grid-cols-1 md:grid-cols-3 border border-[#2b1200] bg-white rounded-none">

          {/* Frontend */}
          <div className="skills-column p-8 border-b md:border-b border-[#2b1200] md:border-r flex flex-col gap-6">
            <span className="font-mono text-xs uppercase text-neutral-500 tracking-widest font-bold">
            // FRONTEND
            </span>

            <div className="flex flex-wrap gap-2.5">
              {skills.frontend.map((skill) => (
                <span
                  key={skill}
                  className="skill-tag border border-[#2b1200] px-3 py-1.5 font-mono text-xs uppercase bg-white rounded-none hover:bg-[#CCFF00] transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Backend */}
          <div className="skills-column p-8 border-b md:border-r border-[#2b1200] flex flex-col gap-6">
            <span className="font-mono text-xs uppercase text-neutral-500 tracking-widest font-bold">
            // BACKEND
            </span>

            <div className="flex flex-wrap gap-2.5">
              {skills.backend.map((skill) => (
                <span
                  key={skill}
                  className="skill-tag border border-[#2b1200] px-3 py-1.5 font-mono text-xs uppercase bg-white rounded-none hover:bg-[#CCFF00] transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Database */}
          <div className="skills-column p-8 border-b md:border-r border-[#2b1200] flex flex-col gap-6">
            <span className="font-mono text-xs uppercase text-neutral-500 tracking-widest font-bold">
            // DATABASE
            </span>

            <div className="flex flex-wrap gap-2.5">
              {skills.database.map((skill) => (
                <span
                  key={skill}
                  className="skill-tag bg-[#2b1200] text-white px-3 py-1.5 font-mono text-xs uppercase rounded-none hover:bg-[#CCFF00] hover:text-[#2b1200] transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Animation */}
          <div className="skills-column p-8 md:border-r border-[#2b1200] flex flex-col gap-6">
            <span className="font-mono text-xs uppercase text-neutral-500 tracking-widest font-bold">
            // ANIMATION
            </span>

            <div className="flex flex-wrap gap-2.5">
              {skills.animation.map((skill) => (
                <span
                  key={skill}
                  className="skill-tag border border-[#2b1200] px-3 py-1.5 font-mono text-xs uppercase bg-white rounded-none hover:bg-[#CCFF00] transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="skills-column p-8 md:border-r flex flex-col gap-6">
            <span className="font-mono text-xs uppercase text-neutral-500 tracking-widest font-bold">
            // TOOLS
            </span>

            <div className="flex flex-wrap gap-2.5">
              {skills.tools.map((skill) => (
                <span
                  key={skill}
                  className="skill-tag border border-[#2b1200] px-3 py-1.5 font-mono text-xs uppercase bg-white rounded-none hover:bg-[#CCFF00] transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

export default Skills