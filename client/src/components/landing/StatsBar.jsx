import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function StatsBand() {
  const { ref, isVisible } = useScrollReveal();

  const stats = [
    { value: "$0", label: "Free during beta" },
    { value: "4", label: "Pipeline stages built-in" },
    { value: "∞", label: "Applications you can track" },
    { value: "1", label: "Click to open the dashboard" }
  ];

  return (
    <div className="bg-cream py-16 border-y border-border">
      <div 
        ref={ref}
        className={`max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border scroll-reveal ${isVisible ? 'visible' : ''}`}
      >
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center">
            <div className="text-4xl md:text-5xl font-sans font-black tracking-tight text-ink mb-2">
              <span className="text-gold">{stat.value.charAt(0)}</span>
              {stat.value.substring(1)}
            </div>
            <div className="text-xs font-sans font-bold text-muted uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
