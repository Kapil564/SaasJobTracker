import { useEffect, useState } from 'react';
import { getCoverLetter as generateAiCoverLetter } from '../../services/aiApi';
import { getSavedCoverLetter, saveCoverLetter } from '../../services/api';
import { Sparkles, FileText, Mail, ChevronRight, Save } from 'lucide-react';

export default function CoverLettersView({ jobs, addToast }) {
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [coverLetters, setCoverLetters] = useState({});

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  // Load saved cover letter when a job is selected
  useEffect(() => {
    const loadSaved = async () => {
      if (!selectedJobId || coverLetters[selectedJobId] !== undefined) return;
      
      try {
        setLoading(true);
        const data = await getSavedCoverLetter(selectedJobId);
        if (data.coverLetter) {
          setCoverLetters(prev => ({ ...prev, [selectedJobId]: data.coverLetter }));
        } else {
          setCoverLetters(prev => ({ ...prev, [selectedJobId]: "" })); // indicate it's loaded but empty
        }
      } catch (err) {
        console.error("Failed to load saved cover letter", err);
      } finally {
        setLoading(false);
      }
    };
    loadSaved();
  }, [selectedJobId]);

  const handleGenerate = async () => {
    if (!selectedJob) return;
    setLoading(true);
    try {
      const data = await generateAiCoverLetter(selectedJob.id);
      setCoverLetters(prev => ({
        ...prev,
        [selectedJob.id]: data.coverLetter || data.result || data.text || JSON.stringify(data)
      }));
      if (addToast) addToast('Cover letter generated! Make sure to save it.', 'success');
    } catch (err) {
      console.error(err);
      if (addToast) addToast('Failed to generate cover letter', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedJob) return;
    const content = coverLetters[selectedJob.id];
    if (!content) return;

    setSaving(true);
    try {
      await saveCoverLetter(selectedJob.id, content);
      if (addToast) addToast('Cover letter saved to database!', 'success');
    } catch (err) {
      console.error(err);
      if (addToast) addToast('Failed to save cover letter', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-180px)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6 animate-fadeIn">
      {/* Left Sidebar - Applications List */}
      <div className="w-1/3 border-r border-slate-200 bg-slate-50 flex flex-col overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-white">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Your Applications</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Select a job to draft a cover letter</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
          {jobs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm font-medium border-2 border-dashed border-slate-200 rounded-xl m-2">
              No applications found.<br/>Add one from the dashboard!
            </div>
          ) : (
            jobs.map(job => (
              <button
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`w-full text-left p-4 rounded-xl transition-all border ${
                  selectedJobId === job.id
                    ? 'bg-purple-50 border-purple-200 shadow-sm'
                    : 'bg-white border-transparent hover:border-slate-200 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="min-w-0 pr-4">
                    <h3 className={`font-bold truncate text-[15px] ${selectedJobId === job.id ? 'text-purple-900' : 'text-slate-800'}`}>
                      {job.role}
                    </h3>
                    <p className={`text-xs mt-1 truncate font-medium ${selectedJobId === job.id ? 'text-purple-600' : 'text-slate-500'}`}>
                      {job.company}
                    </p>
                  </div>
                  <ChevronRight size={18} className={`shrink-0 ${selectedJobId === job.id ? 'text-purple-500' : 'text-slate-300'}`} />
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Content Area - Cover Letter Editor */}
      <div className="w-2/3 flex flex-col bg-white relative">
        {!selectedJob ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
            <div className="bg-white p-6 rounded-full shadow-sm border border-slate-100 mb-6">
              <Mail size={48} className="text-purple-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2 tracking-tight">No Application Selected</h3>
            <p className="text-sm font-medium text-slate-500">Choose an application from the list to view or generate.</p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10 shadow-sm">
              <div className="min-w-0 pr-4">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  <FileText className="text-purple-500" size={20} />
                  Cover Letter
                </h2>
                <p className="text-sm font-medium text-slate-500 mt-1 truncate">
                  for <span className="text-slate-700 font-semibold">{selectedJob.role}</span> at <span className="text-slate-700 font-semibold">{selectedJob.company}</span>
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex items-center gap-2 bg-white border border-purple-200 hover:bg-purple-50 text-purple-700 px-4 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
                >
                  {loading ? <Sparkles className="animate-spin" size={18} /> : <Sparkles size={18} />}
                  {coverLetters[selectedJob.id] ? 'Regenerate AI' : 'Generate AI'}
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading || saving || !coverLetters[selectedJob.id]}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-purple-600/20 disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {saving ? <Sparkles className="animate-spin" size={18} /> : <Save size={18} />}
                  Save
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50/80 p-8">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <Sparkles className="animate-spin text-purple-500 relative" size={48} />
                  </div>
                  <p className="font-bold text-purple-700 animate-pulse tracking-tight text-lg">Drafting your personalized cover letter...</p>
                </div>
              ) : coverLetters[selectedJob.id] ? (
                <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm min-h-full">
                  <textarea
                    value={coverLetters[selectedJob.id]}
                    onChange={(e) => setCoverLetters(prev => ({...prev, [selectedJob.id]: e.target.value}))}
                    className="w-full h-full min-h-[500px] resize-none focus:outline-none text-slate-700 leading-relaxed font-serif text-[15px] bg-transparent"
                    spellCheck="false"
                  />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 rounded-2xl bg-white hover:border-purple-300 transition-colors group">
                  <div className="bg-purple-50 p-5 rounded-full mb-5 group-hover:scale-110 transition-transform duration-300">
                    <FileText size={40} className="text-purple-400" />
                  </div>
                  <p className="font-bold text-slate-700 text-lg mb-2">No cover letter drafted yet</p>
                  <p className="text-sm font-medium text-slate-500 mb-8 text-center max-w-xs">Let our AI analyze the job description and your resume to write a perfect cover letter.</p>
                  <button
                    onClick={handleGenerate}
                    className="flex items-center gap-2 text-purple-600 font-bold text-sm bg-purple-50 px-6 py-3 rounded-full hover:bg-purple-100 transition-colors"
                  >
                    <Sparkles size={18} />
                    Generate Now
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
