import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  X, 
  Loader2, 
  Building, 
  Briefcase, 
  Trash2, 
  Calendar,
  Search,
  Filter
} from 'lucide-react';
import api from '../../api/axios';

export default function ResumeView() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({ company: '', position: '' });
  
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const inputRef = useRef(null);

  React.useEffect(() => {
    const fetchResumes = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/api/documents');
        if (response.status === 200) {
          setResumes(response.data.files || []);
        } else {
          console.error("Failed to fetch resumes");
        }
      } catch (error) {
        console.error("Error fetching resumes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumes();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("company", form.company.trim());
    formData.append("position", form.position.trim());
    
    try {
      const response = await api.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const data = response.data;
      
      const newResume = {
        id: data.fileId || Date.now(),
        name: file.name,
        company: form.company.trim() || 'General / Generic',
        position: form.position.trim() || 'General / Generic',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
      };
      
      setResumes([newResume, ...resumes]);
      setFile(null);
      setForm({ company: '', position: '' });
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteResume = (id) => {
    setResumes(resumes.filter(r => r.id !== id));
  };

  const filteredResumes = resumes.filter(r => {
    const query = searchQuery.toLowerCase();
    return (
      (r.company && r.company.toLowerCase().includes(query)) ||
      (r.name && r.name.toLowerCase().includes(query)) ||
      (r.position && r.position.toLowerCase().includes(query))
    );
  });

  return (
    <div className="flex-1 min-h-0 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 animate-fadeUp flex flex-col overflow-y-auto" style={{ animationDelay: '0.2s' }}>
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Resume Management</h3>
          <p className="text-sm text-slate-500 mt-1">Record and organize customized resumes for every application.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies..." 
              className="pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 w-48 transition-all"
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col w-full max-w-4xl mx-auto">
        {/* Upload Area */}
        <div 
          className={`relative border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center transition-all duration-300 ${
            dragActive 
              ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]' 
              : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
           <input 
             ref={inputRef}
             type="file" 
             className="hidden" 
             accept=".pdf,.doc,.docx"
             onChange={handleChange}
           />
           
           {!file ? (
             <div className="text-center group">
               <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 border border-slate-100 group-hover:scale-110 transition-transform duration-300 mx-auto">
                 <UploadCloud className="text-indigo-600" size={24} />
               </div>
               <h4 className="text-lg font-bold text-slate-900 mb-1">Drag & drop your customized resume</h4>
               <p className="text-xs text-slate-500 mb-5 max-w-[280px] mx-auto leading-relaxed">
                 We'll help you track which version you used for each application. Supports PDF and DOCX.
               </p>
               
               <button 
                 onClick={() => inputRef.current?.click()}
                 className="px-6 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-2xl hover:bg-white hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm active:scale-95"
               >
                 Browse Local Files
               </button>
             </div>
           ) : (
             <div className="w-full flex flex-col items-center animate-fadeUp">
               <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 border border-emerald-100">
                 <FileText className="text-emerald-600" size={32} />
               </div>
               <h4 className="text-lg font-bold text-slate-900 mb-1 max-w-[80%] truncate" title={file.name}>{file.name}</h4>
               <p className="text-xs font-bold text-slate-400 mb-8 tracking-widest uppercase">
                 {(file.size / 1024 / 1024).toFixed(2)} MB • READY TO SAVE
               </p>

               {/* Meta Data Form */}
               <div className="w-full max-w-md grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company</label>
                   <div className="relative">
                     <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                     <input 
                       type="text" 
                       placeholder="e.g. Google" 
                       value={form.company} 
                       onChange={e => setForm({...form, company: e.target.value})} 
                       className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all" 
                     />
                   </div>
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Position</label>
                   <div className="relative">
                     <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                     <input 
                       type="text" 
                       placeholder="e.g. SWE" 
                       value={form.position} 
                       onChange={e => setForm({...form, position: e.target.value})} 
                       className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all" 
                     />
                   </div>
                 </div>
               </div>

               <div className="flex gap-3">
                 <button 
                   onClick={() => { setFile(null); setForm({company: '', position: ''}); }}
                   disabled={isUploading}
                   className="px-6 py-3 border border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-100 transition-all flex items-center gap-2 disabled:opacity-50"
                 >
                   <X size={16} /> Cancel
                 </button>
                 <button 
                   onClick={uploadFile}
                   disabled={isUploading}
                   className="px-10 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                 >
                   {isUploading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                   {isUploading ? 'Uploading...' : 'Confirm & Save'}
                 </button>
               </div>
             </div>
           )}
        </div>
        
        {/* Gallery */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-lg text-slate-900 flex items-center gap-2">
               <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                <FileText className="text-indigo-600" size={16} />
               </div>
               Tailored Vault
            </h4>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
              {filteredResumes.length} Total Files
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {isLoading ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="animate-spin mb-4 text-indigo-500" size={32} />
                <p className="text-sm font-semibold">Connecting to Google Drive...</p>
              </div>
            ) : filteredResumes.length === 0 ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400">
                <FileText size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-semibold">{searchQuery ? "No matching resumes found." : "No resumes found in your Drive."}</p>
              </div>
            ) : filteredResumes.map(r => (
              <div key={r.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col group hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 relative overflow-hidden">
                <div className="flex justify-between items-start mb-5 relative z-10">
                   <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-indigo-500 shrink-0 group-hover:bg-indigo-50 transition-colors">
                        <FileText size={20} />
                      </div>
                      <div className="flex flex-col min-w-0">
                         <h5 className="font-bold text-sm text-slate-900 truncate" title={r.name}>{r.name}</h5>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{r.size}</span>
                      </div>
                   </div>
                   <button 
                    onClick={() => deleteResume(r.id)} 
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>

                <div className="mt-auto space-y-2.5 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-indigo-100 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center border border-slate-100">
                      <Building size={12} className="text-slate-400" /> 
                    </div>
                    <span className="text-xs font-bold text-slate-700 truncate">{r.company}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center border border-slate-100">
                      <Briefcase size={12} className="text-slate-400" /> 
                    </div>
                    <span className="text-xs font-medium text-slate-500 truncate">{r.position}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-widest">
                    <Calendar size={12} /> {r.date}
                  </div>
                  <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                    View File
                  </button>
                </div>
              </div>
            ))}
            
            {resumes.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/30">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Your vault is empty</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}