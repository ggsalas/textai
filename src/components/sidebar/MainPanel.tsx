import type { ReactNode } from 'react'
import { useParams, Link } from 'react-router'
import { useLibraryData } from '@/hooks/data/useLibraryData'

interface MainPanelProps {
  children: ReactNode
}

/**
 * Main panel wrapper that resolves library before rendering content.
 * Shows loading state while resolving, error if library not found.
 */
export function MainPanel({ children }: MainPanelProps) {
  const { libraryId } = useParams<{ libraryId: string }>()
  const library = useLibraryData(libraryId)

  // Loading state: blank screen (undefined = useLiveQuery still querying)
  if (library === undefined) {
    return null
  }

  // Error state: library not found (null = query finished, no result)
  if (library === null || !libraryId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">Library not found</p>
          <Link
            to="/libraries"
            className="text-blue-600 hover:underline text-sm mt-2 inline-block"
          >
            ← Back to libraries
          </Link>
        </div>
      </div>
    )
  }

  // Success: render header + children
  return (
    <>
      <header className="h-16 border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">{library.name}</h1>
        <Link
          to={`/libraries/${libraryId}/documents`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          + Add Documents
        </Link>
      </header>
      {children}
    </>
  )
}
