const features = [
  {
    id: 'feature-kanban',
    color: 'text-emphasis',
    bgColor: 'bg-emphasis/10',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    title: 'Visual pipeline',
    desc: 'Drag and drop applications across stages. See your entire job hunt at a glance.',
  },
  {
    id: 'feature-cover-letter',
    color: 'text-sage',
    bgColor: 'bg-sage/10',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: 'AI cover letters',
    desc: 'Paste a job description and get a tailored, human-sounding cover letter in seconds.',
  },
  {
    id: 'feature-match-score',
    color: 'text-warm-amber',
    bgColor: 'bg-warm-amber/10',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    title: 'Resume match scorer',
    desc: 'See exactly how well your resume matches each job description with a % score.',
  },
  {
    id: 'feature-red-flag',
    color: 'text-soft-red',
    bgColor: 'bg-soft-red/10',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
      </svg>
    ),
    title: 'Red flag detector',
    desc: 'AI scans job descriptions for toxic phrases, vague requirements, and warning signs.',
  },
]

export default function Features() {
  return (
    <section id="features-section" className="max-w-[1100px] mx-auto px-10 py-24 max-[768px]:px-5 max-[768px]:py-16">
      <p className="text-[11px] uppercase tracking-[2px] text-body font-normal mb-3 animate-fade-up">
        What&apos;s included
      </p>
      <h2 className="font-serif text-[clamp(28px,4vw,38px)] text-dark mb-12 tracking-[-1px] leading-[1.15] animate-fade-up"
          style={{ animationDelay: '0.1s' }}>
        Everything you need to land the role.
      </h2>

      <div className="grid grid-cols-2 gap-4 max-[768px]:grid-cols-1">
        {features.map((f, i) => (
          <div
            key={f.id}
            id={f.id}
            className="bg-cream-dark border border-warm-border rounded-xl p-7
              hover:-translate-y-[2px] hover:border-emphasis/25 transition-all duration-200
              animate-fade-up max-[768px]:p-5"
            style={{ animationDelay: `${0.15 + i * 0.08}s` }}
          >
            <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center mb-5 ${f.color} ${f.bgColor}`}>
              {f.icon}
            </div>
            <h3 className="text-[16px] font-normal text-dark mb-2">{f.title}</h3>
            <p className="text-[14px] font-light leading-[1.65] text-body">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
