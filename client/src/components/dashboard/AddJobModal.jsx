import { useState } from 'react';
import { Plus, X, Building, MapPin, DollarSign, Briefcase } from 'lucide-react';

const AddJobModal = ({ onClose, onAddJob, addToast }) => {
  const [form, setForm] = useState({ 
    role: '', 
    company: '', 
    location: '', 
    salary: '', 
    workType: 'Remote', 
    status: 'saved', 
    notes: '' 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddJob(form);
    addToast('Job application added successfully!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeUp" style={{ animationDuration: '0.3s' }}>
      <div className="bg-[var(--surface)] border border-slate-200 rounded-2xl w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <div className="bg-[var(--accent-purple)]/20 p-1.5 rounded-lg text-[var(--accent-purple)]">
              <Briefcase size={18} />
            </div>
            Add New Job
          </h2>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 group">
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Role <span className="text-[var(--accent-red)]">*</span></label>
                <div className="relative">
                  <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--accent-purple)]" />
                  <input required placeholder="eg. Frontend Engineer" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)] transition-all placeholder:text-slate-500" />
                </div>
              </div>
              <div className="col-span-2 group">
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Company <span className="text-[var(--accent-red)]">*</span></label>
                <div className="relative">
                  <Building size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--accent-purple)]" />
                  <input required placeholder="eg. Google" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)] transition-all placeholder:text-slate-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1 group">
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Location</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--accent-purple)]" />
                  <input placeholder="eg. Remote" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)] transition-all placeholder:text-slate-500" />
                </div>
              </div>
              <div className="col-span-1 group">
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Salary</label>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--accent-purple)]" />
                  <input placeholder="eg. $150k" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)] transition-all placeholder:text-slate-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1 border border-slate-200 bg-white rounded-xl overflow-hidden focus-within:border-[var(--accent-purple)] focus-within:ring-1 focus-within:ring-[var(--accent-purple)] transition-all">
                <select value={form.workType} onChange={e => setForm({ ...form, workType: e.target.value })} className="w-full bg-transparent border-none outline-none py-2.5 px-4 text-sm text-slate-500 font-medium cursor-pointer appearance-none">
                  <option value="Remote" className="bg-[#1e2333]">🚀 Remote</option>
                  <option value="Hybrid" className="bg-[#1e2333]">🏢 Hybrid</option>
                  <option value="On-site" className="bg-[#1e2333]">📍 On-site</option>
                </select>
              </div>

              <div className="col-span-1 border border-slate-200 bg-white rounded-xl overflow-hidden focus-within:border-[var(--accent-purple)] focus-within:ring-1 focus-within:ring-[var(--accent-purple)] transition-all">
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-transparent border-none outline-none py-2.5 px-4 text-sm text-slate-500 font-medium cursor-pointer appearance-none capitalize">
                  {['saved', 'applied', 'screening', 'interviewing', 'offer', 'rejected'].map(s => (
                    <option key={s} value={s} className="bg-[#1e2333] tracking-wide">{s.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="col-span-2 group">
                <textarea placeholder="Add any notes..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)] transition-all placeholder:text-slate-500 min-h-[80px]" />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3 pt-5 border-t border-slate-200">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2.5 text-sm font-bold text-white bg-[var(--accent-purple)] hover:bg-[#6c5eec] rounded-xl shadow-[0_0_15px_rgba(124,111,239,0.3)] transition-all active:scale-95 flex items-center gap-2">
               Save Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddJobModal;
