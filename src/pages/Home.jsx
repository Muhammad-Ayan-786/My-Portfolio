import { site } from '../data/site'
import Hero from '../sections/home/Hero'
import IntroDock from '../sections/home/IntroDock'
import Manifesto from '../sections/home/Manifesto'
import Tapes from '../sections/home/Tapes'
import Path from '../sections/home/Path'
import FeaturedWork from '../sections/home/FeaturedWork'
import ClientWork from '../sections/home/ClientWork'
import OpenTo from '../sections/home/OpenTo'

export default function Home() {
  return (
    <>
      <title>{`${site.name} — ${site.role}`}</title>
      {/* The hero sticks to the viewport; everything else is a sheet that slides up over it */}
      <Hero />
      <div className="home-sheet relative z-[1] rounded-t-[2rem] bg-bg shadow-[0_-30px_90px_-30px_rgb(0_0_0/0.55)] md:rounded-t-[3rem]">
        <IntroDock />
        <Manifesto />
        <Tapes />
        <Path />
        <ClientWork />
        <FeaturedWork />
        <OpenTo />
      </div>
    </>
  )
}
