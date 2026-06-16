import { useParams } from 'react-router'

export function SearchPage() {
  const { libraryId } = useParams<{ libraryId: string }>()

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Search</h2>
      <input
        type="text"
        placeholder="Search your documents..."
        className="w-full rounded-lg border border-surface-light bg-surface px-4 py-3 text-white placeholder-slate-500 focus:border-primary focus:outline-none"
      />
      <div className="mt-8 text-center text-slate-400">
        <p>Enter a query to search documents in this library.</p>
        <p className="mt-2 text-xs text-slate-500">
          Library ID: {libraryId}
        </p>
      </div>
    </div>
  )
}
