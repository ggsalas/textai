import { useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/services/db'
import * as documentService from '@/services/document.service'
import { ingestDocuments } from '@/services/ingest/ingest.service'

export function useDocuments(libraryId: string) {
  const documents = useLiveQuery(
    () => db.documents.where('libraryId').equals(libraryId).reverse().sortBy('createdAt'),
    [libraryId]
  )

  const loading = documents === undefined

  const uploadFiles = useCallback(
    async (files: File[]) => {
      await ingestDocuments(files, libraryId)
    },
    [libraryId]
  )

  const deleteDocument = useCallback(async (id: string) => {
    await documentService.deleteDocument(id)
  }, [])

  return {
    documents: documents ?? [],
    loading,
    uploadFiles,
    deleteDocument,
  }
}
