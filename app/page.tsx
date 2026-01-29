'use client';

import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Timeline from './components/Timeline';
import Publications from './components/Publications';
import CVView from './components/CVView';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'cv'>('home');
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  // Handle scroll for indicator fade-out
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset scroll when switching tabs
  useEffect(() => {
    window.scrollTo(0, 0);
    if (activeTab === 'home') {
      setShowScrollIndicator(true);
    }
  }, [activeTab]);

  return (
    <>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'home' ? (
        <div className="min-h-screen pb-20 md:pb-0">
          {/* Hero Section */}
          <section className="min-h-[90vh] flex flex-col justify-center px-6 py-20 relative">
            <div className="max-w-5xl mx-auto w-full">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-12 mb-16">
                {/* Headshot - Sharper border */}
                <div className="flex-shrink-0 relative group">
                  <div className="absolute inset-0 bg-[#3A4D39] rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                  <img
                    src="/headshot.png"
                    alt="Patrick Herbert"
                    className="relative w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border border-[#E5E2D9] shadow-xl"
                  />
                </div>

                {/* Text Content */}
                <div className="flex-1 text-center md:text-left pt-4">
                  <h1 className="text-5xl md:text-7xl font-serif font-medium tracking-tight mb-6 text-[#1A1A1A]">
                    Patrick Herbert
                  </h1>
                  <p className="text-xl md:text-2xl font-serif italic text-[#3A4D39] mb-8">
                    Senior Machine Learning Engineer
                  </p>
                  
                  {/* Polished Contact Links */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 mb-10 text-[#4A4A4A] text-xs font-mono uppercase tracking-widest">
                    <a href="mailto:pherbert.research@gmail.com" className="hover:text-[#3A4D39] hover:underline underline-offset-4 transition-all">
                      Email
                    </a>
                    <span className="text-[#E5E2D9]">|</span>
                    <a href="https://www.linkedin.com/in/pherbert3/" target="_blank" className="hover:text-[#3A4D39] hover:underline underline-offset-4 transition-all">
                      LinkedIn
                    </a>
                    <span className="text-[#E5E2D9]">|</span>
                    <a href="https://github.com/pherber3" target="_blank" className="hover:text-[#3A4D39] hover:underline underline-offset-4 transition-all">
                      GitHub
                    </a>
                  </div>

                  <div className="prose prose-lg text-[#4A4A4A] max-w-2xl leading-relaxed">
                    <p>
                      Specializing in building novel deep learning architectures from scratch and deploying production AI systems at scale. Combining theoretical depth as a published researcher with hands-on engineering in high-stakes environments.
                    </p>
                  </div>
                </div>
              </div>

              {/* Structured Research Interests */}
              <div className="max-w-5xl mx-auto mt-16">
                <h2 className="text-xs font-mono text-[#787570] uppercase tracking-widest mb-8 border-b border-[#E5E2D9] pb-4">
                  Research Focus Areas
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {['Multimodal Architectures', 'Optimization', 'Interpretability', 'High Performance Computing'].map((item) => (
                    <div key={item} className="group flex flex-col items-start cursor-default">
                        {/* Decorative accent line that grows on hover */}
                        <div className="w-8 h-0.5 bg-[#E5E2D9] mb-4 group-hover:w-full group-hover:bg-[#3A4D39] transition-all duration-500"></div>
                        <span className="font-serif text-lg text-[#1A1A1A] group-hover:text-[#3A4D39] transition-colors leading-tight">
                          {item}
                        </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div
              className={`hidden md:flex fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex-col items-center gap-2 transition-all duration-700 ${
                showScrollIndicator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#787570]">Scroll</span>
              <svg 
                className="w-5 h-5 text-[#3A4D39] animate-bounce" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7-7-7m14-8l-7 7-7-7" />
              </svg>
            </div>
          </section>

          <Timeline />
          <Publications />

          {/* Elegant CTA */}
          <section className="py-32 px-6 border-t border-[#E5E2D9] bg-[#F4F2ED]">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif italic mb-6 text-[#3A4D39]">
                Take a Closer Look
              </h2>
              <p className="text-[#787570] mb-8 leading-relaxed">
                My background combines academic rigor with production engineering. 
                You can read the full CV, or ask the AI assistant about specific implementation details.
              </p>
              <button
                onClick={() => setActiveTab('cv')}
                className="px-8 py-3 bg-[#3A4D39] text-white rounded-full hover:bg-[#2A3829] transition-all duration-300 font-medium shadow-lg shadow-[#3A4D39]/20 hover:shadow-xl"
              >
                Examine Full CV
              </button>
            </div>
          </section>
        </div>
      ) : (
        <CVView />
      )}

    </>
  );
}