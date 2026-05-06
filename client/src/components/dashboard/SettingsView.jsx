import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, FileText, Save, Check, LogOut } from 'lucide-react';

export default function SettingsView() {
  const { user, updateProfile, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    resume_text: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line
      setFormData({
        name: user.name || '',
        resume_text: user.resume_text || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMsg('');

    const result = await updateProfile(formData);
    
    setIsSaving(false);
    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="flex-1 min-h-0 bg-[var(--surface)] border border-slate-200 rounded-2xl overflow-y-auto p-4 sm:p-6 lg:p-8 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 border-b border-slate-200 pb-5">
          <h2 className="text-2xl font-bold text-slate-900">Account Settings</h2>
          <p className="text-slate-500 mt-1">Manage your profile details and master resume content.</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
            {errorMsg}
          </div>
        )}

        {saveSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 text-sm font-medium flex items-center gap-2">
            <Check size={16} /> Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Section */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-4">
              <User size={16} className="text-[var(--accent-purple)]" />
              Personal Info
            </h3>
            
            <div className="space-y-4">
              <div className="group">
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)] transition-all placeholder:text-slate-500" 
                  placeholder="Enter your name"
                />
              </div>

              <div className="group">
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed" 
                />
                <p className="text-xs text-slate-400 mt-1">Email cannot be changed directly.</p>
              </div>
            </div>
          </div>

          {/* Master Resume Section */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-4">
              <FileText size={16} className="text-[var(--accent-blue)]" />
              Master Resume
            </h3>
            
            <div className="group">
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Resume Text</label>
              <textarea 
                value={formData.resume_text} 
                onChange={e => setFormData({ ...formData, resume_text: e.target.value })} 
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[var(--accent-blue)] focus:ring-1 focus:ring-[var(--accent-blue)] transition-all placeholder:text-slate-400 min-h-[200px]" 
                placeholder="Paste the plain text content of your primary resume here. This will be used by the AI to generate targeted cover letters and analyze job fit..."
              />
              <p className="text-xs text-slate-500 mt-2">Paste your complete resume history here for the best AI generation results.</p>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-6 py-3 text-sm font-bold text-white bg-[var(--accent-purple)] hover:bg-[#6c5eec] rounded-xl shadow-[0_0_15px_rgba(124,111,239,0.3)] transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

        {/* Account Actions Section */}
        <div className="mt-10 pt-8 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-4">
            <LogOut size={16} className="text-red-500" />
            Account Actions
          </h3>
          
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-red-900">Sign Out</h4>
              <p className="text-xs text-red-700 mt-1">End your current session and log out of your account on this device.</p>
            </div>
            <button 
              type="button"
              onClick={logout}
              className="px-6 py-2.5 text-sm font-bold text-red-700 bg-white border border-red-200 hover:bg-red-100 rounded-xl transition-all shadow-sm shrink-0 whitespace-nowrap"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
