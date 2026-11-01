import { site } from '../data/site'
import Hero from '../sections/home/Hero'
import Manifesto from '../sections/home/Manifesto'
import Tapes from '../sections/home/Tapes'
import Path from '../sections/home/Path'
import FeaturedWork from '../sections/home/FeaturedWork'

export default function Home() {
  return (
    <>
      <title>{`${site.name} — ${site.role}`}</title>
      <Hero />
      <Manifesto />
      <Tapes />
      <Path />
      <FeaturedWork />
    </>
  )
}
