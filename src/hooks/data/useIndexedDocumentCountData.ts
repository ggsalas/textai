import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/infrastructure/db'

/**
 * Data hook: Reactive count of indexed documents for a library.
 * ⚠️ Architecture exception: This hook can import db directly (useLiveQuery requirement).
 */
export function useIndexedDocumentCountData(libraryId: string): {
  count: number
  loading: boolean
} {
  const count = useLiveQuery(
    () =>
      db.documents
        .where('[libraryId+status]')
        .equals([libraryId, 'indexed'])
        .count(),
    [libraryId],
  )

  return {
    count: count ?? 0,
    loading: count === undefined,
  }
}
