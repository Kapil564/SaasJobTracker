import { useState } from 'react';
import { Calendar, CheckCircle2, TrendingUp, Activity } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

const mockChartData = [
  { name: 'Mon', applications: 2 },
  { name: 'Tue', applications: 5 },
  { name: 'Wed', applications: 3 },
  { name: 'Thu', applications: 8 },
  { name: 'Fri', applications: 4 },
  { name: 'Sat', applications: 1 },
  { name: 'Sun', applications: 6 },
];

const RightPanel = () => {
  const [goals, setGoals] = useState([
    { id: 1, label: "Apply to 3 startups", checked: true },
    { id: 2, label: "Update UX portfolio", checked: true },
    { id: 3, label: "Reach out to 2 recruiters", checked: false },
    { id: 4, label: "Complete mock interview", checked: false },
  ]);

  const toggleGoal = (id) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, checked: !g.checked } : g));
  };

  return (
    <aside className="w-[300px] h-full border-l border-slate-200 bg-[var(--surface)] shrink-0 hidden xl:flex flex-col p-6 overflow-y-auto">
      
      {/* Response Rate */}
      <div className="mb-8 animate-fadeUp" style={{ animationDelay: '0.4s' }}>
        <h3 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-[var(--accent-green)]" />
          Response Rate
        </h3>
        <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
          <div className="flex justify-between items-end mb-2">
            <span className="text-3xl font-bold text-slate-900">42%</span>
            <span className="text-[10px] font-medium px-2 py-1 bg-[var(--accent-green)]/10 text-[var(--accent-green)] rounded-md mb-1">+5% vs avg</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-purple)] h-full w-[42%] rounded-full relative">
              <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_rgba(15,23,42,0.1)]"></div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-medium">You are responding to 42% of your applications.</p>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="mb-8 animate-fadeUp" style={{ animationDelay: '0.45s' }}>
        <h3 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2">
          <Activity size={16} className="text-[var(--accent-blue)]" />
          Weekly Activity
        </h3>
        <div className="h-[100px] w-full bg-slate-100 rounded-xl border border-slate-200 p-2 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockChartData}>
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid rgba(15,23,42,0.1)', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: 'var(--accent-blue)' }}
              />
              <Line type="monotone" dataKey="applications" stroke="var(--accent-blue)" strokeWidth={3} dot={{ r: 3, fill: 'var(--bg-dashboard)', stroke: 'var(--accent-blue)', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming Interviews */}
      <div className="mb-8 animate-fadeUp" style={{ animationDelay: '0.5s' }}>
        <h3 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2">
          <Calendar size={16} className="text-[var(--accent-yellow)]" />
          Upcoming Interviews
        </h3>
        <div className="space-y-3">
          <InterviewItem company="Figma" role="Design Engineer" time="Tomorrow, 2:00 PM" type="Round 2" color="var(--accent-yellow)" />
          <InterviewItem company="Airbnb" role="Senior Frontend" time="Wed, 11:00 AM" type="Tech Screen" color="var(--accent-purple)" />
          <InterviewItem company="Meta" role="UX Engineer" time="Fri, 10:30 AM" type="Final Loop" color="var(--accent-red)" />
        </div>
      </div>

      {/* Checklist */}
      <div className="animate-fadeUp" style={{ animationDelay: '0.6s' }}>
        <h3 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[var(--accent-blue)]" />
          Weekly Goals
        </h3>
        <div className="space-y-2">
          {goals.map(goal => (
            <CheckItem key={goal.id} label={goal.label} checked={goal.checked} onClick={() => toggleGoal(goal.id)} />
          ))}
        </div>
      </div>
    </aside>
  );
};

const InterviewItem = ({ company, role, time, type, color }) => (
  <div className="bg-slate-100 hover:bg-slate-100 transition-colors p-3 rounded-xl border border-slate-200 cursor-pointer">
    <div className="flex justify-between items-start mb-1">
      <span className="font-bold text-sm text-slate-900">{company}</span>
      <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-bold" style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`, color }}>{type}</span>
    </div>
    <span className="block text-xs font-medium text-slate-500 mb-2 truncate">{role}</span>
    <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
      <Calendar size={10} /> {time}
    </span>
  </div>
);

const CheckItem = ({ label, checked, onClick }) => (
  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors group" onClick={(e) => { e.preventDefault(); onClick(); }}>
    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-[var(--accent-blue)] border-[var(--accent-blue)]' : 'border-slate-200 group-hover:border-[var(--accent-blue)]'}`}>
      {checked && <CheckCircle2 size={10} className="text-white" />}
    </div>
    <span className={`text-xs font-medium ${checked ? 'text-slate-500 line-through' : 'text-slate-500'}`}>{label}</span>
  </label>
);

export default RightPanel;
