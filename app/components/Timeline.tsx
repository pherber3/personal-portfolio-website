'use client';

import { experiences } from '../data/experience';
import TimelineItem from './TimelineItem';

export default function Timeline() {
  return (
    <section className="py-20 px-6" style={{ background: '#FAF9F6' }}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center" style={{ color: '#2B2B2B' }}>
          Experience
        </h2>
        <div className="max-w-3xl mx-auto">
          {experiences.map((exp, index) => (
            <TimelineItem
              key={`${exp.company}-${exp.dates}`}
              experience={exp}
              isLast={index === experiences.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
