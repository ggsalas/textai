import { Outlet, Link } from 'react-router'
import { useModelStatus } from '@/hooks/useModelStatus'

export function RootLayout() {
  const { modelStatus } = useModelStatus()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/libraries" className="text-xl font-bold text-gray-900">
            TextAI
          </Link>
          <ModelIndicator status={modelStatus} />
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

function ModelIndicator({ status }: { status: string }) {
  const config = {
    idle: { color: 'bg-gray-400', label: 'Model idle' },
    loading: { color: 'bg-yellow-400 animate-pulse', label: 'Loading model...' },
    ready: { color: 'bg-green-400', label: 'Model ready' },
    error: { color: 'bg-red-400', label: 'Model error' },
  }[status] ?? { color: 'bg-gray-400', label: 'Unknown' }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <div className={`w-2.5 h-2.5 rounded-full ${config.color}`} />
      <span>{config.label}</span>
    </div>
  )
}
