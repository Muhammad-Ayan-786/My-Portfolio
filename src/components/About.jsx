import React, { useRef } from 'react';
import { useAboutAnimation } from '../hooks/useAboutAnimation';

const About = () => {

  const aboutRef = useRef(null)
  useAboutAnimation(aboutRef)

  return (
    <section ref={aboutRef} id="about" className="w-full border-b border-[#2b1200] relative bg-[#FAF9F5]">

      {/* About Heading */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-18 pb-12">
        <h2 className="about-heading text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#2b1200]">
          Profile
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24 md:pb-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left Column (Bold quote) */}
        <div className="quote-line border-l-8 border-[#CCFF00] pl-6 md:pl-8 py-4" id="about-quote">
          <h3 className="about-quote origin-left text-3xl md:text-5xl font-black tracking-tight leading-tight text-[#2b1200]">
            "Code is the medium, and the web is my canvas for impact."
          </h3>
        </div>

        {/* Right Column (About Box) */}
        <div className="about-box border border-[#2b1200] bg-white p-8 md:p-12 relative z-10 rounded-none" id="about-card">
          <p className="about-box-content text-[#2b1200] text-sm md:text-base leading-relaxed">
            I am a modern full-stack developer. My passion for full-stack development began with curiosity about how the web functions, rapidly working from basic HTML/CSS to crafting complex applications. I focus on the intersection of performance and aesthetics, ensuring that every project is fast and visually compelling. Focused on writing clean, maintainable code and building for scalability while creating user-centric digital experiences.
          </p>
        </div>

      </div>

    </section>
  )
}

export default About
