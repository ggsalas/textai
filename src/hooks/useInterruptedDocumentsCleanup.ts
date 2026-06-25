import { useEffect } from 'react'
import { toast } from 'sonner'
import { cleanupInterruptedDocuments } from '@/services/document.service'

export function useInterruptedDocumentsCleanup() {
  useEffect(() => {
    cleanupInterruptedDocuments()
      .then((count) => {
        if (count > 0) {
          toast.warning(`${count} document(s) from a previous session were interrupted and reset.`)
        }
      })
      .catch((error) => {
        console.error('Failed to cleanup interrupted documents:', error)
      })
  }, [])
}
