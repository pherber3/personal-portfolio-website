'use client';

import { useState } from 'react';
import { publications } from '../data/publications';

export default function Publications() {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedPublications = isExpanded ? publications : publications.slice(0, 2);

  return (
    <section className="py-20 px-6" style={{ background: '#E8E6E1' }}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center" style={{ color: '#2B2B2B' }}>
          Publications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedPublications.map((pub, index) => (
            <div
              key={index}
              className="rounded-2xl p-6"
              style={{ background: '#FAF9F6', border: '1px solid #E8E6E1' }}
            >
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#2B2B2B' }}>
                {pub.title}
              </h3>
              <p className="text-sm mb-2" style={{ color: '#A89080' }}>
                {pub.authors}
              </p>
              <p className="text-sm mb-3" style={{ color: '#8B9A7E' }}>
                <em>{pub.journal}</em> ({pub.year})
                {pub.volume && `, ${pub.volume}`}
                {pub.pages && `: ${pub.pages}`}
              </p>
              <a
                href={pub.doi}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm inline-flex items-center gap-1 transition-colors"
                style={{ color: '#8B9A7E' }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                View Publication
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          ))}
        </div>

        {/* Expand/Collapse button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-8 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-md"
            style={{
              background: isExpanded ? '#FAF9F6' : '#8B9A7E',
              color: isExpanded ? '#8B9A7E' : '#FAF9F6',
              border: `2px solid #8B9A7E`
            }}
          >
            {isExpanded ? 'Show Less' : `View All ${publications.length} Publications`}
          </button>
        </div>
      </div>
    </section>
  );
}
