import { useState } from 'react';
import { Filter } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import RightPanel from '../components/dashboard/RightPanel';
import StatsRow from '../components/dashboard/StatsRow';
import KanbanBoard from '../components/dashboard/KanbanBoard';
import AddJobModal from '../components/dashboard/AddJobModal';
import Toast from '../components/dashboard/Toast';

import { useJobs } from '../hooks/useJobs';
import { useToast } from '../hooks/useToast';

export default function Dashboard() {
  const { jobs, stats, updateJobStatus, toggleStar, addJob } = useJobs();
  const { toasts, addToast } = useToast();
  
  const [showModal, setShowModal] = useState(false);
  

  // Triggered from Topbar '+ Add Job' or Kanban '+ Add Job' bottom buttons
  const handleOpenAddJob = () => {
    setShowModal(true);
  };

  const handleAddJobData = (data) => {
    addJob(data);
  };

  return (
    <div className="dashboard-theme flex h-screen overflow-hidden antialiased text-slate-900 selection:bg-[var(--accent-purple)] selection:text-white">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative border-r border-slate-200">
        <Topbar onAddJob={handleOpenAddJob} />
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 kanban-scroll">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            <StatsRow stats={stats} />
            
            {/* The Kanban Board needs to take remaining height */}
            <div className="flex-1 min-h-0 bg-[var(--surface)] border border-slate-200 rounded-2xl overflow-x-auto flex flex-col p-4 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
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
                  onAddJob={handleOpenAddJob}
                  addToast={addToast}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <RightPanel />

      <Toast toasts={toasts} />

      {showModal && (
        <AddJobModal 
          onClose={() => setShowModal(false)} 
          onAddJob={handleAddJobData}
          addToast={addToast}
        />
      )}
    </div>
  );
}