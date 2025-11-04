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
      className="sticky top-[56px] md:top-[57px] z-40 backdrop-blur-sm py-4"
      style={{ background: 'rgba(250, 249, 246, 1)', borderBottom: '1px solid #E8E6E1', marginTop: '-2px' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <nav className="flex gap-6 overflow-x-auto pb-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onNavigate(section.id)}
              className="whitespace-nowrap pb-2 font-medium transition-all duration-300 flex-shrink-0"
              style={{
                color: activeSection === section.id ? '#8B9A7E' : '#A89080',
                borderBottom: activeSection === section.id ? '2px solid #8B9A7E' : '2px solid transparent',
              }}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
