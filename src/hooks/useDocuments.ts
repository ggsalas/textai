import { useState, useEffect, useCallback } from 'react'
import type { DocumentMeta } from '@/types/document'
import * as documentService from '@/services/document.service'

export function useDocuments(libraryId: string) {
  const [documents, setDocuments] = useState<DocumentMeta[]>([])
  const [loading, setLoading] = useState(true)

  const loadDocuments = useCallback(async () => {
    setLoading(true)
    try {
      const data = await documentService.getDocumentsByLibrary(libraryId)
      setDocuments(data)
    } catch (error) {
      console.error('Failed to load documents:', error)
    } finally {
      setLoading(false)
    }
  }, [libraryId])

  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  const deleteDocument = useCallback(
    async (id: string) => {
      await documentService.deleteDocument(id)
      await loadDocuments()
    },
    [loadDocuments]
  )

  return {
    documents,
    loading,
    deleteDocument,
  }
}
