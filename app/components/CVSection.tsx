interface CVSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export default function CVSection({ id, title, children }: CVSectionProps) {
  return (
    <section id={id} className="scroll-mt-32 mb-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: '#2B2B2B' }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
