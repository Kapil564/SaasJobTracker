function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">SaaS Job Tracker</h1>
        <p className="mt-3 text-zinc-400">
          Tailwind CSS is wired up. Try changing these classes in{' '}
          <code className="text-zinc-200">src/App.jsx</code>.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button className="rounded-lg bg-white/90 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white">
            Primary
          </button>
          <button className="rounded-lg border border-zinc-700 bg-transparent px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800">
            Secondary
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
