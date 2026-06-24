import { useState, type ReactNode } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { useLibraryData } from '@/hooks/data/useLibraryData'
import { useLibraryActions } from '@/hooks/useLibraryActions'
import { Button } from '@/components/ui/Button'

interface MainPanelProps {
  children: ReactNode
  noAddDocment?: boolean
}

/**
 * Main panel wrapper that resolves library before rendering content.
 * Shows loading state while resolving, error if library not found.
 */
export function MainPanel({ children, noAddDocment }: MainPanelProps) {
  const { libraryId } = useParams<{ libraryId: string }>()
  const library = useLibraryData(libraryId)
  const { deleteLibrary } = useLibraryActions()
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDeleteLibrary = async () => {
    if (!libraryId) return
    try {
      await deleteLibrary(libraryId)
      toast.success('Library deleted')
      navigate('/libraries')
    } catch (error) {
      console.error('Failed to delete library:', error)
      toast.error('Failed to delete library')
    }
  }

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
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {library.name}
          </h1>
        </div>

        <div className="flex items-center items-center gap-6">
          {!noAddDocment && (
            <Link
              to={`/libraries/${libraryId}/documents`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              + Add Documents
            </Link>
          )}

          {confirmDelete ? (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeleteLibrary}>
                Delete library
              </Button>
            </>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="hover:bg-gray-950 hover:text-white cursor-pointer"
              onClick={() => setConfirmDelete(true)}
            >
              X
            </Button>
          )}
        </div>
      </header>
      {children}
    </>
  )
}
