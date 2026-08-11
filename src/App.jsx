import React, { useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Journey from './components/Journey';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useIntroAnimation } from './hooks/useIntroAnimation';
import Loader from './components/Loader';

const App = () => {
  const [loading, setLoading] = useState(false);

  const introRef = useRef()
  useIntroAnimation(introRef, loading)

  return (
    <div ref={introRef} className="min-h-screen bg-[#FAF9F5] text-[#2b1200] flex flex-col font-sans selection:bg-[#CCFF00]">
      {loading ? (
        <Loader setLoading={setLoading} />
      ) : (
        <>
          <Navbar />
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Journey />
          <Contact />
          <Footer />
        </>
      )}
    </div>);
}

export default App