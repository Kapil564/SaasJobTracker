const jobCards = [
  { company: 'Stripe',  initial: 'S', role: 'Frontend Engineer',  status: 'Interview', matchPercent: 92 },
  { company: 'Vercel',  initial: 'V', role: 'React Developer',    status: 'Applied',   matchPercent: 87 },
  { company: 'Linear',  initial: 'L', role: 'Design Engineer',    status: 'Rejected',  matchPercent: 54 },
]

const statusStyles = {
  Interview: { badge: 'bg-sage-light text-sage',           bar: 'bg-sage' },
  Applied:   { badge: 'bg-soft-blue-light text-soft-blue', bar: 'bg-soft-blue' },
  Rejected:  { badge: 'bg-soft-red-light text-soft-red',   bar: 'bg-soft-red' },
}

const proofUsers = [
  { initials: 'AK', bg: '#C4B5A0' },
  { initials: 'JM', bg: '#A0B5C4' },
  { initials: 'SR', bg: '#B5C4A0' },
]

export default function Hero({ onGetStarted, onHowItWorks }) {
  return (
    <section className="max-w-[1200px] mx-auto px-10 pt-28 pb-16 max-[768px]:px-5 max-[768px]:pt-24">
      <div className="grid grid-cols-[1fr_1px_1fr] items-stretch min-h-[520px]
        max-[900px]:grid-cols-1 max-[900px]:gap-12">

        {/* ── Left: Hero text ── */}
        <div className="pr-14 flex flex-col justify-center max-[900px]:pr-0">
          <p className="text-[11px] uppercase tracking-[2px] text-body font-normal mb-6 animate-fade-up">
            Job application tracker
          </p>

          <h1
            className="font-serif text-[clamp(38px,5.5vw,54px)] leading-[1.06] tracking-[-2px] text-dark mb-6 animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            Track every application.<br />
            Land your next role,{' '}
            <em className="text-emphasis italic">faster.</em>
          </h1>

          <p
            className="text-[17px] font-light leading-[1.7] text-body max-w-[440px] mb-10 animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            Kanban boards, AI cover letters, and resume matching
            — everything you need in one focused tool.
          </p>

          {/* CTAs */}
          <div
            className="flex items-center gap-6 mb-14 animate-fade-up max-[500px]:flex-col max-[500px]:items-start max-[500px]:gap-3"
            style={{ animationDelay: '0.3s' }}
          >
            <button
              id="hero-cta-primary"
              className="bg-dark text-cream px-6 py-3 rounded-[6px] text-[15px] font-normal
                hover:bg-dark/85 transition-colors"
              onClick={onGetStarted}
            >
              Get started free →
            </button>
            <button
              id="hero-cta-secondary"
              className="text-body text-[15px] font-normal underline underline-offset-4
                decoration-warm-border hover:text-dark hover:decoration-dark transition-colors bg-transparent border-none"
              onClick={onHowItWorks}
            >
              See how it works
            </button>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex -space-x-2">
              {proofUsers.map((u) => (
                <div
                  key={u.initials}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-normal text-white border-2 border-cream"
                  style={{ backgroundColor: u.bg }}
                >
                  {u.initials}
                </div>
              ))}
            </div>
            <p className="text-[13px] font-light text-body">
              Joined by <span className="text-dark font-normal">1,200+</span> job seekers this month
            </p>
          </div>
        </div>

        {/* ── Vertical divider ── */}
        <div className="bg-warm-border max-[900px]:hidden" />

        {/* ── Right: Product preview ── */}
        <div className="pl-14 flex items-center max-[900px]:pl-0">
          <div
            className="w-full bg-cream-dark rounded-xl border border-warm-border overflow-hidden relative animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            {/* Live preview tab */}
            <div className="absolute top-0 right-4 bg-dark text-cream text-[10px] tracking-[1px] uppercase px-3 py-1.5 rounded-b-md font-mono">
              Live preview
            </div>

            <div className="p-5 pt-10 space-y-3">
              {/* Job cards */}
              {jobCards.map((card) => (
                <div
                  key={card.company}
                  className="bg-cream rounded-lg border border-warm-border p-4 hover:-translate-y-0.5 transition-transform"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-dark text-cream flex items-center justify-center text-[13px] font-serif shrink-0">
                        {card.initial}
                      </div>
                      <div>
                        <div className="text-[14px] font-normal text-dark leading-tight">{card.company}</div>
                        <div className="text-[12px] font-light text-body">{card.role}</div>
                      </div>
                    </div>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-normal whitespace-nowrap ${statusStyles[card.status].badge}`}>
                      {card.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex-1 h-1 bg-warm-border rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${statusStyles[card.status].bar}`}
                        style={{ width: `${card.matchPercent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-body">{card.matchPercent}%</span>
                  </div>
                </div>
              ))}

              {/* AI snippet card */}
              <div className="bg-dark rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warm-gray">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  <span className="text-[10px] uppercase tracking-[1px] text-warm-gray font-mono">
                    AI Cover Letter
                  </span>
                </div>
                <p className="text-[13px] font-light leading-[1.6] text-cream/60">
                  &ldquo;Dear hiring manager, I&rsquo;m excited to apply for the Frontend Engineer
                  position at Stripe. With 4 years of experience building performant
                  React applications...&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
