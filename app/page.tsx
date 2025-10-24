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

  // Reset scroll when switching to home tab
  useEffect(() => {
    if (activeTab === 'home') {
      window.scrollTo(0, 0);
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
                className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover shadow-xl"
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
          <div className="rounded-3xl p-6 max-w-3xl mx-auto mb-8" style={{ background: '#F5F1E8', border: '1px solid #E8E6E1' }}>
            <p className="text-base leading-relaxed text-center" style={{ color: '#2B2B2B' }}>
              Experienced AI / ML Engineer with expertise in building novel deep learning architectures from scratch and deploying production AI systems at scale. Combining theoretical depth as a published researcher with proven ability to deliver business-critical ML solutions in high-stakes environments.
            </p>
          </div>

          {/* Interests Section */}
          <div className="max-w-4xl mx-auto mb-8">
            <h2 className="text-xl font-semibold mb-4 text-center" style={{ color: '#2B2B2B' }}>
              Personal Interests
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-2xl p-3 text-center transition-all duration-300 hover:shadow-md" style={{ background: '#F5F1E8', border: '1px solid #E8E6E1' }}>
                <div className="flex justify-center mb-2">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#8B9A7E" strokeWidth="1.5">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <path d="M10 6.5h4M10 17.5h4M6.5 10v4M17.5 10v4" />
                  </svg>
                </div>
                <div className="text-xs font-medium" style={{ color: '#2B2B2B' }}>Multimodal Architectures</div>
              </div>
              <div className="rounded-2xl p-3 text-center transition-all duration-300 hover:shadow-md" style={{ background: '#F5F1E8', border: '1px solid #E8E6E1' }}>
                <div className="flex justify-center items-center mb-2">
                  <svg className="w-8 h-8" viewBox="2 1 12 14" fill="#8B9A7E">
                    <path d="M4.732,7.95335,6.90908,2h3.63639L8.36364,7.01316h2.90911L4.72725,14,6.93656,7.95135Z"/>
                  </svg>
                </div>
                <div className="text-xs font-medium" style={{ color: '#2B2B2B' }}>Optimization</div>
              </div>
              <div className="rounded-2xl p-3 text-center transition-all duration-300 hover:shadow-md" style={{ background: '#F5F1E8', border: '1px solid #E8E6E1' }}>
                <div className="flex justify-center mb-2">
                  <svg className="w-8 h-8" viewBox="0 0 512 512" fill="#8B9A7E">
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
                <div className="text-xs font-medium" style={{ color: '#2B2B2B' }}>Interpretability</div>
              </div>
              <div className="rounded-2xl p-3 text-center transition-all duration-300 hover:shadow-md" style={{ background: '#F5F1E8', border: '1px solid #E8E6E1' }}>
                <div className="flex justify-center mb-2">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#8B9A7E">
                    <path d="M14.3335126,2.85206923 L19.0436746,5.57156232 C19.1861408,5.42269933 19.3517561,5.29107777 19.5390336,5.18229987 C20.6054985,4.56924218 21.9657203,4.93324518 22.585164,5.99971013 C23.1982217,7.06617507 22.8342187,8.42639682 21.7677537,9.04584053 C21.5354003,9.17940894 21.2887997,9.26659782 21.038849,9.31024708 L21.038849,14.6900096 C21.2856344,14.7341019 21.5290274,14.8207365 21.7585099,14.9526546 C22.8303433,15.5715108 23.1940011,16.9304425 22.5751449,17.9958959 C21.9626686,19.0613494 20.597357,19.4250072 19.5319036,18.8125309 C19.2675499,18.6605671 19.046399,18.4622584 18.8726413,18.2336837 L14.2472483,20.9042339 C14.359389,21.1704807 14.4213527,21.4632106 14.4213527,21.770637 C14.4213527,22.997106 13.4248466,24 12.1919896,24 C10.9591327,24 9.96262662,23.0034939 9.96262662,21.770637 C9.96262662,21.5276826 10.001326,21.293907 10.0729072,21.0751276 L5.39448212,18.3739583 C5.24136397,18.5447862 5.05910975,18.6948998 4.84979559,18.8164775 C3.77694463,19.4295352 2.41672287,19.0655322 1.80366518,17.9990673 C1.19060749,16.9326023 1.55461049,15.5723806 2.62107544,14.9529369 C2.78345801,14.8595912 2.95265101,14.7888975 3.12500248,14.7398866 L3.12500248,9.26050018 C2.95045269,9.21143227 2.77917162,9.14021295 2.61500295,9.04584053 C1.548538,8.43278284 1.184535,7.06617507 1.79759269,5.99971013 C2.41065038,4.93324518 3.77725815,4.56924218 4.8437231,5.18229987 C4.99574654,5.27060092 5.13349582,5.37395472 5.25617553,5.48936462 L10.0208088,2.73842163 C9.98274768,2.57496174 9.96262662,2.40454853 9.96262662,2.22936302 C9.96262662,0.996506107 10.9591327,4.6629367e-14 12.1919896,4.6629367e-14 C13.4248466,4.6629367e-14 14.4213527,0.996506107 14.4213527,2.22936302 C14.4213527,2.44556708 14.3907061,2.6545024 14.3335126,2.85206923 Z M13.8405544,3.73141097 C13.7908242,3.78597435 13.7384158,3.8380524 13.6835353,3.88743909 L19.9624322,14.7624885 C19.9851165,14.7552188 20.0079142,14.7483109 20.0308156,14.7417672 L20.0308156,9.25474103 C19.4969015,9.10015188 19.0200076,8.74749468 18.7216233,8.22843028 C18.396599,7.66302338 18.3462063,7.01504748 18.5295247,6.43866863 L13.8405544,3.73141097 Z M10.5612952,3.75078761 C10.5290822,3.71626947 10.4979547,3.6807246 10.4679668,3.64420691 L5.81568405,6.33028239 C6.04182311,6.93281226 6.00669953,7.62728911 5.66113335,8.22843028 C5.32249418,8.81752134 4.75393127,9.19227671 4.13303588,9.30641503 L4.13303588,14.6916383 C4.16637437,14.6977154 4.19956458,14.7045461 4.23257942,14.7121233 L10.5612952,3.75078761 Z M12.8009687,4.3748119 C12.60746,4.42948073 12.403193,4.45872604 12.1919896,4.45872604 C11.9129003,4.45872604 11.645923,4.40765895 11.3998763,4.31434325 L5.14116232,15.1544358 C5.34676617,15.3211714 5.52618301,15.5275552 5.66720584,15.7703471 C5.76055152,15.9327297 5.83124515,16.1019227 5.8802561,16.2742741 L18.5020915,16.2742741 C18.5510684,16.101457 18.6218024,15.9318817 18.7152686,15.7692896 C18.8216025,15.5843129 18.950628,15.4204894 19.0968364,15.2792547 L12.8009687,4.3748119 Z M13.7498392,20.1747099 L18.4885766,17.4387184 C18.4752977,17.3870257 18.4638585,17.3348529 18.454287,17.2823075 L5.92850441,17.2823075 C5.91572246,17.3524283 5.89960649,17.4218931 5.88022341,17.4904498 L10.5957921,20.2130645 C11.0004395,19.7984186 11.5657199,19.541274 12.1919896,19.541274 C12.7987163,19.541274 13.3482006,19.7826203 13.7498392,20.1747099 Z"/>
                  </svg>
                </div>
                <div className="text-xs font-medium" style={{ color: '#2B2B2B' }}>Geometric Deep Learning</div>
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
