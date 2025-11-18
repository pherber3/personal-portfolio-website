'use client';

interface NavigationProps {
  activeTab: 'home' | 'cv';
  onTabChange: (tab: 'home' | 'cv') => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="sticky top-6 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto bg-white/80 backdrop-blur-md border border-[#E5E2D9] p-1 rounded-full shadow-sm flex gap-1">
        <button
          onClick={() => onTabChange('home')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            activeTab === 'home'
              ? 'bg-[#3A4D39] text-white shadow-sm'
              : 'text-[#787570] hover:text-[#1A1A1A]'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => onTabChange('cv')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            activeTab === 'cv'
              ? 'bg-[#3A4D39] text-white shadow-sm'
              : 'text-[#787570] hover:text-[#1A1A1A]'
          }`}
        >
          Curriculum Vitae
        </button>
      </div>
    </nav>
  );
}