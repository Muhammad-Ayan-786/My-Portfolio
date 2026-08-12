import React from 'react';
import { Cursor, useTypewriter } from 'react-simple-typewriter';
import CustomCursor from './CustomCursor';

const Hero = () => {

  const sentencesArray = [
    'Building with HTML...',
    'Building with CSS...',
    'Building with JavaScript...',
    'Building with React...',
    'Building with Redux...',
    'Building with Tailwind...',
    'Building with TypeScript...',
    'Building with Node.js...',
    'Building with Express...',
    'Building with MongoDB...'
  ];

  const [text] = useTypewriter({
    words: sentencesArray,
    loop: true,
    delaySpeed: 2000,
    typeSpeed: 80,
    deleteSpeed: 50,
  });

  const nameLetters = ['M', 'O', 'H', 'D', ' ', 'A', 'Y', 'A', 'N'];

  return (
    <section
      id="hero"
      className="w-full h-svh min-h-162.5 bg-background relative overflow-hidden px-6"
    >

      <CustomCursor />

      {/* Top Information Bar */}
      <div className="max-w-7xl mx-auto w-full absolute top-0 left-1/2 -translate-x-1/2 px-6 md:px-12 lg:px-6 z-20">
        <div className="hero-top flex items-center justify-between pt-6 text-[10px] md:text-xs font-bold uppercase tracking-[0.18em] text-primary">

          <span>M.AYAN.DEV</span>
          <span className="hidden md:block">FRONT-END / 2026</span>
          <span>JHB ↗</span>

        </div>
      </div>


      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto w-full h-full relative z-10">

        {/* =========== NAME - MOHD =========== */}
        <div
          id="hero-left"
          className="hero-left absolute left-0 top-[15%] md:top-[13%] lg:top-[12%] z-10"
        >
          <h1 className="hero-name text-[clamp(5rem,13vw,12rem)] font-black tracking-[-0.08em] uppercase leading-[0.72] select-none text-primary flex">
            {nameLetters.slice(0, 4).map((letter, index) => (
              <span
                key={index}
                className="letter letter-mohd inline-block"
              >
                {letter}
              </span>
            ))}
          </h1>

          <div className="hero-underline h-2 bg-primary w-48 md:w-64 lg:w-72 mt-6 origin-left" />
        </div>


        {/* =========== PHOTO =========== */}
        <div
          id="hero-right"
          className="hero-right absolute z-0
            left-[18%] top-[28%]
            w-[52%] h-[42%]
            md:left-[27%] md:top-[23%]
            md:w-[43%] md:h-[54%]
            lg:left-[32%] lg:top-[20%]
            lg:w-[38%] lg:h-[58%]"
        >

          <div
            className="hero-photo absolute inset-0 bg-accent border-2 border-primary"
            style={{
              backgroundImage: 'url(/src/assets/portfolio-img.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'top',
              backgroundRepeat: 'no-repeat',
            }}
          />

          {/* Image Label */}
          <div className="hero-photo-label absolute -right-3 -top-3 md:-right-5 md:-top-5 bg-accent border-2 border-primary px-3 py-1 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-primary">
            01 / ME
          </div>

        </div>


        {/* ========== NAME - AYAN =========== */}
        <div className="absolute right-[-1%] md:right-[-2%] lg:right-[-1%] top-[39%] md:top-[38%] lg:top-[39%] z-10">

          <h1 className="hero-name text-[clamp(5rem,13vw,12rem)] font-black tracking-[-0.08em] uppercase leading-[0.72] select-none text-primary">
            {nameLetters.slice(5).map((letter, index) => (
              <span
                key={index}
                className="letter letter-ayan inline-block"
              >
                {letter}
              </span>
            ))}
          </h1>

        </div>


        {/* ========== TAGLINE =========== */}
        <div className="absolute left-0 bottom-[28%] md:bottom-[25%] lg:bottom-[24%] z-10 max-w-65 md:max-w-[320px]">

          <h2 className="hero-tag text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase leading-[0.95] text-primary">
            FRONT-END
            <br />
            DEVELOPER
          </h2>

          <div className="hero-making mt-3 text-[9px] md:text-[10px] uppercase tracking-[0.18em] font-bold text-primary/50">
            IN THE MAKING
          </div>

        </div>


        {/* ========== TYPEWRITER =========== */}
        <div className="absolute left-0 bottom-[18%] md:bottom-[16%] lg:bottom-[15%] z-10">

          <span className="hero-typewriter font-mono text-xs md:text-sm text-primary/70 uppercase tracking-wide">
            &gt; {text}
            <span className="cursor-blink">|</span>
          </span>

        </div>


        {/* ========== PARAGRAPH =========== */}
        <div className="absolute left-[52%] md:left-[55%] lg:left-[60%] bottom-[18%] md:bottom-[17%] lg:bottom-[16%] z-10 max-w-75 md:max-w-90">
          <p className="hero-paragraph text-xs md:text-sm text-primary/80 leading-relaxed font-medium">
            I build interactive web experiences where code meets visual design.
          </p>
        </div>


        {/* ========== ACTIONS =========== */}
        <div className='hero-actions absolute left-[52%] md:left-[55%] lg:left-[60%] bottom-[6%] z-10 flex items-center gap-3'>
          <a
            href="#projects"
            className="px-5 md:px-7 py-2.5 md:py-3 bg-primary text-accent text-[10px] md:text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_var(--color-accent-rgba)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            View Projects
          </a>

          <a
            href='/public/resume.pdf'
            download='Modh_Ayan_Resume.pdf'
            className="px-5 md:px-7 py-2.5 md:py-3 border-2 border-primary text-primary text-[10px] md:text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-accent transition-all"
          >
            Download Resume ↗
          </a>
        </div>


        {/* ========== INFO =========== */}
        <div className="absolute bottom-5 left-0 right-0 flex items-center justify-between text-[9px] md:text-[10px] uppercase tracking-[0.18em] font-bold text-primary/50">

          <span className="hero-meta flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-accent border border-primary rounded-full" />
            Available to build
          </span>

          <a href="#profile" className="hero-meta">Scroll ↓</a>
        </div>

      </div>

    </section>
  );
};

export default Hero;