import { Search, Bell, Plus } from 'lucide-react';

const Topbar = ({ onAddJob }) => {
  return (
    <header className="h-[72px] shrink-0 border-b border-slate-200 bg-[var(--surface)] flex items-center justify-between px-6 z-10">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-xs text-slate-500 font-medium">Keep moving your career forward</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search roles or companies..." 
            className="w-64 bg-slate-100 border-none rounded-full px-10 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[var(--accent-purple)] transition-all placeholder:text-slate-500"
          />
        </div>

        <button className="relative p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--accent-red)] border-2 border-[var(--surface)]"></span>
        </button>

        <button 
          onClick={onAddJob}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent-purple)] text-white text-sm font-semibold hover:shadow-[0_0_15px_rgba(124,111,239,0.3)] transition-all active:scale-95"
        >
          <Plus size={18} />
          Add Job
        </button>
      </div>
    </header>
  );
};

export default Topbar;
