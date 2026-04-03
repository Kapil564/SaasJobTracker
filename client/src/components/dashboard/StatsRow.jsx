import { CheckCircle2, TrendingUp, Users, Send, Target, Award } from 'lucide-react';

const StatsRow = ({ stats }) => {
  const cards = [
    { label: 'Total Applied', value: stats.applied, icon: Send, color: 'var(--accent-purple)' },
    { label: 'Screening', value: stats.screening, icon: Target, color: 'var(--accent-blue)' },
    { label: 'Interviews', value: stats.interviews, icon: Users, color: 'var(--accent-yellow)' },
    { label: 'Offers', value: stats.offers, icon: Award, color: 'var(--accent-green)' },
    { label: 'Response Rate', value: `${stats.responseRate}%`, icon: TrendingUp, color: 'var(--accent-red)' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
      {cards.map((card, i) => (
        <div 
          key={card.label} 
          className="bg-[var(--surface)] border border-slate-200 p-3 py-2.5 rounded-xl animate-fadeUp flex flex-col justify-between group hover:border-slate-200 hover:bg-slate-50 transition-all"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] font-medium text-slate-500">{card.label}</span>
            <div className="w-5 h-5 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: `color-mix(in srgb, ${card.color} 15%, transparent)`, color: card.color }}>
              <card.icon size={10} strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-lg font-bold tracking-tight" style={{ color: card.color }}>{card.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsRow;
