import { useState } from 'react'
import type { DocumentMeta } from '@/types/document'
import { DocumentItem } from './DocumentItem'

interface DocumentListProps {
  documents: DocumentMeta[]
  onDelete: (id: string) => Promise<void>
}

export function DocumentList({ documents, onDelete }: DocumentListProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  if (documents.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Size
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {documents.map((document) => (
            <DocumentItem
              key={document.id}
              document={document}
              confirmDelete={confirmDelete}
              onConfirmDelete={setConfirmDelete}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
