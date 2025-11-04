'use client';

import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Timeline from './components/Timeline';
import Publications from './components/Publications';
import CVView from './components/CVView';
import ChatBot from './components/ChatBot';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'cv'>('home');
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [hasScrolledOnce, setHasScrolledOnce] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!hasScrolledOnce && window.scrollY > 0) {
        setHasScrolledOnce(true);
      }
      setShowScrollIndicator(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasScrolledOnce]);

  // Reset scroll when switching tabs
  useEffect(() => {
    window.scrollTo(0, 0);
    if (activeTab === 'home') {
      setShowScrollIndicator(true);
      setHasScrolledOnce(false);
    }
  }, [activeTab]);

  return (
    <>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'home' ? (
        <div className="min-h-screen pb-20 md:pb-0" style={{ background: '#FAF9F6' }}>
          {/* Hero Section */}
          <section className="min-h-screen md:h-screen flex flex-col justify-center px-6 py-20 md:py-12 relative">
            <div className="max-w-5xl mx-auto w-full">
              <div className="flex flex-col md:flex-row items-center gap-12 mb-12">
                {/* Headshot */}
                <div className="flex-shrink-0">
                  <img
                    src="/headshot.png"
                    alt="Patrick Herbert"
                    className="w-56 h-56 md:w-80 md:h-80 rounded-full object-cover shadow-xl"
                    style={{ border: '4px solid #8B9A7E' }}
                  />
                </div>

                {/* Text Content */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6" style={{ color: '#2B2B2B' }}>
                    Patrick Herbert
                  </h1>
                  <p className="text-2xl md:text-3xl font-medium mb-8" style={{ color: '#8B9A7E' }}>
                    Senior Machine Learning Engineer
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 mb-8" style={{ color: '#A89080' }}>
                    <a
                      href="mailto:pherbert.research@gmail.com"
                      className="transition-colors"
                      style={{ color: '#A89080' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#8B9A7E'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#A89080'}
                    >
                      pherbert.research@gmail.com
                    </a>
                    <span className="hidden md:inline">•</span>
                    <a
                      href="https://www.linkedin.com/in/pherbert3/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors"
                      style={{ color: '#A89080' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#8B9A7E'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#A89080'}
                    >
                      LinkedIn
                    </a>
                    <span className="hidden md:inline">•</span>
                    <a
                      href="https://github.com/pherber3"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors"
                      style={{ color: '#A89080' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#8B9A7E'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#A89080'}
                    >
                      GitHub
                    </a>
                    <span className="hidden md:inline">•</span>
                    <span>Chicago, IL</span>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="rounded-3xl p-8 max-w-4xl mx-auto mb-10" style={{ background: '#F5F1E8', border: '1px solid #E8E6E1' }}>
                <p className="text-lg leading-relaxed text-center" style={{ color: '#2B2B2B' }}>
                  Experienced AI / ML Engineer with expertise in building novel deep learning architectures from scratch and deploying production AI systems at scale. Combining theoretical depth as a published researcher with proven ability to deliver business-critical ML solutions in high-stakes environments.
                </p>
              </div>

              {/* Interests Section */}
              <div className="max-w-5xl mx-auto mb-10">
                <h2 className="text-2xl font-semibold mb-6 text-center" style={{ color: '#2B2B2B' }}>
                  Personal Interests
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="rounded-2xl p-5 text-center transition-all duration-300 hover:shadow-md" style={{ background: '#F5F1E8', border: '1px solid #E8E6E1' }}>
                    <div className="flex justify-center mb-3">
                      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="#8B9A7E" strokeWidth="1.5">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                        <path d="M10 6.5h4M10 17.5h4M6.5 10v4M17.5 10v4" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium" style={{ color: '#2B2B2B' }}>Multimodal Architectures</div>
                  </div>
                  <div className="rounded-2xl p-5 text-center transition-all duration-300 hover:shadow-md" style={{ background: '#F5F1E8', border: '1px solid #E8E6E1' }}>
                    <div className="flex justify-center items-center mb-3">
                      <svg className="w-12 h-12" viewBox="2 1 12 14" fill="#8B9A7E">
                        <path d="M4.732,7.95335,6.90908,2h3.63639L8.36364,7.01316h2.90911L4.72725,14,6.93656,7.95135Z" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium" style={{ color: '#2B2B2B' }}>Optimization</div>
                  </div>
                  <div className="rounded-2xl p-5 text-center transition-all duration-300 hover:shadow-md" style={{ background: '#F5F1E8', border: '1px solid #E8E6E1' }}>
                    <div className="flex justify-center mb-3">
                      <svg className="w-12 h-12" viewBox="0 0 512 512" fill="#8B9A7E">
                        <path d="M312.069,53.445c-71.26-71.26-187.194-71.26-258.454,0c-71.261,71.26-71.261,187.206,0,258.466
                      c71.26,71.26,187.194,71.26,258.454,0S383.329,124.705,312.069,53.445z M286.694,286.536
                      c-57.351,57.34-150.353,57.34-207.704-0.011s-57.351-150.353,0-207.693c57.351-57.351,150.342-57.351,207.693,0
                      S344.045,229.174,286.694,286.536z"/>
                        <path d="M101.911,112.531c-29.357,37.725-31.801,89.631-7.321,129.702c1.877,3.087,5.902,4.048,8.978,2.182
                      c3.065-1.888,4.037-5.903,2.16-8.978c-21.666-35.456-19.506-81.538,6.469-114.876c2.226-2.837,1.713-6.938-1.135-9.154
                      C108.227,109.193,104.125,109.695,101.911,112.531z"/>
                        <path d="M498.544,447.722l-132.637-129.2c-7.255-7.07-18.84-6.982-26.008,0.174l-21.033,21.033
                      c-7.156,7.156-7.234,18.742-0.153,25.986l129.19,132.636c14.346,17.324,35.542,18.35,51.917,1.964
                      C516.216,483.951,515.857,462.068,498.544,447.722z"/>
                      </svg>
                    </div>
                    <div className="text-sm font-medium" style={{ color: '#2B2B2B' }}>Interpretability</div>
                  </div>
                  <div className="rounded-2xl p-5 text-center transition-all duration-300 hover:shadow-md" style={{ background: '#F5F1E8', border: '1px solid #E8E6E1' }}>
                    <div className="flex justify-center mb-3">
                      <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" stroke="#8B9A7E" strokeWidth="2" strokeLinecap="round" strokeMiterlimit="10">
                        <rect x="7.04" y="7.04" width="33.91" height="33.91" rx="2" ry="2" transform="translate(0.07 -0.07) rotate(0.17)" />
                        <rect x="16.02" y="16.02" width="15.96" height="15.96" rx="1" ry="1" transform="translate(0.07 -0.07) rotate(0.17)" />
                        <line x1="24" y1="47.77" x2="24" y2="41.77" />
                        <line x1="29" y1="47.77" x2="29" y2="41.77" />
                        <line x1="34" y1="47.77" x2="34" y2="41.77" />
                        <line x1="39" y1="47.77" x2="39" y2="41.77" />
                        <line x1="9" y1="47.77" x2="9" y2="41.77" />
                        <line x1="14" y1="47.77" x2="14" y2="41.77" />
                        <line x1="19" y1="47.77" x2="19" y2="41.77" />
                        <line x1="24" y1="7" x2="24" y2="1" />
                        <line x1="29" y1="7" x2="29" y2="1" />
                        <line x1="34" y1="7" x2="34" y2="1" />
                        <line x1="39" y1="7" x2="39" y2="1" />
                        <line x1="9" y1="7" x2="9" y2="1" />
                        <line x1="14" y1="7" x2="14" y2="1" />
                        <line x1="19" y1="7" x2="19" y2="1" />
                        <line x1="7" y1="24" x2="1" y2="24" />
                        <line x1="7" y1="19" x2="1" y2="19" />
                        <line x1="7" y1="14" x2="1" y2="14" />
                        <line x1="7" y1="9" x2="1" y2="9" />
                        <line x1="7" y1="39" x2="1" y2="39" />
                        <line x1="7" y1="34" x2="1" y2="34" />
                        <line x1="7" y1="29" x2="1" y2="29" />
                        <line x1="47" y1="24" x2="41" y2="24" />
                        <line x1="47" y1="19" x2="41" y2="19" />
                        <line x1="47" y1="14" x2="41" y2="14" />
                        <line x1="47" y1="9" x2="41" y2="9" />
                        <line x1="47" y1="39" x2="41" y2="39" />
                        <line x1="47" y1="34" x2="41" y2="34" />
                        <line x1="47" y1="29" x2="41" y2="29" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium" style={{ color: '#2B2B2B' }}>High Performance Computing</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div
              className={`hidden md:block fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-500 ${showScrollIndicator ? 'opacity-60 hover:opacity-100' : 'opacity-0 pointer-events-none'}`}
              style={{ color: '#A89080' }}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </section>

          {/* Timeline Section */}
          <Timeline />

          {/* Publications Section */}
          <Publications />

          {/* CTA Section */}
          <section className="py-20 px-6" style={{ background: '#FAF9F6' }}>
            <div className="max-w-4xl mx-auto text-center">
              <div className="rounded-3xl p-12 shadow-lg" style={{ background: '#8B9A7E' }}>
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#FAF9F6' }}>
                  Want to learn more?
                </h2>
                <p className="text-lg mb-6" style={{ color: '#F5F1E8' }}>
                  View my CV for complete work history and publications, or chat with the AI assistant to dive deep into specific projects, technical implementations, and architectural decisions.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setActiveTab('cv')}
                    className="px-6 py-3 rounded-full font-medium transition-all duration-300"
                    style={{
                      background: '#FAF9F6',
                      color: '#8B9A7E',
                      border: '2px solid #FAF9F6'
                    }}
                  >
                    View CV
                  </button>
                  <button
                    onClick={() => {
                      const chatButton = document.querySelector('[aria-label="Toggle chat"]') as HTMLButtonElement;
                      chatButton?.click();
                    }}
                    className="px-6 py-3 rounded-full font-medium transition-all duration-300"
                    style={{
                      background: 'transparent',
                      color: '#FAF9F6',
                      border: '2px solid #FAF9F6'
                    }}
                  >
                    Chat with AI
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <CVView />
      )}

      {/* ChatBot Component - Always visible */}
      <ChatBot />
    </>
  );
}
