'use client';

import { useState } from 'react';
import { publications } from '../data/publications';

export default function Publications() {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedPublications = isExpanded ? publications : publications.slice(0, 3);

  return (
    <section className="py-20 px-6 border-t border-[#E5E2D9]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-12">
           <h2 className="text-3xl font-serif text-[#1A1A1A]">
             Selected Publications
           </h2>
           <span className="hidden md:inline font-mono text-xs text-[#787570]">
             INDEX: {publications.length} ITEMS
           </span>
        </div>

        <div className="space-y-0 divide-y divide-[#E5E2D9]">
          {displayedPublications.map((pub, index) => (
            <div
              key={index}
              className="group py-6 citation-hover rounded-lg px-4 -mx-4"
            >
              <h3 className="text-lg font-serif font-medium text-[#1A1A1A] mb-2 group-hover:text-[#3A4D39] transition-colors">
                <a href={pub.doi} target="_blank" rel="noopener noreferrer">
                  {pub.title}
                </a>
              </h3>
              <div className="text-sm text-[#4A4A4A] leading-relaxed">
                <span className="italic">{pub.journal}</span> ({pub.year}) • {pub.authors}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-mono text-[#787570] hover:text-[#1A1A1A] border-b border-transparent hover:border-[#1A1A1A] transition-all pb-0.5"
          >
            {isExpanded ? '[ Collapse List ]' : `[ View All ${publications.length} Publications ]`}
          </button>
        </div>
      </div>
    </section>
  );
}