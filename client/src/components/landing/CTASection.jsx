export default function CTASection({ onGetStarted }) {
  return (
    <section id="final-cta" className="text-center py-28 px-10 max-w-[620px] mx-auto max-[768px]:py-20 max-[768px]:px-5">
      <h2
        className="font-serif text-[clamp(30px,4.5vw,42px)] font-normal text-dark tracking-[-1px] mb-4 animate-fade-up"
      >
        Ready to land your{' '}
        <em className="text-emphasis italic">next role?</em>
      </h2>
      <p className="text-[15.5px] font-light text-body mb-9 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        Start for free. No credit card required.
      </p>
      <button
        id="final-cta-btn"
        className="bg-dark text-cream px-8 py-3.5 rounded-[6px] text-[15px] font-normal
          hover:bg-dark/85 transition-colors animate-fade-up"
        style={{ animationDelay: '0.2s' }}
        onClick={onGetStarted}
      >
        Get started free →
      </button>
    </section>
  )
}
