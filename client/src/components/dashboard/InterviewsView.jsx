import JobCard from './JobCard';

export default function InterviewsView({ jobs, toggleStar, onEditJob, onDeleteJob, onAiOpen }) {
  const interviewJobs = jobs.filter(job => job.status === 'interviewing');

  return (
    <div className="flex-1 min-h-0 bg-[var(--surface)] border border-slate-200 rounded-2xl overflow-y-auto p-4 sm:p-6 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-lg font-bold">Interviews</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold px-2 py-1 bg-[var(--accent-yellow)]/10 text-[var(--accent-yellow)] rounded-md uppercase tracking-widest border border-[var(--accent-yellow)]/20">{interviewJobs.length} Interviews</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
        {interviewJobs.map(job => (
          <JobCard key={job.id} job={job} toggleStar={toggleStar} isList onEdit={() => onEditJob(job)} onDelete={() => onDeleteJob(job.id)} onAiOpen={() => onAiOpen(job)} />
        ))}
        {interviewJobs.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-8 opacity-50 border-2 border-dashed border-slate-200 rounded-xl h-32">
            <span className="text-sm font-medium uppercase tracking-widest text-slate-500">No active interviews</span>
          </div>
        )}
      </div>
    </div>
  );
}
