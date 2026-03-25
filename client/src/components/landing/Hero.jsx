import { Link } from 'react-router-dom';
import HeroKanbanBoard from './HeroKanbanBoard';

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto overflow-hidden relative min-h-screen flex items-center">

      {/* Background Gradients & Patterns */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-ink) 1px, transparent 0)',
        backgroundSize: '24px 24px'
      }}></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy/10 rounded-full blur-3xl z-0 pointer-events-none"></div>

      <div className="grid md:grid-cols-2 gap-12 items-center relative z-10 w-full">

        {/* Left Text */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paper border border-border shadow-sm mb-6 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-green animate-pulse"></span>
            <span className="text-xs font-sans font-medium text-ink">Now in Beta &middot; Free to Try</span>
          </div>

          <h1 className="text-5xl md:text-[4rem] font-serif font-black text-ink leading-[1.05] mb-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
            Your job search, finally <em className="not-italic text-gold italic">under control.</em>
          </h1>

          <p className="text-lg font-sans font-light text-ink/70 mb-8 leading-relaxed animate-fade-up" style={{ animationDelay: '200ms' }}>
            Stop drowning in browser tabs and cluttered spreadsheets. CareerTransit gives you a beautiful Kanban board built for the modern job search — from first click to accepted offer.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-up" style={{ animationDelay: '300ms' }}>
            <Link to="/dashboard" className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-8 py-3.5 rounded-full font-sans font-medium text-center transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Try the Dashboard
            </Link>
            <a href="#features" className="bg-white hover:bg-[#f1f5f9] border border-[#0f172a]/10 text-[#0f172a] px-8 py-3.5 rounded-full font-sans font-medium text-center transition-all">
              See how it works
            </a>
          </div>

          <div className="text-xs font-sans text-muted animate-fade-up" style={{ animationDelay: '400ms' }}>
            Early access &middot; No login required &middot; Built with React
          </div>
        </div>

        {/* Right Board */}
        <div className="mt-12 md:mt-0 xl:pl-4 relative w-full h-[550px] md:h-auto flex justify-center items-center">
          <div className="w-full max-w-[500px] transform scale-[0.85] md:scale-100 origin-center md:origin-left">
            <HeroKanbanBoard />
          </div>
        </div>
      </div>
    </section>
  );
}
