import { Navigate, useParams } from 'react-router'
import { useIndexedDocumentCountData } from '@/hooks/data/useIndexedDocumentCountData'

/** Redirects to search if indexed docs exist, otherwise to documents (DropZone) */
export function LibraryRedirect() {
  const { libraryId } = useParams<{ libraryId: string }>()

  if (!libraryId) {
    return null // No library selected — sidebar handles this
  }

  const { count, loading } = useIndexedDocumentCountData(libraryId)

  // Wait for the count to load before redirecting
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  const target =
    count > 0
      ? `/libraries/${libraryId}/search`
      : `/libraries/${libraryId}/documents`

  return <Navigate to={target} replace />
}
