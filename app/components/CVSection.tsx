interface CVSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export default function CVSection({ id, title, children }: CVSectionProps) {
  return (
    <section id={id} className="scroll-mt-32 mb-20">
      <h2 className="text-2xl md:text-3xl font-serif text-[#1A1A1A] mb-8 pb-4 border-b border-[#E5E2D9]">
        {title}
      </h2>
      {children}
    </section>
  );
}