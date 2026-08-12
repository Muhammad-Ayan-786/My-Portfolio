import React, { useState } from 'react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: 'PROFILE', number: '01', href: '#profile' },
    { label: 'STACK', number: '02', href: '#stack' },
    { label: 'WORK', number: '03', href: '#projects' },
    { label: 'EVOLUTION', number: '04', href: '#evolution' },
    { label: 'CONNECT', number: '05', href: '#contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md">
        {/* <header className="sticky top-0 z-50 w-full bg-background/80 border-b border-primary backdrop-blur-md"> */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">

          {/* Logo */}
          <div className="flex-1 flex justify-start">
            <a href="#hero" className="nav-logo text-2xl md:text-4xl font-black tracking-tight text-primary transition-colors duration-300 group flex items-center">
              M<span className="text-accent transition-colors duration-300 group-hover:text-primary">.</span>AYAN
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-1.5 cursor-pointer"
            onClick={() => setMenuOpen(true)}
          >
            <span className="block w-6 h-0.5 bg-primary"></span>
            <span className="block w-6 h-0.5 bg-primary"></span>
            <span className="block w-6 h-0.5 bg-primary"></span>
          </button>

          {/* Navigation (desktop) */}
          <nav className="hidden md:flex items-center justify-center gap-4 md:gap-6 lg:gap-8">
            {navItems.map((item) => (
              <a
                key={item.number}
                href={item.href}
                className="nav-link opacity-0 relative py-2 text-[9px] md:text-[11px] font-bold tracking-[0.12em] text-primary transition-all duration-300 group"
              >
                {/* Number */}
                <span className="mr-1 text-primary/40 group-hover:text-primary transition-colors">
                  {item.number}
                </span>
                {/* Label */}
                {item.label}
                {/* Active / Hover line */}
                <span className="absolute left-[-3%] top-1/2 w-[106%] h-0.75 bg-accent -rotate-3 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" />
              </a>
            ))}
          </nav>

          {/* Resume (desktop) */}
          <div className="hidden md:flex flex-1 justify-end">
            <a
              href="/public/My_Resume.pdf"
              download="Modh_Ayan_Resume.pdf"
              className="nav-resume opacity-0 group relative flex items-center gap-3 border-2 border-primary px-4 md:px-5 py-2.5 text-[9px] md:text-[10px] uppercase font-bold tracking-[0.12em] text-primary transition-all duration-300 rounded-none overflow-hidden"
            >
              {/* Lime background */}
              <span className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10">RESUME</span>
              <span className="relative z-10 text-sm transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Full‑screen Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-8">
          <button
            className="absolute top-4 right-4 text-3xl font-bold text-primary cursor-pointer"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
          <nav className="flex flex-col items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.number}
                href={item.href}
                className="text-3xl font-black uppercase text-primary tracking-[0.12em]"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="/public/My_Resume.pdf"
              download="Modh_Ayan_Resume.pdf"
              className="mt-8 text-2xl font-black uppercase text-primary tracking-[0.12em] border-2 border-primary px-4 py-2"
              onClick={() => setMenuOpen(false)}
            >
              RESUME
            </a>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;