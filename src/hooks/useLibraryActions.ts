import { useCallback } from 'react'
import * as libraryService from '@/services/library.service'

/** Hook for library write operations (create, delete) */
export function useLibraryActions() {
  const createLibrary = useCallback(async (name: string) => {
    return libraryService.createLibrary(name)
  }, [])

  const deleteLibrary = useCallback(async (id: string) => {
    await libraryService.deleteLibrary(id)
  }, [])

  return { createLibrary, deleteLibrary }
}
