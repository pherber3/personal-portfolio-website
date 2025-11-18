'use client';

import { useState } from 'react';
import { Experience } from '../data/experience';

interface TimelineItemProps {
  experience: Experience;
  isLast: boolean;
}

export default function TimelineItem({ experience, isLast }: TimelineItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative pl-8 md:pl-0 group">
      {/* Desktop: Left/Right Layout */}
      <div className="md:grid md:grid-cols-[120px_1fr] gap-8 mb-12 relative">
        
        {/* Left Column: Date */}
        <div className="hidden md:block text-right pt-1">
          <span className="font-mono text-xs text-[#787570] tracking-wide">
            {experience.dates}
          </span>
        </div>

        {/* Vertical Line (Connector) */}
        {!isLast && (
          <div className="hidden md:block absolute left-[139px] top-[28px] bottom-[-48px] w-[1px] bg-[#E5E2D9]"></div>
        )}
        
        {/* Dot */}
        <div className="hidden md:block absolute left-[136px] top-[6px] w-[7px] h-[7px] rounded-full bg-[#1A1A1A] ring-4 ring-[#FDFCFB]"></div>

        {/* Right Column: Content */}
        <div className="relative">
           {/* Mobile Date */}
           <div className="md:hidden font-mono text-xs text-[#787570] mb-2">
             {experience.dates}
           </div>

           <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-left group-hover:translate-x-1 transition-transform duration-300"
           >
            <h3 className="text-xl font-serif font-medium text-[#1A1A1A] group-hover:text-[#3A4D39] transition-colors">
              {experience.company}
            </h3>
            <p className="text-sm font-medium text-[#787570] uppercase tracking-wider mb-3">
              {experience.role}
            </p>
            <p className="text-[#4A4A4A] leading-relaxed mb-4">
              {experience.summary}
            </p>
            
            <div className="flex items-center text-xs font-medium text-[#3A4D39]">
               {isExpanded ? 'Close Details' : 'View Technical Details'} 
               <span className="ml-2 text-lg leading-none">{isExpanded ? '−' : '+'}</span>
            </div>
           </button>

           {/* Expandable Details - styled like a footnote/appendix */}
           <div
              className={`grid transition-all duration-300 ease-in-out ${
                isExpanded ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0 mt-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="pl-4 border-l-2 border-[#3A4D39]/20 space-y-3 bg-[#F4F2ED]/50 p-4 rounded-r-lg">
                  {experience.details.map((detail, idx) => (
                    <div key={idx} className="text-sm text-[#4A4A4A] leading-relaxed">
                      {detail.replace(/\*\*/g, '')} {/* Stripping MD bolding for cleaner look */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}