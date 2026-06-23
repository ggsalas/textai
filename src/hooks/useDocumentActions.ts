import { deleteDocument } from '@/services/document.service'
import { toast } from 'sonner'

/** Hook for document write operations (wraps services to respect architecture rules) */
export function useDocumentActions() {
  const handleDeleteDocument = async (documentId: string) => {
    try {
      await deleteDocument(documentId)
      toast.success('Document deleted')
    } catch (error) {
      console.error('Failed to delete document:', error)
      toast.error('Failed to delete document')
      throw error
    }
  }

  return {
    deleteDocument: handleDeleteDocument,
  }
}
