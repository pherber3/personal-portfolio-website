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
    <div className="relative">
      {/* Timeline line */}
      {!isLast && (
        <div
          className="absolute left-[15px] top-[32px] w-[2px] h-full"
          style={{ background: '#E8E6E1' }}
        />
      )}

      {/* Timeline dot */}
      <div className="flex items-start gap-6">
        <div
          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 relative z-10"
          style={{
            background: isExpanded ? '#8B9A7E' : '#FAF9F6',
            border: `2px solid ${isExpanded ? '#8B9A7E' : '#E8E6E1'}`,
            transition: 'all 0.3s ease'
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: isExpanded ? '#FAF9F6' : '#8B9A7E',
              transition: 'all 0.3s ease'
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 pb-12">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-left rounded-2xl p-6 transition-all duration-300 hover:shadow-md"
            style={{
              background: '#F5F1E8',
              border: `1px solid ${isExpanded ? '#8B9A7E' : '#E8E6E1'}`,
            }}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-1" style={{ color: '#2B2B2B' }}>
                  {experience.company}
                </h3>
                <p className="text-base mb-1" style={{ color: '#8B9A7E' }}>
                  {experience.role}
                </p>
                <p className="text-sm" style={{ color: '#A89080' }}>
                  {experience.dates}
                </p>
              </div>

              {/* Expand icon */}
              <svg
                className="w-5 h-5 flex-shrink-0 mt-1 transition-transform duration-300"
                style={{
                  color: '#8B9A7E',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Expandable summary */}
            <div
              className="overflow-hidden transition-all duration-300"
              style={{
                maxHeight: isExpanded ? '500px' : '0',
                opacity: isExpanded ? 1 : 0,
              }}
            >
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid #E8E6E1' }}>
                <p className="text-sm leading-relaxed" style={{ color: '#2B2B2B' }}>
                  {experience.summary}
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
