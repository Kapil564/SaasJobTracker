import { useScrollReveal } from '../../hooks/useScrollReveal';

const FeatureCard = ({ number, icon, title, description, delay }) => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  
  return (
    <div 
      ref={ref}
      className={`group relative p-8 bg-paper hover:bg-cream transition-colors duration-500 scroll-reveal border-b border-r border-border ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: delay }}
    >
      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-border flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 z-10 relative">
        {icon}
      </div>
      
      <h3 className="text-2xl font-serif font-bold text-ink mb-3 relative z-10">{title}</h3>
      <p className="text-muted font-sans font-light leading-relaxed relative z-10">{description}</p>
    </div>
  );
};

export default function FeaturesSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();

  const features = [
    {
      number: "01",
      icon: (
        <svg className="w-6 h-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      ),
      title: "Visual Kanban Board",
      description: "Drag and drop applications across customizable stages. See your entire pipeline at a glance, from 'Saved' to 'Offer'."
    },
    {
      number: "02",
      icon: (
        <svg className="w-6 h-6 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Deadline Reminders",
      description: "Never miss an interview or take-home assignment. Get automated alerts for upcoming deadlines and follow-ups."
    },
    {
      number: "03",
      icon: (
        <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
      title: "Actionable Analytics",
      description: "Track your conversion rates at every stage. Understand where you shine and where you need to optimize your approach."
    },
    {
      number: "04",
      icon: (
        <svg className="w-6 h-6 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Rich Job Notes",
      description: "Keep all your research, interview questions, and salary expectations in one place. Context is key to landing the job."
    }
  ];

  return (
    <section id="features" className="py-32 bg-paper border-b border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_2fr] items-start gap-12">
          
          {/* Left Sticky Label */}
          <div 
            ref={headerRef}
            className={`lg:sticky top-32 pr-4 scroll-reveal ${headerVisible ? 'visible' : ''}`}
          >
            <div className="text-green font-sans font-bold tracking-widest uppercase text-xs mb-4 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-green"></span>
              Core Features
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-ink mb-6 leading-[1.1]">
              Everything you need, nothing you don't.
            </h2>
            <p className="text-lg text-muted font-sans font-light leading-relaxed">
              We stripped away the clutter to give you a minimal yet powerful workspace dedicated completely to landing your next role.
            </p>
          </div>

          {/* Right Grid */}
          <div className="border border-border rounded-xl overflow-hidden bg-border/20">
            <div className="grid md:grid-cols-2 gap-[1px]">
              {features.map((feature, idx) => (
                <FeatureCard 
                  key={idx} 
                  {...feature} 
                  delay={`${idx * 150}ms`} 
                />
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
