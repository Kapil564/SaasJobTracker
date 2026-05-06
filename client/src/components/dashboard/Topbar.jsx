import { Search, Plus, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

const Topbar = ({ onAddJob, searchQuery, onSearchChange }) => {
  return (
    <header className="h-[55px] shrink-0 border-b border-slate-200 bg-[var(--surface)] flex rounded-b-xl items-center justify-between px-6 z-10">
      {/* Brand (Left) */}
      <div className="flex items-center gap-2 px-1 flex-1">
        <h1 className=" font-extrabold text-xl tracking-tight">CareerTransit</h1>
      </div>

      {/* Search Bar (Center) */}
      <div className="flex-1 flex justify-center">
        <div className="relative hidden sm:block w-full max-w-[400px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            type="text" 
            placeholder="Search roles or companies..." 
            className="w-full bg-slate-100 border-none rounded-full px-10 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[var(--accent-purple)] transition-all placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Actions (Right) */}
      <div className="flex items-center justify-end gap-4 flex-1">
        <button 
          onClick={onAddJob}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black border border-slate-200 text-sm font-semibold hover:bg-blue-600 hover:text-white transition-all active:scale-95 hover:border-blue-600"
        >
          <Plus size={16} />
          Add Job
        </button>
      </div>
    </header>
  );
};

export default Topbar;
