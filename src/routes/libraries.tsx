export function LibrariesPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Libraries</h1>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
          New Library
        </button>
      </div>
      <div className="rounded-lg border border-surface-light bg-surface p-12 text-center">
        <p className="text-slate-400">No libraries yet. Create one to get started.</p>
      </div>
    </div>
  )
}
