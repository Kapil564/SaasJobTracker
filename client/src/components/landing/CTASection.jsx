import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function CTASection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-32 bg-paper relative flex items-center justify-center overflow-hidden border-t border-border">
      {/* Radial Gold Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-gold/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div
        ref={ref}
        className={`max-w-3xl mx-auto px-6 text-center relative z-10 scroll-reveal ${isVisible ? 'visible' : ''}`}
      >
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-12 h-[1px] bg-gold/30"></div>
          <span className="text-gold font-sans font-bold tracking-widest uppercase text-xs">Beta &middot; Free Access</span>
          <div className="w-12 h-[1px] bg-gold/30"></div>
        </div>

        <h2 className="text-5xl md:text-6xl font-serif font-black text-ink mb-8 leading-[1.1]">
          Your dream job isn't going to <em className="not-italic text-gold italic">chase itself.</em>
        </h2>

        <p className="text-xl text-ink/70 font-sans font-light leading-relaxed mb-12 max-w-2xl mx-auto">
          CareerTransit is in beta and completely free to use right now. Open the dashboard and start tracking your first applications in under a minute.
        </p>

        <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white px-10 py-4 rounded-full font-sans font-medium text-lg transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
          Go to Dashboard
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
