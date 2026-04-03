import JobCard from './JobCard';

export default function ApplicationsView({ jobs, toggleStar }) {
  return (
    <div className="flex-1 min-h-0 bg-[var(--surface)] border border-slate-200 rounded-2xl overflow-y-auto p-4 sm:p-6 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-lg font-bold">All Applications</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded-md text-slate-500 uppercase tracking-widest border border-slate-200">{jobs.length} Total Jobs</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} toggleStar={toggleStar} isList />
        ))}
      </div>
    </div>
  );
}
