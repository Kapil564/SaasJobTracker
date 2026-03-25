import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Before CareerTransit, I had 40 tabs open and three different Notion templates. This is exactly what I needed—<strong>simple, visual, and fast.</strong>",
      initials: "AJ",
      name: "Alex J.",
      delay: "0ms"
    },
    {
      quote: "The visual <strong>Kanban approach makes job hunting actually bearable.</strong> I love how I can see my momentum building across the board.",
      initials: "MR",
      name: "Maria R.",
      delay: "150ms"
    },
    {
      quote: "Finally a tool that doesn't force me to fill out a million fields. I paste the URL, add my notes, and <strong>I'm back to applying.</strong>",
      initials: "SK",
      name: "Sam K.",
      delay: "300ms"
    }
  ];

  return (
    <section id="testimonials" className="py-32 bg-cream border-t border-border relative">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-16">
          <div className="text-navy font-sans font-bold tracking-widest uppercase text-xs mb-4">Early feedback</div>
          <h2 className="text-4xl md:text-5xl font-serif font-black text-ink">
            What beta testers are saying.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => {
            const { ref: cardRef, isVisible: cardVisible } = useScrollReveal();
            return (
              <div
                key={idx}
                ref={cardRef}
                className={`bg-card-bg p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 scroll-reveal flex flex-col ${cardVisible ? 'visible' : ''}`}
                style={{ transitionDelay: t.delay }}
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p
                  className="text-ink/80 font-sans font-light text-lg mb-8 italic leading-relaxed flex-grow"
                  dangerouslySetInnerHTML={{ __html: `"${t.quote}"` }}
                ></p>

                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-navy text-cream flex items-center justify-center font-bold text-sm">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-sans font-semibold text-ink text-sm">{t.name}</div>
                    <div className="font-mono text-muted text-[10px] uppercase tracking-wider">Beta Tester</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
