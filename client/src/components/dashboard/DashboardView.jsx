import { Filter } from 'lucide-react';
import KanbanBoard from './KanbanBoard';

export default function DashboardView({ jobs, updateJobStatus, toggleStar, onAddJob, addToast, onEditJob, onDeleteJob }) {
  return (
    <div className="flex-1 w-full min-h-0 bg-[var(--surface)] border border-slate-200 rounded-2xl overflow-x-auto flex flex-col p-2 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
      <div className="mb-4 px-2 flex justify-between items-center">
        <h3 className="text-lg font-bold">Applications Pipeline</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded-md text-slate-500 uppercase tracking-widest border border-slate-200">{jobs.length} Active Jobs</span>
          <button className="flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 bg-slate-100 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-200 transition-all">
            <Filter size={14} /> Filter
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <KanbanBoard 
          jobs={jobs} 
          updateJobStatus={updateJobStatus} 
          toggleStar={toggleStar} 
          onAddJob={onAddJob}
          addToast={addToast}
          onEditJob={onEditJob}
          onDeleteJob={onDeleteJob}
        />
      </div>
    </div>
  );
}
