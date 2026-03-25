import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function HowItWorks() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="how" className="py-32 bg-ink text-cream relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="text-gold font-sans font-bold tracking-widest uppercase text-xs mb-4">The Process</div>
          <h2 className="text-4xl md:text-5xl font-serif font-black text-white mb-6 leading-tight">
            How CareerTransit works.
          </h2>
          <p className="text-lg text-cream/60 font-sans font-light">
            We've designed the most intuitive workflow for job seekers. No setup required.
          </p>
        </div>

        <div
          ref={ref}
          className={`relative max-w-5xl mx-auto scroll-reveal ${isVisible ? 'visible' : ''}`}
        >
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[28px] left-[12.5%] right-[12.5%] h-[1px] bg-gold/20"></div>

          <div className="grid md:grid-cols-4 gap-8 text-center relative">
            {[
              {
                title: "Save the job",
                desc: "Paste a URL and drop it straight into your Kanban setup."
              },
              {
                title: "Update stages",
                desc: "Drag cards forward to automatically trigger analytics updates."
              },
              {
                title: "Prep effortlessly",
                desc: "Keep all your interview notes contextually tied to the role."
              },
              {
                title: "Land the offer",
                desc: "Ace your negotiations fully equipped with your data."
              }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-ink border border-gold/40 flex items-center justify-center text-xl font-serif font-bold text-gold mb-6 relative z-10 shadow-[0_0_15px_rgba(79,70,229,0.15)]">
                  <div className="absolute inset-0 bg-gold/10 rounded-full"></div>
                  <span className="relative z-10">{i + 1}</span>
                </div>
                <h3 className="text-xl font-sans font-medium text-white mb-3">{step.title}</h3>
                <p className="text-cream/60 font-sans font-light text-sm leading-relaxed px-4">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
