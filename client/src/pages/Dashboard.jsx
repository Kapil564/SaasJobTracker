import { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import StatsRow from '../components/dashboard/StatsRow';
import DashboardView from '../components/dashboard/DashboardView';
import ApplicationsView from '../components/dashboard/ApplicationsView';
import InterviewsView from '../components/dashboard/InterviewsView';
import ResumeView from '../components/dashboard/ResumeView';
import CoverLettersView from '../components/dashboard/CoverLettersView';
import ComingSoonView from '../components/dashboard/ComingSoonView';
import AddJobModal from '../components/dashboard/AddJobModal';
import AiAssistantModal from '../components/dashboard/AiAssistantModal';
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
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiJob, setAiJob] = useState(null);

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

  const handleOpenAiModal = (job) => {
    setAiJob(job);
    setShowAiModal(true);
  };

  const filteredJobs = jobs.filter(job => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return job.role.toLowerCase().includes(lowerQuery) || 
           job.company.toLowerCase().includes(lowerQuery);
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardView jobs={filteredJobs} updateJobStatus={updateJobStatus} toggleStar={toggleStar} onAddJob={handleOpenAddJob} addToast={addToast} onEditJob={handleEditJob} onDeleteJob={handleDeleteJob} onAiOpen={handleOpenAiModal} />;
      case 'Applications':
        return <ApplicationsView jobs={filteredJobs} toggleStar={toggleStar} onEditJob={handleEditJob} onDeleteJob={handleDeleteJob} onAiOpen={handleOpenAiModal} />;
      case 'Interviews':
        return <InterviewsView jobs={filteredJobs} toggleStar={toggleStar} onEditJob={handleEditJob} onDeleteJob={handleDeleteJob} onAiOpen={handleOpenAiModal} />;
      case 'Resumes':
        return <ResumeView />;
      case 'Cover Letters':
        return <CoverLettersView jobs={filteredJobs} addToast={addToast} />;
      case 'Settings':
        return <SettingsView />;
      default:
        return <ComingSoonView />;
    }
  };

  return (
    <div className="dashboard-theme flex flex-col h-screen overflow-hidden antialiased text-slate-900 selection:bg-[var(--accent-purple)] selection:text-white">
      <Topbar onAddJob={handleOpenAddJob} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} interviewCount={stats?.interviews || 0} />
        
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative border-r border-slate-200 bg-[var(--bg-dashboard)]">
          <div className="flex-1 overflow-y-auto p-2 sm:py-6 lg:py-8 sm:pr-6 lg:pr-8 pl-2 sm:pl-4 lg:pl-5 kanban-scroll">
            <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
              <StatsRow stats={stats} />
              
              {renderContent()}
            </div>
          </div>
        </main>
      </div>

      <Toast toasts={toasts} />

      {showModal && (
        <AddJobModal 
          onClose={() => { setShowModal(false); setEditingJob(null); }} 
          onSaveJob={handleSaveJobData}
          addToast={addToast}
          initialData={editingJob}
        />
      )}

      {showAiModal && (
        <AiAssistantModal 
          job={aiJob} 
          onClose={() => { setShowAiModal(false); setAiJob(null); }} 
          addToast={addToast} 
        />
      )}
    </div>
  );
}