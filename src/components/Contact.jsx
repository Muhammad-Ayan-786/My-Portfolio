import React from 'react';

const Contact = () => {
  const socials = [
    { label: 'EMAIL', value: 'hello@ayan.dev', href: 'mailto:hello@ayan.dev' },
    { label: 'GITHUB', value: 'github.com/ayan', href: 'https://github.com' },
    { label: 'LINKEDIN', value: 'linkedin.com/in/ayan', href: 'https://linkedin.com' },
    { label: 'TWITTER', value: '@ayanwrites', href: 'https://www.instagram.com/xo_.ani._/' }
  ]

  return (
    <section id="contact" className="w-full border-b border-[#2b1200] bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 lg:py-32">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-20">

          <div className="w-full lg:w-[65%]">
            {/* Headline */}
            <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.35em] text-neutral-600">
              CONTACT
            </p>
            {/* Heading */}
            <h2 className="max-w-4xl text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8.5rem] font-black uppercase leading-[0.8] tracking-[-0.06em] text-[#2b1200]">
              LET&apos;S TALK
            </h2>
            {/* Description */}
            <p className="mt-6 max-w-xl text-base md:text-lg font-mono leading-relaxed text-[#2b1200]">
              I&apos;m always interested in sharp ideas, ambitious builds, and collaborations that feel a little bit different.
            </p>

            <div className="mt-10 flex flex-col gap-6">
              {socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-start"
                >
                  <span className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-neutral-600">
                    {item.label}
                  </span>
                  <span className="inline-block cursor-pointer text-2xl sm:text-3xl md:text-[2rem] font-black uppercase tracking-[-0.04em] text-[#2b1200] transition-colors hover:text-[#CCFF00]">
                    {item.value}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="w-full max-w-md lg:ml-auto lg:mt-24">
            <div className="relative" id="contact-form-container">
              <div className="absolute inset-0 translate-x-3 translate-y-3 border-2 border-[#2b1200] bg-[#CCFF00] z-0" />

              <form
                onSubmit={(e) => e.preventDefault()}
                className="relative z-10 flex flex-col gap-5 border-2 border-[#2b1200] bg-[#FAF9F5] p-6 md:p-8"
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-neutral-600">
                    NAME
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Ayan"
                    className="w-full border border-[#2b1200] bg-white px-4 py-3 font-mono text-sm text-[#2b1200] focus:outline-none focus:bg-zinc-50"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-neutral-600">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    className="w-full border border-[#2b1200] bg-white px-4 py-3 font-mono text-sm text-[#2b1200] focus:outline-none focus:bg-zinc-50"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-neutral-600">
                    MESSAGE
                  </label>
                  <textarea
                    id="message"
                    rows="5"
                    placeholder="Tell me about your project..."
                    className="w-full resize-none border border-[#2b1200] bg-white px-4 py-3 font-mono text-sm text-[#2b1200] focus:outline-none focus:bg-zinc-50"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full border border-[#2b1200] bg-[#2b1200] px-4 py-3 text-center font-mono text-sm font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#CCFF00] hover:text-[#2b1200]"
                  id="contact-submit-btn"
                >
                  SEND MESSAGE
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact