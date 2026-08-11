import React from 'react';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF9F5]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">

        {/* Logo - Far Left */}
        <div className="flex-1 flex justify-start">
          <a
            href="#hero"
            className="nav-logo text-2xl md:text-4xl font-black tracking-tight text-[#2b1200] hover:text-[#CCFF00] transition-colors"
          >
            M<span className="text-[#CCFF00]">.</span> AYAN
          </a>
        </div>

        {/* Navigation Links - Centered */}
        <nav className="flex items-center justify-center gap-4 md:gap-7">
          <a
            href="#about"
            className="nav-link relative py-1.5 text-xs md:text-sm font-semibold text-[#2b1200] transition-colors group"
          >
            Profile
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#CCFF00] scale-x-100 transition-transform duration-200 ease-out origin-left" />
          </a>
          <a
            href="#skills"
            className="nav-link relative py-1.5 text-xs md:text-sm font-semibold text-[#2b1200] transition-colors group"
          >
            Stack
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#CCFF00] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-left" />
          </a>
          <a
            href="#projects"
            className="nav-link relative py-1.5 text-xs md:text-sm font-semibold text-[#2b1200] transition-colors group"
          >
            Work
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#CCFF00] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-left" />
          </a>
          <a
            href="#journey"
            className="nav-link relative py-1.5 text-xs md:text-sm font-semibold text-[#2b1200] transition-colors group"
          >
            Evolution
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#CCFF00] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-left" />
          </a>
          <a
            href="#contact"
            className="nav-link relative py-1.5 text-xs md:text-sm font-semibold text-[#2b1200] transition-colors group"
          >
            Connect
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#CCFF00] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-left" />
          </a>
        </nav>

        {/* Resume Button - Far Right */}
        <div className="flex-1 flex justify-end">
          <a
            href="#resume"
            className="nav-resume border border-[#2b1200] px-5 py-2 font-mono text-[10px] md:text-xs uppercase font-bold hover:bg-[#CCFF00] active:bg-[#2b1200] active:text-white transition-colors rounded-none"
            id="nav-resume-btn"
          >
            Resume
          </a>
        </div>
      </div>
    </header>
  )
}

export default Navbar