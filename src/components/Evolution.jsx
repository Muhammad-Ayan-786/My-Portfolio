import React, { useRef } from 'react';
import { timelineEntries } from '../data/journey';
import { useTimeLineAnimation } from '../hooks/useTimeLineAnimation';

const Evolution = () => {

  const evolutionRef = useRef(null)
  useTimeLineAnimation(evolutionRef)

  return (
    <section ref={evolutionRef} id="evolution" className="w-full  bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 flex flex-col items-center">

        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24">

          {/* Section Meta */}
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono text-xs md:text-sm tracking-[0.25em] uppercase">
              04 / THE EVOLUTION
            </span>

            <span className="font-mono text-xs md:text-sm tracking-[0.25em] uppercase text-[#2b1200]/50">
              EVOLUTION / 2026
            </span>
          </div>

          {/* Giant Heading */}
          <div className="relative border-t-2 border-b-2 border-[#2b1200] py-8 md:py-10">
            <h2 className="evolution-heading text-6xl md:text-[8rem] lg:text-[10rem] leading-none font-black tracking-tighter uppercase text-[#2b1200] text-center whitespace-nowrap">
              EVOLUTION<span className="text-[#CCFF00]">.</span>
            </h2>
          </div>

        </div>





        {/* Timeline Wrapper */}
        <div className="relative w-full max-w-4xl flex flex-col gap-16 md:gap-16">

          {/* Center line (only desktop/tablet) */}
          <div className="timeline-line origin-top absolute left-5.75 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#2b1200] -translate-x-1/2" />

          {timelineEntries.map((entry, idx) => (
            // Timeline Entry
            <div
              key={idx}
              id={`timeline-item-${idx}`}
              className={`
              timeline-item relative flex flex-col md:flex-row items-center w-full
              ${entry.align === 'left' ? 'md:flex-row-reverse' : ''}
            `}>

              {/* Timeline Round Node Marker */}
              <div className="absolute left-5.75 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                <div className={
                  `timeline-marker w-4 h-4 border-2 border-[#2b1200] rounded-full
                  ${entry.isGreen ? 'bg-[#CCFF00]' : 'bg-white'}`}
                />
              </div>

              {/* Text/Content Column */}
              <div className={`w-full md:w-1/2 flex ${entry.align === 'right' ? 'justify-end md:pr-12' : 'justify-start md:pl-12'}`}>
                <div className={`flex flex-col 
                  ${entry.align === 'right' ? 'items-start md:items-end' : 'items-start'}
                  ${entry.align === 'right' ? 'timeline-content-right' : 'timeline-content-left'}`}
                >

                  {/* Timeline Year */}
                  <div className={`flex items-center gap-2 mb-1 ${entry.align === 'left' ? 'flex-row-reverse md:flex-row' : ''}`}>

                    {entry.isGreen ? (
                      <span className="timeline-tag font-mono text-xs uppercase px-2 py-0.5 bg-[#CCFF00] border border-[#2b1200] font-bold">Current</span>
                    ) : null}

                    <span className="timeline-tag font-mono text-xs uppercase bg-[#2b1200] text-white px-2 py-0.5 font-bold">
                      {entry.year}
                    </span>

                  </div>

                  <h3 className="timeline-title font-black text-lg uppercase mb-2">{entry.title}</h3>

                  <p className={`timeline-desc text-sm text-neutral-600 leading-relaxed max-w-sm ${entry.align === 'right' ? 'md:text-right' : 'text-left'}`}>
                    {entry.desc}
                  </p>

                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section >
  )
}

export default Evolution