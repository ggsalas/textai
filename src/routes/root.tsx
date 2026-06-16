import { Outlet, Link } from 'react-router'

export function RootLayout() {

  return (
    <div className="min-h-screen bg-background text-white">
      <header className="border-b border-surface-light bg-surface px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/libraries" className="text-xl font-bold text-primary">
            TextAI
          </Link>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-surface-light px-3 py-1 text-xs text-slate-400">
              Model: loading...
            </span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
