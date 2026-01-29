import Image from 'next/image';
import type { MDXComponents } from 'mdx/types';

interface TOCSection {
  id: string;
  title: string;
}

export const mdxComponents: MDXComponents = {
  TableOfContents: ({ sections }: { sections: TOCSection[] }) => (
    <nav className="my-8 p-6 bg-[#F4F2ED] rounded-lg border border-[#E5E2D9]">
      <h2 className="text-xs font-mono uppercase tracking-widest text-[#787570] mb-4">
        Table of Contents
      </h2>
      <ol className="list-none space-y-2 m-0 p-0">
        {sections.map((section, i) => (
          <li key={section.id} className="m-0 p-0">
            <span className="font-mono text-xs text-[#787570] mr-2">{i + 1}.</span>
            <a
              href={`#${section.id}`}
              className="text-[#4A4A4A] hover:text-[#3A4D39] transition-colors no-underline hover:underline underline-offset-4 text-[15px]"
            >
              {section.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  ),

  Callout: ({ children, title, type = 'note' }: { children: React.ReactNode; title?: string; type?: 'note' | 'warning' }) => (
    <div className={`my-6 p-4 rounded-lg border-l-4 ${
      type === 'warning'
        ? 'bg-amber-50 border-amber-400 text-amber-900'
        : 'bg-[#F4F2ED] border-[#3A4D39] text-[#1A1A1A]'
    }`}>
      {title && (
        <div className="text-xs font-mono uppercase tracking-widest text-[#787570] mb-2">
          {title}
        </div>
      )}
      {children}
    </div>
  ),

  Figure: ({ src, alt, caption }: { src: string; alt: string; caption?: string }) => (
    <figure className="my-8">
      <Image src={src} alt={alt} width={800} height={450} className="rounded-lg border border-[#E5E2D9] w-full" />
      {caption && (
        <figcaption className="text-center text-xs font-mono text-[#787570] mt-3">
          {caption}
        </figcaption>
      )}
    </figure>
  ),
};
