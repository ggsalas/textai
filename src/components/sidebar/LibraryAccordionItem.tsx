import type { Library } from '@/types/library'
import { useDocumentsData } from '@/hooks/data/useDocumentsData'
import { SidebarDocumentItem } from './SidebarDocumentItem'

interface LibraryAccordionItemProps {
  library: Library
  isExpanded: boolean
  onToggle: () => void
  onDocumentClick: (documentId: string) => void
  onDocumentDelete: (documentId: string) => void
}

export function LibraryAccordionItem({
  library,
  isExpanded,
  onToggle,
  onDocumentClick,
  onDocumentDelete,
}: LibraryAccordionItemProps) {
  const { documents, loading } = useDocumentsData(library.id)

  return (
    <div className="border-b border-gray-200">
      {/* Library header */}
      <div
        className={`flex items-center gap-2 px-3 py-2 hover:bg-gray-100 ${isExpanded ? 'bg-gray-50' : ''}`}
      >
        <button
          onClick={onToggle}
          className="flex-1 flex items-center justify-between gap-2"
        >
          <span className="font-medium text-gray-900 truncate flex-1 text-left">
            {library.name}
          </span>
          <span className="text-gray-400 text-sm">
            {isExpanded ? '▼' : '▲'}
          </span>
        </button>
      </div>

      {/* Document list (shown when expanded) */}
      {isExpanded && (
        <div className="bg-gray-50">
          {loading && (
            <div className="px-3 py-2 text-sm text-gray-500">Loading...</div>
          )}
          {!loading && documents.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">
              No documents yet
            </div>
          )}
          {!loading &&
            documents.map((doc) => (
              <SidebarDocumentItem
                key={doc.id}
                document={doc}
                onClick={() => onDocumentClick(doc.id)}
                onDelete={() => onDocumentDelete(doc.id)}
              />
            ))}
        </div>
      )}
    </div>
  )
}
