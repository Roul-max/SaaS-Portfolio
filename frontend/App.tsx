import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './sections/Home';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Experience from './sections/Experience';
import Contact from './sections/Contact';
import Interests from './sections/Interests';
import AIChat from './components/AIChat';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      <Navbar />

      <main>
        <Home />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Interests />
        <AIChat />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default App;