import React from 'react'

const Navbar = () => {

  const navItems = [
    { label: 'PROFILE', number: '01', href: '#about' },
    { label: 'STACK', number: '02', href: '#skills' },
    { label: 'WORK', number: '03', href: '#projects' },
    { label: 'EVOLUTION', number: '04', href: '#journey' },
    { label: 'CONNECT', number: '05', href: '#contact' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF9F5]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">

        {/* Logo */}
        <div className="flex-1 flex justify-start">
          <a href="#hero" className="nav-logo text-2xl md:text-4xl font-black tracking-tight text-[#2b1200] transition-colors duration-300 group flex items-center">
            M
            <span className="text-[#CCFF00] transition-colors duration-300 group-hover:text-[#2b1200]">.</span>
            AYAN
          </a>
        </div>


        {/* Navigation */}
        <nav className="flex items-center justify-center gap-4 md:gap-6 lg:gap-8">

          {navItems.map((item) => (
            <a key={item.number} href={item.href}
              className="nav-link opacity-0 relative py-2 text-[9px] md:text-[11px] font-bold tracking-[0.12em] text-[#2b1200] transition-all duration-300 group">

              {/* Number */}
              <span className="mr-1 text-[#2b1200]/40 group-hover:text-[#2b1200] transition-colors">
                {item.number}
              </span>

              {/* Label */}
              {item.label}

              {/* Active / Hover line */}
              <span className="absolute left-[-3%] top-1/2 w-[106%] h-0.75 bg-[#CCFF00] -rotate-3 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" />
            </a>
          ))}

        </nav>


        {/* Resume */}
        <div className="flex-1 flex justify-end">

          <a href="#resume"
            className="nav-resume opacity-0 group relative flex items-center gap-3 border-2 border-[#2b1200] px-4 md:px-5 py-2.5 text-[9px] md:text-[10px] uppercase font-bold tracking-[0.12em] text-[#2b1200] transition-all duration-300 rounded-none overflow-hidden">

            {/* Lime background */}
            <span className="absolute inset-0 bg-[#CCFF00] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />

            <span className="relative z-10">RESUME</span>

            <span className="relative z-10 text-sm transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
          </a>

        </div>

      </div>
    </header>
  )
}

export default Navbar