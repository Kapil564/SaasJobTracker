const steps = [
  { num: '01', title: 'Create account', desc: 'Sign up free with Google or email — takes 10 seconds.' },
  { num: '02', title: 'Add your jobs',  desc: 'Paste job links or add them manually to your pipeline.' },
  { num: '03', title: 'Let AI work',    desc: 'Cover letters, match scores, and red flag alerts — automatic.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works-section" className="max-w-[1100px] mx-auto px-10 py-24 max-[768px]:px-5 max-[768px]:py-16">
      <p className="text-[11px] uppercase tracking-[2px] text-body font-normal mb-3 animate-fade-up">
        How it works
      </p>
      <h2
        className="font-serif text-[clamp(28px,4vw,38px)] text-dark mb-14 tracking-[-1px] leading-[1.15] animate-fade-up"
        style={{ animationDelay: '0.1s' }}
      >
        Up and running in minutes.
      </h2>

      <div className="flex relative max-[768px]:flex-col max-[768px]:gap-10">
        {/* Dashed connector */}
        <div className="absolute top-6 z-0 border-t-2 border-dashed border-warm-border max-[768px]:hidden"
             style={{ left: 'calc(16.666% + 24px)', right: 'calc(16.666% + 24px)' }} />

        {steps.map((s, i) => (
          <div
            key={s.num}
            className="flex-1 text-center relative z-10 px-4 animate-fade-up"
            style={{ animationDelay: `${0.15 + i * 0.1}s` }}
          >
            <div className="w-12 h-12 rounded-xl bg-cream-dark border border-warm-border inline-flex items-center justify-center text-[16px] font-mono font-medium text-emphasis mb-5">
              {s.num}
            </div>
            <h3 className="text-[15px] font-normal text-dark mb-2">{s.title}</h3>
            <p className="text-[13.5px] font-light text-body leading-[1.6]">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
