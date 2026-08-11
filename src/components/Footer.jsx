import React, { useRef } from 'react';
import { useFooterAnimation } from '../hooks/useFooterAnimation';

const Footer = () => {

  const socials = [
    { value: 'GITHUB', href: 'https://github.com' },
    { value: 'LINKEDIN', href: 'https://linkedin.com' },
    { value: 'INSTAGRAM', href: 'https://www.instagram.com/xo_.ani._/' },
    { value: 'EMAIL', href: 'mailto:mohd.ayan.asim.786@gmail.com' },
  ]
  const footerRef = useRef(null)
  useFooterAnimation(footerRef)

  return (
    <footer ref={footerRef} className="w-full bg-[#0e0600] text-white py-24 px-6 md:px-12 border-t border-[#2b1200]">
      <div className="footer-section max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-end">

        {/* Left Column: Heading + Links Stacked */}
        <div className="flex flex-col gap-12" id="footer-left-col">
          {/* Headline */}
          <div className="flex flex-col select-none" id="footer-headline">
            <h2 className="footer-heading text-5xl md:text-8xl font-black tracking-tight leading-none uppercase">
              START THE
            </h2>
            <h2 className="footer-heading text-5xl md:text-8xl font-black tracking-tight leading-none text-[#CCFF00] uppercase">
              DIALOGUE.
            </h2>
          </div>

          {/* Social Links stacked vertically */}
          <div className="flex flex-col gap-4 font-mono text-2xl md:text-4xl font-extrabold uppercase" id="footer-social-links">
            {
              socials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link text-white hover:text-[#CCFF00] transition-colors w-fit"
                  id={`footer-social-link-${idx}`}
                >
                  {social.value}
                </a>
              ))
            }
          </div>
        </div>

        {/* Right Column: Name + Subtitle */}
        <div className="flex flex-col items-start lg:items-end justify-end h-full" id="footer-right-col">
          <div className="flex flex-col items-start lg:items-end gap-2">
            <span className="text-5xl md:text-7xl font-black tracking-tighter text-[#CCFF00] uppercase">
              {
                ['M', 'O', 'H', 'D', ' ', 'A', 'Y', 'A', 'N'].map((letter, index) => (
                  <span key={index} className="letter">{letter}</span>
                ))
              }
            </span>
            <span className="footer-subtitle font-mono text-[10px] md:text-xs tracking-wider text-zinc-400 uppercase">
              &copy; 2026 MOHAMMAD AYAN &mdash; DEVELOPER &amp; TECHNOLOGIST
            </span>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer