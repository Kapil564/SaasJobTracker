export default function ComingSoonView() {
  return (
    <div className="flex-1 min-h-0 bg-[var(--surface)] border border-slate-200 rounded-2xl flex items-center justify-center p-2 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
      <div className="text-center text-slate-500">
        <p className="font-bold text-lg mb-2">Coming Soon</p>
        <p className="text-sm">This section is currently under development.</p>
      </div>
    </div>
  );
}
