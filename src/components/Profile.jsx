import React, { useRef } from 'react'
import { useProfileAnimation } from '../hooks/useProfileAnimation'

const Profile = () => {

  const profileRef = useRef(null)
  useProfileAnimation(profileRef)

  return (
    <section
      id="profile"
      ref={profileRef}
      className="w-full min-h-screen bg-background text-primary px-6 md:px-12 py-24 overflow-hidden"
    >
      <div id="profile-card" className="max-w-7xl mx-auto">

        {/* TOP HEADER */}
        <div className="flex items-end justify-between border-b-2 border-primary pb-4">
          <h2 className="profile-title text-[5rem] md:text-[7rem] lg:text-[9rem] leading-[0.75] font-black tracking-tighter uppercase">PROFILE</h2>

          <span className="profile-index hidden md:block font-mono text-sm tracking-widest">01 / WHO I AM</span>
        </div>


        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mt-20">

          {/* LEFT — QUOTE */}
          <div className="lg:col-span-7 relative">

            {/* LIME BAR */}
            <div className="profile-bar absolute left-0 top-2 w-2 h-[calc(100%-8px)] bg-accent" />

            <blockquote className="profile-quote pl-8 md:pl-12 text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] uppercase">
              "Code is the medium,
              <br />
              and the web is my
              <br />
              canvas for impact."
            </blockquote>

            {/* SMALL LABEL */}
            <div className="profile-label mt-12 pl-8 md:pl-12 font-mono text-xs tracking-[0.25em] uppercase text-primary/60">
              Curious by default.
              <br />
              Obsessed with details.
            </div>
          </div>


          {/* RIGHT — BIO */}
          <div className="lg:col-span-5 flex flex-col gap-10">

            <div className="profile-bio border border-primary p-8 md:p-10">
              <span className="font-mono text-xs tracking-[0.25em] uppercase text-primary/50">01 — PROFILE</span>

              <p className="mt-8 text-lg md:text-xl leading-relaxed">
                I'm a front-end developer in the making, currently expanding
                into the full-stack ecosystem. I enjoy turning ideas into
                interfaces that feel as good as they function.
              </p>

              <p className="mt-5 text-lg md:text-xl leading-relaxed">
                I'm especially interested in the intersection of
                <span className="font-bold"> engineering, interaction, and visual design.</span>
              </p>
            </div>


            {/* INFO GRID */}
            <div className="profile-info grid grid-cols-2 border-t border-primary">

              <div className="py-5 border-b border-r border-primary">
                <span className="font-mono text-[10px] tracking-widest opacity-50">CURRENTLY</span>
                <p className="mt-2 font-bold uppercase">Front-End</p>
              </div>

              <div className="py-5 border-b border-primary pl-5">
                <span className="font-mono text-[10px] tracking-widest opacity-50">LEARNING</span>
                <p className="mt-2 font-bold uppercase">Back-End</p>
              </div>

              <div className="py-5 border-r border-primary">
                <span className="font-mono text-[10px] tracking-widest opacity-50">FOCUS</span>
                <p className="mt-2 font-bold uppercase">Full-Stack</p>
              </div>

              <div className="py-5 pl-5">
                <span className="font-mono text-[10px] tracking-widest opacity-50">STATUS</span>
                <p className="mt-2 font-bold uppercase flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent" />Building</p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  )
}

export default Profile