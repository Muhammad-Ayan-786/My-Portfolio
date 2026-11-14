import { site } from '../data/site'
import Hero from '../sections/home/Hero'
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
      <Hero />
      <Manifesto />
      <Tapes />
      <Path />
      <ClientWork />
      <FeaturedWork />
      <OpenTo />
    </>
  )
}
