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
      // Increased offset because the sticky header is now taller (covering top 0-100px)
      const offset = 140; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-32">
      <CVGlossary onNavigate={handleNavigate} activeSection={activeSection} />

      {/* Reduced top padding (py-8 instead of py-16) since Glossary has its own padding now */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-12 pb-8 border-b border-[#E5E2D9]">
          <h1 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-4">
            Curriculum Vitae
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-sm font-mono text-[#787570]">
             <span>UPDATED: NOV 2025</span>
             <span className="hidden md:inline text-[#E5E2D9]">|</span>
             <span>CHICAGO, IL</span>
             <span className="hidden md:inline text-[#E5E2D9]">|</span>
             <button 
               onClick={() => window.print()} 
               className="hover:text-[#3A4D39] transition-colors underline decoration-[#E5E2D9] underline-offset-4"
             >
               PRINT / SAVE PDF
             </button>
          </div>
        </div>

        {/* AI Banner */}
        <div className="mb-16 p-4 border-l-2 border-[#3A4D39] bg-[#F4F2ED]/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="text-sm text-[#4A4A4A]">
            <strong className="font-serif text-[#1A1A1A] block md:inline md:mr-2">Research Assistant Available.</strong>
            You can ask the AI about specific implementation details of any project listed below, it will access an expanded documentation of my work using <b>Retrieval-Augmented Generation (RAG)</b> to provide answers.
          </div>
          <button
            onClick={() => {
               const btns = Array.from(document.querySelectorAll('button'));
               btns.find(b => b.textContent?.includes('Ask AI'))?.click();
            }}
            className="text-xs font-mono uppercase tracking-wider text-[#3A4D39] hover:text-[#1A1A1A] border border-[#E5E2D9] bg-white px-3 py-1.5 rounded-sm hover:border-[#3A4D39] transition-all whitespace-nowrap"
          >
            Start Chat
          </button>
        </div>

        {/* Experience Section */}
        <CVSection id="experience" title="Professional Experience">
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={index} className="group">
                <div className="md:grid md:grid-cols-[1fr_3fr] gap-8">
                  {/* Left: Meta */}
                  <div className="mb-2 md:mb-0">
                    <h3 className="font-serif text-lg font-medium text-[#1A1A1A] md:hidden">
                      {exp.company}
                    </h3>
                    <div className="font-mono text-xs text-[#787570] mt-1 md:mt-0">
                      {exp.dates}
                    </div>
                    <div className="font-mono text-xs text-[#787570] mt-1">
                      {exp.location}
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[#1A1A1A] hidden md:block mb-1">
                      {exp.company}
                    </h3>
                    <div className="text-sm font-medium text-[#3A4D39] uppercase tracking-wide mb-4">
                      {exp.role}
                    </div>
                    
                    <div className="space-y-3">
                      {exp.details.map((detail, idx) => (
                        <div key={idx} className="flex gap-3 text-sm leading-relaxed text-[#4A4A4A]">
                          <span className="text-[#E5E2D9] select-none">→</span>
                          <div className="prose prose-sm max-w-none prose-strong:font-medium prose-strong:text-[#1A1A1A]">
                            <ReactMarkdown>{detail}</ReactMarkdown>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CVSection>

        {/* Publications Section */}
        <CVSection id="publications" title="Publications & Recognition">
          <div className="space-y-8">
            <div>
              <h3 className="font-mono text-xs text-[#787570] uppercase tracking-widest mb-6 border-b border-[#E5E2D9] pb-2">
                Peer-Reviewed Journals
              </h3>
              <div className="space-y-4">
                {publications.map((pub, index) => (
                  <div key={index} className="pl-4 border-l-2 border-transparent hover:border-[#3A4D39] transition-colors py-1">
                    <div className="text-[#1A1A1A] font-serif font-medium">
                      {pub.title}
                    </div>
                    <div className="text-sm text-[#4A4A4A] mt-1 leading-relaxed">
                      <span className="italic">{pub.journal}</span> ({pub.year}). {pub.authors}
                    </div>
                    <a href={pub.doi} target="_blank" className="text-xs font-mono text-[#3A4D39] hover:underline mt-1 inline-block">
                      DOI LINK ↗
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
               <h3 className="font-mono text-xs text-[#787570] uppercase tracking-widest mb-6 border-b border-[#E5E2D9] pb-2">
                Conference Presentations
              </h3>
              <div className="space-y-4">
                {[
                  { conf: 'ICML 2023', role: 'Workshop Presenter', title: 'A Flexible Transformer Architecture to Handle Irregularly Sampled Multi-modal Data', loc: 'Honolulu, HI' },
                  { conf: 'ARVO 2023', role: 'Speaker', title: 'Effect of achieving target intraocular pressure on OCT worsening', loc: 'New Orleans, LA' },
                  { conf: 'ARVO 2022', role: 'Speaker', title: 'Forecasting Risk of Future Rapid Glaucoma Worsening', loc: 'Denver, CO' },
                ].map((pres, idx) => (
                  <div key={idx} className="grid grid-cols-[80px_1fr] gap-4 text-sm">
                    <div className="font-mono text-[#787570] text-xs pt-1">{pres.conf}</div>
                    <div>
                      <div className="font-medium text-[#1A1A1A]">{pres.title}</div>
                      <div className="text-[#4A4A4A] mt-0.5">{pres.role} • {pres.loc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CVSection>

        {/* Skills Section */}
        <CVSection id="skills" title="Technical Expertise">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-[#FDFCFB] border border-[#E5E2D9] rounded-sm">
              <h3 className="font-serif text-lg text-[#1A1A1A] mb-4">Core Infrastructure</h3>
              <div className="space-y-2 text-sm text-[#4A4A4A]">
                <p><strong className="text-[#1A1A1A]">Languages:</strong> Python, SQL</p>
                <p><strong className="text-[#1A1A1A]">Frameworks:</strong> PyTorch/TensorFlow/JAX, MLFlow, FastAPI, Pydantic, LangGraph</p>
                <p><strong className="text-[#1A1A1A]">Cloud/Ops:</strong> AWS (Sagemaker/Bedrock/Cloudwatch/Lambda/Agents), Databricks, Docker, Jenkins</p>
              </div>
            </div>
            
            <div className="p-6 bg-[#FDFCFB] border border-[#E5E2D9] rounded-sm">
              <h3 className="font-serif text-lg text-[#1A1A1A] mb-4">Specialized Subjects</h3>
              <div className="space-y-2 text-sm text-[#4A4A4A]">
                <p><strong className="text-[#1A1A1A]">Optimization:</strong> Linear Programming, Convex Optimization, Evolutionary Algos</p>
                <p><strong className="text-[#1A1A1A]">Architectures:</strong> Transformers, Multimodal Fusion, Quantization for Fine-tuning, RL, and Inference</p>
                <p><strong className="text-[#1A1A1A]">Performance:</strong> TensorRT, ONNX, C++/CUDA, Triton, Mojo, NVIDIA Dynamo, NVIDIA Nsight & PyTorch Profiler</p>
              </div>
            </div>
          </div>
        </CVSection>

        {/* Education Section */}
        <CVSection id="education" title="Education">
          <div className="md:grid md:grid-cols-[1fr_3fr] gap-8 py-4">
            <div className="font-mono text-xs text-[#787570] pt-1">2017 — 2021</div>
            <div>
              <h3 className="font-serif text-xl font-medium text-[#1A1A1A]">Johns Hopkins University</h3>
              <div className="text-[#3A4D39] mb-2">Completed coursework in Applied Mathematics and Statistics</div>
              <p className="text-sm text-[#4A4A4A] leading-relaxed">
                Focus in Optimization and Deep Learning
                <br />
                <span className="italic text-[#787570]">Leadership: Founder of HopAI (JHU Artificial Intelligence Society)</span>
              </p>
            </div>
          </div>
        </CVSection>
      </div>
    </div>
  );
}