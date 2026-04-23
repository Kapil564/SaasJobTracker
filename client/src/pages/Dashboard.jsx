import { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import StatsRow from '../components/dashboard/StatsRow';
import DashboardView from '../components/dashboard/DashboardView';
import ApplicationsView from '../components/dashboard/ApplicationsView';
import InterviewsView from '../components/dashboard/InterviewsView';
import ResumeView from '../components/dashboard/ResumeView';
import ComingSoonView from '../components/dashboard/ComingSoonView';
import AddJobModal from '../components/dashboard/AddJobModal';
import SettingsView from '../components/dashboard/SettingsView';
import Toast from '../components/dashboard/Toast';

import { useJobs } from '../hooks/useJobs';
import { useToast } from '../hooks/useToast';

export default function Dashboard() {
  const { jobs, stats, updateJobStatus, toggleStar, addJob, deleteJob, editJob } = useJobs();
  const { toasts, addToast } = useToast();
  
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  

  // Triggered from Topbar '+ Add Job' or Kanban '+ Add Job' bottom buttons
  const handleOpenAddJob = () => {
    setEditingJob(null);
    setShowModal(true);
  };

  const handleSaveJobData = (data) => {
    if (editingJob) {
      editJob(data);
    } else {
      addJob(data);
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowModal(true);
  };

  const handleDeleteJob = (id) => {
    deleteJob(id);
    addToast('Job application deleted', 'success');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardView jobs={jobs} updateJobStatus={updateJobStatus} toggleStar={toggleStar} onAddJob={handleOpenAddJob} addToast={addToast} onEditJob={handleEditJob} onDeleteJob={handleDeleteJob} />;
      case 'Applications':
        return <ApplicationsView jobs={jobs} toggleStar={toggleStar} onEditJob={handleEditJob} onDeleteJob={handleDeleteJob} />;
      case 'Interviews':
        return <InterviewsView jobs={jobs} toggleStar={toggleStar} onEditJob={handleEditJob} onDeleteJob={handleDeleteJob} />;
      case 'Resumes':
        return <ResumeView />;
      case 'Settings':
        return <SettingsView />;
      default:
        return <ComingSoonView />;
    }
  };

  return (
    <div className="dashboard-theme flex h-screen overflow-hidden antialiased text-slate-900 selection:bg-[var(--accent-purple)] selection:text-white">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative border-r border-slate-200">
        <Topbar onAddJob={handleOpenAddJob} />
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 kanban-scroll">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            <StatsRow stats={stats} />
            
            {renderContent()}
          </div>
        </div>
      </main>

      <Toast toasts={toasts} />

      {showModal && (
        <AddJobModal 
          onClose={() => { setShowModal(false); setEditingJob(null); }} 
          onSaveJob={handleSaveJobData}
          addToast={addToast}
          initialData={editingJob}
        />
      )}
    </div>
  );
}