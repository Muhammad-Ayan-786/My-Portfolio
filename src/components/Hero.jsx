import React from 'react';
import { Cursor, useTypewriter } from 'react-simple-typewriter';

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
  ]

  const [text] = useTypewriter({
    words: sentencesArray,
    loop: true,
    delaySpeed: 2000,
    typeSpeed: 80,
    deleteSpeed: 50,
  })


  return (
    <section id="hero" className="w-full bg-[#FAF9F5] relative overflow-hidden lg:min-h-162.5 flex items-stretch px-6 lg:px-6">

      {/* Green Block on the right - starts below the header area, extends to the right viewport edge */}
      <div
        className="hero-photo absolute right-6 top-36 bottom-0 left-[60%] bg-[#CCFF00] z-0 hidden lg:block"
        style={{ height: 'calc(100% - 175px)', backgroundImage: 'url(/src/assets/portfolio-img.png)', backgroundSize: 'cover', backgroundPosition: 'top', backgroundRepeat: 'no-repeat' }}
      />

      {/* <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-6 py-20 md:py-32 relative z-10 w-full flex items-start"> */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-6 py-20 md:py-20 relative z-10 w-full flex items-start">


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full">

          {/* Left Column (Content aligned near the top) */}
          <div className="lg:col-span-7 flex flex-col gap-6" id="hero-left">
            <div className="flex flex-col gap-3">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none select-none text-[#2b1200]">
                {/* <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none select-none text-[#0a194a]"> */}
                {
                  ['M', 'O', 'H', 'D', ' ', 'A', 'Y', 'A', 'N'].map((letter, index) => (
                    <span key={index} className="letter">{letter}</span>
                  ))
                }
              </h1>
              {/* Thick dark coffee-brown underline */}
              <div className="hero-underline h-2 bg-[#2b1200] w-72 mt-1 origin-left" />
              {/* <div className="hero-underline h-2 bg-[#04144e] w-72 mt-1 origin-left" /> */}
            </div>

            <div className="flex flex-col gap-4 mt-6">
              <h2 className="hero-tag text-3xl md:text-5xl font-black tracking-tight uppercase leading-tight text-[#2b1200] z-10">
                {/* <h2 className="hero-tag text-3xl md:text-5xl font-black tracking-tight uppercase leading-tight text-[#071648] z-10"> */}
                FULL-STACK DEVELOPER IN THE MAKING
              </h2>

              {/* Typewriter placeholder */}
              <span className="hero-typewriter font-mono text-base text-[#2b1200]/70 uppercase tracking-wide">
                {/* <span className="hero-typewriter font-mono text-base text-[#071648]/70 uppercase tracking-wide"> */}
                &gt; {text}
                {/* <span><Cursor cursorColor='#2b1200' cursorStyle='|' /></span> */}
                <span className="cursor-blink">|</span>
              </span>

              <p className="hero-paragraph text-sm md:text-base text-[#2b1200]/90 leading-relaxed max-w-xl font-medium mt-4">
                {/* <p className="hero-paragraph text-sm md:text-base text-[#071648]/90 leading-relaxed max-w-xl font-medium mt-4"> */}
                I am a Grade 11 student passionately immersed in the full-stack ecosystem. I thrive on the challenge of architecting systems that are both highly performant and aesthetically compelling.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 relative lg:pt-48 flex justify-start w-full" id="hero-right">
            <div
              className="w-full aspect-4/3 border-2 border-[#2b1200] relative lg:hidden mt-8 rounded-none"
              style={{ backgroundImage: 'url(/src/assets/portfolio-img.png)', backgroundSize: 'cover', backgroundPosition: 'top', backgroundRepeat: 'no-repeat' }}
            />
          </div>

        </div>

      </div>
    </section >
  )
}

export default Hero