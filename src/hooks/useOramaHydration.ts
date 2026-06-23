import { useEffect } from 'react'
import { hasIndex, rebuildIndex } from '@/services/embedding/vector-store'
import { getChunksByLibrary } from '@/services/chunk.service'

/** Hook that ensures the Orama vector index is hydrated for a library */
export function useOramaHydration(libraryId: string | undefined) {
  useEffect(() => {
    async function hydrateIndex() {
      if (!libraryId || hasIndex(libraryId)) return
      const chunks = await getChunksByLibrary(libraryId)
      if (chunks.length > 0) {
        await rebuildIndex(libraryId, chunks)
      }
    }
    hydrateIndex()
  }, [libraryId])
}
