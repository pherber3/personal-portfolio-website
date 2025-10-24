'use client';

import { useState } from 'react';
import CVGlossary from './CVGlossary';
import CVSection from './CVSection';
import { experiences } from '../data/experience';
import { publications } from '../data/publications';
import ReactMarkdown from 'react-markdown';

export default function CVView() {
  const [activeSection, setActiveSection] = useState('experience');

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 150; // Account for sticky headers
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="pb-20 md:pb-0" style={{ background: '#FAF9F6' }}>
      <CVGlossary onNavigate={handleNavigate} activeSection={activeSection} />

      <div className="max-w-5xl mx-auto px-6 py-12 min-h-screen">
        {/* AI Assistant Banner */}
        <div
          className="mb-8 p-4 rounded-2xl flex items-center justify-between"
          style={{ background: '#F5F1E8', border: '1px solid #E8E6E1' }}
        >
          <div className="flex items-center gap-3">
            <svg
              className="w-6 h-6 flex-shrink-0"
              fill="none"
              stroke="#8B9A7E"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <p className="text-sm" style={{ color: '#2B2B2B' }}>
              Want more technical details? <span className="font-medium" style={{ color: '#8B9A7E' }}>Ask the AI assistant</span> about specific projects, implementations, or technologies.
            </p>
          </div>
          <button
            onClick={() => {
              const chatButton = document.querySelector('[aria-label="Toggle chat"]') as HTMLButtonElement;
              chatButton?.click();
            }}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md flex-shrink-0"
            style={{
              background: '#8B9A7E',
              color: '#FAF9F6'
            }}
          >
            Open Chat
          </button>
        </div>

        {/* Experience Section */}
        <CVSection id="experience" title="Professional Experience">
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="rounded-2xl p-8"
                style={{ background: '#F5F1E8', border: '1px solid #E8E6E1' }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold" style={{ color: '#2B2B2B' }}>
                      {exp.company}
                    </h3>
                    <p className="text-lg mt-1" style={{ color: '#8B9A7E' }}>
                      {exp.role}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm" style={{ color: '#A89080' }}>
                      {exp.dates}
                    </p>
                    <p className="text-sm" style={{ color: '#A89080' }}>
                      {exp.location}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  {exp.details.map((detail, idx) => (
                    <div key={idx} className="text-sm leading-relaxed" style={{ color: '#2B2B2B' }}>
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <span>{children}</span>,
                          strong: ({ children }) => (
                            <span className="font-semibold" style={{ color: '#8B9A7E' }}>
                              {children}
                            </span>
                          ),
                        }}
                      >
                        {detail}
                      </ReactMarkdown>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CVSection>

        {/* Publications Section */}
        <CVSection id="publications" title="Publications & Recognition">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#8B9A7E' }}>
                Publications ({publications.length})
              </h3>
              <div className="space-y-4">
                {publications.map((pub, index) => (
                  <div
                    key={index}
                    className="rounded-xl p-6"
                    style={{ background: '#F5F1E8', border: '1px solid #E8E6E1' }}
                  >
                    <p className="text-sm leading-relaxed mb-2" style={{ color: '#2B2B2B' }}>
                      {pub.authors} ({pub.year}). <strong>{pub.title}</strong>{' '}
                      <em style={{ color: '#8B9A7E' }}>{pub.journal}</em>
                      {pub.volume && `, ${pub.volume}`}
                      {pub.pages && `, ${pub.pages}`}.
                    </p>
                    <a
                      href={pub.doi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm inline-flex items-center gap-1"
                      style={{ color: '#8B9A7E' }}
                    >
                      {pub.doi}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#8B9A7E' }}>
                Conference Presentations
              </h3>
              <div className="space-y-3">
                {[
                  { conf: 'ICML 2023 - Workshop Presenter', title: 'A Flexible Transformer Architecture to Handle Irregularly Sampled Multi-modal Data and Predict Glaucoma Progression', location: 'Honolulu, HI' },
                  { conf: 'ARVO 2023 - Speaker', title: 'The effect of achieving target intraocular pressure on optical coherence tomography worsening compared to visual field worsening', location: 'New Orleans, LA' },
                  { conf: 'ARVO 2022 - Speaker', title: 'Forecasting Risk of Future Rapid Glaucoma Worsening Using Early Visual Field, Optical Coherence Tomography and Clinical Data', location: 'Denver, CO' },
                  { conf: 'American Glaucoma Society 2022 - Speaker', title: 'Forecasting Risk of Future Rapid Glaucoma Worsening Using Early Visual Field, Optical Coherence Tomography and Clinical Data', location: 'Nashville, TN' },
                ].map((pres, idx) => (
                  <div key={idx} className="text-sm" style={{ color: '#2B2B2B' }}>
                    <strong style={{ color: '#8B9A7E' }}>{pres.conf}:</strong> "{pres.title}" ({pres.location})
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#8B9A7E' }}>
                Awards & Leadership
              </h3>
              <div className="space-y-3 text-sm" style={{ color: '#2B2B2B' }}>
                <p>• Knights Templar Eye Foundation Award Recipient (2022, 2023)</p>
                <p>• <strong>HopAI</strong> (2019-2021): Founded and led JHU's AI club, hosting speakers from frontier labs and organizing educational workshops</p>
                <p>• <strong>Beta Zero Capital Management</strong> (2020-2021): Led ML team in the quantitative research club at JHU</p>
              </div>
            </div>
          </div>
        </CVSection>

        {/* Technical Skills Section */}
        <CVSection id="skills" title="Technical Expertise">
          <div className="space-y-6">
            <div className="rounded-2xl p-6" style={{ background: '#F5F1E8', border: '1px solid #E8E6E1' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: '#8B9A7E' }}>
                Core Stack
              </h3>
              <p className="text-sm" style={{ color: '#2B2B2B' }}>
                Python (PyTorch, TensorFlow, NumPy, Pandas, Polars), SQL, AWS (Bedrock, Lambda, SageMaker), Databricks
              </p>
            </div>

            <div className="rounded-2xl p-6" style={{ background: '#F5F1E8', border: '1px solid #E8E6E1' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: '#8B9A7E' }}>
                Specialized Capabilities
              </h3>
              <div className="space-y-4 text-sm" style={{ color: '#2B2B2B' }}>
                <div>
                  <strong>Optimization & Operations Research:</strong> Mixed Integer Linear Programming (MILP), Constraint Programming, Convex Optimization
                </div>
                <div>
                  <strong>Model Scaling & Distributed Training:</strong> CUDA kernel programming, C++ (performance optimization), multi-GPU training & inference (ZeRO optimization, FSDP, DeepSpeed, Megatron-LM)
                </div>
                <div>
                  <strong>Model Optimization:</strong> FlashAttention, ONNX runtime optimization, Quantization (GGUF, bitsandbytes, LoRA, TensorRT), Mixed precision
                </div>
                <div>
                  <strong>Reinforcement Learning:</strong> PPO, DPO/GRPO for RLAIF, LORA fine-tuning (Unsloth, Tinker)
                </div>
              </div>
            </div>
          </div>
        </CVSection>

        {/* Education Section */}
        <CVSection id="education" title="Education">
          <div className="rounded-2xl p-6" style={{ background: '#F5F1E8', border: '1px solid #E8E6E1' }}>
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#2B2B2B' }}>
              Johns Hopkins University
            </h3>
            <p className="text-base mb-1" style={{ color: '#8B9A7E' }}>
              B.S. Coursework in Applied Mathematics and Statistics
            </p>
            <p className="text-sm mb-4" style={{ color: '#A89080' }}>
              2017-2021 | Baltimore, MD
            </p>
            <p className="text-sm" style={{ color: '#2B2B2B' }}>
              <strong>Relevant Coursework:</strong> Applied & Computational Multilinear Algebra, Deep Learning in Discrete Optimization, Advanced Probability & Statistics
            </p>
          </div>
        </CVSection>
      </div>
    </div>
  );
}
