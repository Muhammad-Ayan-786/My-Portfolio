import React, { useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Profile from './components/Profile';
import Stack from './components/Stack';
import Projects from './components/Projects';
import Evolution from './components/Evolution';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useIntroAnimation } from './hooks/useIntroAnimation';
import Loader from './components/Loader';

const App = () => {
  const [loading, setLoading] = useState(true);

  const introRef = useRef()
  useIntroAnimation(introRef, loading)

  return (
    <div ref={introRef} className="min-h-screen bg-background text-primary flex flex-col font-sans selection:bg-accent">
      {loading ? (
        <Loader setLoading={setLoading} />
      ) : (
        <>
          <Navbar />
          <Hero />
          <Profile />
          <Stack />
          <Projects />
          <Evolution />
          <Contact />
          <Footer />
        </>
      )}
    </div>);
}

export default App