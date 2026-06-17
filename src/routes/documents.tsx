import { useParams } from 'react-router'
import { useDocuments } from '@/hooks/useDocuments'
import { DocumentList } from '@/components/documents/DocumentList'
import { EmptyState } from '@/components/ui/EmptyState'

export function DocumentsPage() {
  const { libraryId } = useParams<{ libraryId: string }>()
  const { documents, loading, deleteDocument } = useDocuments(libraryId!)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading documents...</p>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <EmptyState
        icon={
          <svg
            className="w-16 h-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        }
        title="No documents yet"
        description="Upload documents to this library to start searching. Supported formats: PDF, DOCX, TXT, MD"
      />
    )
  }

  return (
    <div>
      <DocumentList documents={documents} onDelete={deleteDocument} />
    </div>
  )
}
