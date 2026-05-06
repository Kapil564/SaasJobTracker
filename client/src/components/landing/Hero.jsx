import { Link } from 'react-router-dom';
import HeroKanbanBoard from './HeroKanbanBoard';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function HeroSection() {
  const { user } = useAuth();
  const { ref, isVisible } = useScrollReveal();
  const words = ["organized", "easy to follow", "on schedule", "under control."];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < words.length - 1) {
      const timer = setTimeout(() => setIndex(prev => prev + 1), 2000);
      return () => clearTimeout(timer);
    }
  }, [index, words.length]);

  return (
    <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto overflow-hidden relative min-h-screen flex items-center">

      {/* Background Gradients & Patterns */}
      <div className="absolute top-28 inset-x-0 bottom-0 z-0 pointer-events-none opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-ink) 1px, transparent 0)',
        backgroundSize: '24px 24px'
      }}></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy/10 rounded-full blur-3xl z-0 pointer-events-none"></div>

      <div ref={ref} className="grid md:grid-cols-2 gap-12 items-center relative z-10 w-full">

        {/* Left Text */}
        <div className="max-w-xl">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paper border border-border shadow-sm mb-6 scroll-reveal ${isVisible ? 'visible' : ''}`}>
            <span className="w-2 h-2 rounded-full bg-green animate-pulse"></span>
            <span className="text-xs font-sans font-medium text-ink">Now in Beta &middot; Free to Try</span>
          </div>

          <h1 className={`text-5xl md:text-[84px] font-extrabold leading-[1.05] tracking-tight text-slate-900 mb-6 scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '100ms' }}>
            Your job search,finally <br className="hidden md:block" />
            <span className="relative inline-flex font-serif text-gold italic align-top">
              <span className="opacity-0 pointer-events-none whitespace-nowrap" aria-hidden="true">{words[index]}</span>
              {words.map((word, i) => {
                const isCurrent = i === index;
                const isPast = i < index;
                return (
                  <span
                    key={word}
                    className="absolute left-0 top-0 whitespace-nowrap"
                    style={{
                      transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      opacity: isCurrent ? 1 : 0,
                      filter: isCurrent ? 'blur(0px)' : 'blur(4px)',
                      transform: isCurrent
                        ? 'translateY(0) scale(1)'
                        : isPast
                        ? 'translateY(-2rem) scale(1)'
                        : 'translateY(2rem) scale(0.95)'
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </span>
          </h1>

          <p className={`text-lg font-sans font-light text-ink/70 mb-8 leading-relaxed scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '200ms' }}>
            Stop drowning in browser tabs and cluttered spreadsheets. CareerTransit gives you a beautiful Kanban board built for the modern job search — from first click to accepted offer.
          </p>

          <div className={`flex flex-col sm:flex-row gap-4 mb-6 scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '100ms' }}>
            <Link to={user ? "/dashboard" : "/signup"} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white hover:text-white px-8 py-3.5 rounded-full font-sans font-medium text-center transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 hover:text-white">
              {user ? "Go to Dashboard" : "Try the Dashboard"}
            </Link>
            <a href="#features" className="bg-white hover:bg-[#f1f5f9] border border-[#0f172a]/10 text-[#0f172a] px-8 py-3.5 rounded-full font-sans font-medium text-center transition-all">
              See how it works
            </a>
          </div>

          <div className={`text-xs font-sans text-muted scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '400ms' }}>
            Early access &middot; No login required &middot; Built with React
          </div>
        </div>

        {/* Right Board */}
        <div className={`mt-12 md:mt-0 xl:pl-4 relative w-full h-[550px] md:h-auto flex justify-center items-center scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '500ms' }}>
          <div className="w-full max-w-[500px] transform scale-[0.85] md:scale-100 origin-center md:origin-left">
            <HeroKanbanBoard />
          </div>
        </div>
      </div>
    </section>
  );
}
