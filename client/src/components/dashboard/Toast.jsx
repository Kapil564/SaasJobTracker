import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const Toast = ({ toasts }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div key={toast.id} className="bg-[var(--surface)] border border-slate-200 shadow-2xl rounded-xl p-4 flex items-center gap-3 w-80 animate-fadeUp">
          {toast.type === 'success' && <CheckCircle2 size={18} className="text-[var(--accent-green)]" />}
          {toast.type === 'error' && <AlertCircle size={18} className="text-[var(--accent-red)]" />}
          {toast.type === 'info' && <Info size={18} className="text-[var(--accent-blue)]" />}
          <p className="text-sm font-medium text-slate-900">{toast.message}</p>
        </div>
      ))}
    </div>
  );
};

export default Toast;
