import { useState } from 'react'
import type { DocumentMeta } from '@/types/document'

interface SidebarDocumentItemProps {
  document: DocumentMeta
  onClick: () => void
  onDelete: () => void
}

export function SidebarDocumentItem({
  document,
  onClick,
}: SidebarDocumentItemProps) {
  return (
    <div className="flex flex-col w-full px-3 py-2 hover:bg-gray-100 text-sm group border-b border-gray-200">
      <button
        onClick={onClick}
        className="flex-1 grow text-left flex gap-2 text-left min-w-0"
      >
        <span className="truncate text-gray-700 group-hover:text-gray-900">
          {document.name}
        </span>
      </button>

      {document.status !== 'indexed' && document.status !== 'error' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${document.processingProgress ?? 0}%` }}
          />
        </div>
      )}
    </div>
  )
}
