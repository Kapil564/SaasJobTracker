import { useState, useMemo, useCallback } from 'react';
import { seedJobs } from '../data/seedJobs';

export const useJobs = () => {
  const [jobs, setJobs] = useState(seedJobs);

  const stats = useMemo(() => {
    const applied = jobs.filter(j => ['applied', 'screening', 'interviewing', 'offer', 'rejected'].includes(j.status)).length;
    const screening = jobs.filter(j => j.status === 'screening').length;
    const interviews = jobs.filter(j => j.status === 'interviewing').length;
    const offers = jobs.filter(j => j.status === 'offer').length;
    
    // Fake response rate: (screening + interviews + offers + rejected) / applied
    const responded = jobs.filter(j => ['screening', 'interviewing', 'offer', 'rejected'].includes(j.status)).length;
    let responseRate = applied > 0 ? Math.round((responded / applied) * 100) : 0;
    
    return { applied, screening, interviews, offers, responseRate };
  }, [jobs]);

  const updateJobStatus = useCallback((id, newStatus) => {
    setJobs(prev => prev.map(job => job.id === id ? { ...job, status: newStatus } : job));
  }, []);

  const toggleStar = useCallback((id) => {
    setJobs(prev => prev.map(job => job.id === id ? { ...job, starred: !job.starred } : job));
  }, []);

  const addJob = useCallback((job) => {
    const newJob = {
      ...job,
      id: Math.random().toString(36).substr(2, 9),
      starred: false,
      date: 'Added Just Now',
      progress: null,
      hasNotif: false
    };
    setJobs(prev => [...prev, newJob]);
  }, []);

  return { jobs, stats, updateJobStatus, toggleStar, addJob };
};
