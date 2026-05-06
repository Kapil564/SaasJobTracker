import { useState, useMemo, useCallback, useEffect } from 'react';
import * as api from '../services/api';

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getApplications();
      setJobs(data.applications || []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const stats = useMemo(() => {
    const applied = jobs.filter(j => ['applied', 'screening', 'interviewing', 'offer', 'rejected'].includes(j.status?.toLowerCase())).length;
    const screening = jobs.filter(j => j.status?.toLowerCase() === 'screening').length;
    const interviews = jobs.filter(j => j.status?.toLowerCase() === 'interviewing').length;
    const offers = jobs.filter(j => j.status?.toLowerCase() === 'offer').length;
    
    const responded = jobs.filter(j => ['screening', 'interviewing', 'offer', 'rejected'].includes(j.status?.toLowerCase())).length;
    let responseRate = applied > 0 ? Math.round((responded / applied) * 100) : 0;
    
    return { applied, screening, interviews, offers, responseRate };
  }, [jobs]);

  const updateJobStatus = useCallback(async (id, newStatus) => {
    setJobs(prev => prev.map(job => job.id === id ? { ...job, status: newStatus } : job));
    try {
      await api.updateApplication(id, { status: newStatus });
    } catch (err) {
      console.error(err);
      fetchJobs(); // Revert on failure
    }
  }, [fetchJobs]);

  const toggleStar = useCallback(async (id) => {
    const job = jobs.find(j => j.id === id);
    if (!job) return;
    const newStarred = !job.starred;
    setJobs(prev => prev.map(job => job.id === id ? { ...job, starred: newStarred } : job));
    try {
      await api.updateApplication(id, { starred: newStarred });
    } catch (err) {
      console.error(err);
      fetchJobs();
    }
  }, [jobs, fetchJobs]);

  const deleteJob = useCallback(async (id) => {
    setJobs(prev => prev.filter(job => job.id !== id));
    try {
      await api.deleteApplication(id);
    } catch (err) {
      console.error(err);
      fetchJobs();
    }
  }, [fetchJobs]);

  const editJob = useCallback(async (updatedJob) => {
    setJobs(prev => prev.map(job => job.id === updatedJob.id ? { ...job, ...updatedJob } : job));
    try {
      await api.updateApplication(updatedJob.id, updatedJob);
    } catch (err) {
      console.error(err);
      fetchJobs();
    }
  }, [fetchJobs]);

  const addJob = useCallback(async (jobData) => {
    try {
      const data = await api.createApplication(jobData);
      setJobs(prev => [...prev, data.application]);
    } catch (err) {
      console.error(err);
    }
  }, []);

  return { jobs, stats, updateJobStatus, toggleStar, addJob, deleteJob, editJob, loading };
};

