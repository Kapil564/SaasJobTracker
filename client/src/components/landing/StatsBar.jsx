const stats = [
  { value: '1,200+', label: 'Active users' },
  { value: '8,400+', label: 'Applications tracked' },
  { value: '94%',    label: 'Said it helped them' },
  { value: 'Free',   label: 'Forever on basic plan' },
]

export default function StatsBar() {
  return (
    <section id="stats-section" className="py-14 px-10 bg-cream-dark border-y border-warm-border max-[768px]:px-5">
      <div className="flex justify-center max-w-[900px] mx-auto max-[768px]:flex-wrap max-[768px]:gap-y-8">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`flex-1 text-center px-4 max-[768px]:basis-1/2 max-[768px]:flex-none
              ${i > 0 ? 'border-l border-warm-border max-[768px]:border-l-0' : ''}
              ${i === 1 || i === 3 ? 'max-[768px]:!border-l max-[768px]:!border-warm-border' : ''}`}
          >
            <div className="font-serif text-[clamp(28px,4vw,36px)] font-normal text-dark tracking-[-0.02em] mb-1">
              {s.value}
            </div>
            <div className="text-[13px] font-light text-body">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
