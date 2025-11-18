'use client';

interface CVGlossaryProps {
  onNavigate: (section: string) => void;
  activeSection: string;
}

export default function CVGlossary({ onNavigate, activeSection }: CVGlossaryProps) {
  const sections = [
    { id: 'experience', label: 'Experience' },
    { id: 'publications', label: 'Publications' },
    { id: 'skills', label: 'Technical Skills' },
    { id: 'education', label: 'Education' },
  ];

  return (
    <div
      className="sticky top-0 z-40 w-full border-b border-[#E5E2D9] bg-[#FDFCFB]/95 backdrop-blur-xl transition-all duration-200"
    >
      {/* 
         1. We use top-0 so the background covers the very top of the screen.
         2. We add pt-20 (padding-top) to make room for the main Floating Pill Navigation 
            (which is at top-6).
      */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-0">
        <nav className="flex gap-8 overflow-x-auto no-scrollbar">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onNavigate(section.id)}
              className={`
                whitespace-nowrap py-3 text-xs font-mono tracking-widest uppercase transition-all duration-300
                border-b-2 
                ${activeSection === section.id 
                  ? 'text-[#1A1A1A] border-[#3A4D39]' 
                  : 'text-[#787570] border-transparent hover:text-[#3A4D39]'
                }
              `}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}