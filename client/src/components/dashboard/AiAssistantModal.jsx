import { useState } from 'react';
import { getCoverLetter, getMatchScore, getInterviewPrep, getRedFlags, generateEmailReply } from '../../services/aiApi';
import { X, Sparkles, FileText, CheckCircle, Lightbulb, AlertTriangle, Send } from 'lucide-react';

export default function AiAssistantModal({ job, onClose, addToast }) {
  const [activeTab, setActiveTab] = useState('cover-letter');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [emailContent, setEmailContent] = useState('');

  const handleAction = async () => {
    if (!job || !job.id) return;
    
    setLoading(true);
    try {
      let data;
      switch (activeTab) {
        case 'cover-letter':
          data = await getCoverLetter(job.id);
          setResults({ ...results, 'cover-letter': data.coverLetter || data.result || data.text || JSON.stringify(data) });
          break;
        case 'score':
          data = await getMatchScore(job.id);
          setResults({ ...results, 'score': data.score || data.result || data.matchScore || JSON.stringify(data) });
          break;
        case 'prep':
          data = await getInterviewPrep(job.id);
          setResults({ ...results, 'prep': data.prep || data.result || data.questions || JSON.stringify(data) });
          break;
        case 'red-flags':
          data = await getRedFlags(job.id);
          setResults({ ...results, 'red-flags': data.redFlags || data.result || data.flags || JSON.stringify(data) });
          break;
        case 'email-reply':
          if (!emailContent) {
            addToast('Please provide the recruiter email content first', 'error');
            setLoading(false);
            return;
          }
          data = await generateEmailReply(job.id, emailContent);
          setResults({ ...results, 'email-reply': data.reply || data.result || data.draft || JSON.stringify(data) });
          break;
        default:
          break;
      }
      addToast('AI generation successful!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to generate AI content', 'error');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'cover-letter', label: 'Cover Letter', icon: <FileText size={16} /> },
    { id: 'score', label: 'Match Score', icon: <CheckCircle size={16} /> },
    { id: 'prep', label: 'Interview Prep', icon: <Lightbulb size={16} /> },
    { id: 'red-flags', label: 'Red Flags', icon: <AlertTriangle size={16} /> },
    { id: 'email-reply', label: 'Email Reply', icon: <Send size={16} /> },
  ];

  const renderResult = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Sparkles className="animate-spin mb-4" size={32} />
          <p>AI is thinking...</p>
        </div>
      );
    }

    if (activeTab === 'email-reply' && !results['email-reply']) {
      return (
        <div className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-slate-700">Paste Recruiter Email</label>
          <textarea
            className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-purple)]"
            rows="5"
            placeholder="Paste the email from the recruiter here to draft a contextual reply..."
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
          />
        </div>
      );
    }

    if (!results[activeTab]) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Sparkles className="mb-4 opacity-50" size={32} />
          <p>Click Generate to create {tabs.find(t => t.id === activeTab).label}</p>
        </div>
      );
    }

    const res = results[activeTab];
    return (
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-sm whitespace-pre-wrap text-slate-800 leading-relaxed shadow-inner">
        {typeof res === 'string' ? res : JSON.stringify(res, null, 2)}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 text-purple-600 p-3 rounded-xl shadow-sm">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">AI Assistant</h2>
              <p className="text-sm text-slate-500 font-medium">{job?.role} at {job?.company}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-700">
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar bg-white">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600 bg-purple-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-white min-h-[300px]">
          {renderResult()}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={handleAction}
            disabled={loading}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-purple-600/20 disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? <Sparkles className="animate-spin" size={18} /> : <Sparkles size={18} />}
            Generate {tabs.find(t => t.id === activeTab).label}
          </button>
        </div>
      </div>
    </div>
  );
}
