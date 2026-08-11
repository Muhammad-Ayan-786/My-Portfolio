import React, { useRef } from 'react';
import { skills } from '../data/skills';
import { useStackAnimation } from '../hooks/useStackAnimation';

const Stack = () => {

  const stackRef = useRef(null)
  useStackAnimation(stackRef)

  return (
    <section ref={stackRef} id="stack" className="w-full  bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24 pt-16 flex flex-col items-center">

        <div className="relative w-full mb-20 md:mb-28 overflow-hidden">

          {/* Section Index */}
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono text-xs md:text-sm tracking-[0.25em] uppercase">
              02 / WHAT I USE
            </span>

            <span className="font-mono text-xs md:text-sm tracking-[0.25em] uppercase text-[#2b1200]/50">
              STACK / 2026
            </span>
          </div>

          {/* Giant Heading */}
          <div className="relative border-t-2 border-b-2 border-[#2b1200] py-6 md:py-8">
            <h2 className="skills-heading text-[5rem] md:text-[8rem] lg:text-[10rem] leading-[0.75] font-black tracking-tighter uppercase text-[#2b1200]">
              TECH
              <span className="text-[#CCFF00]">.</span>
              <br />
              STACK
            </h2>
          </div>

        </div>


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
    </section >
  )
}

export default Stack