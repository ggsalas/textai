import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/infrastructure/db'

/**
 * Data hook: Reactive query for all libraries.
 * ⚠️ Architecture exception: This hook can import db directly (useLiveQuery requirement).
 */
export function useLibrariesData() {
  const libraries = useLiveQuery(() =>
    db.libraries.orderBy('createdAt').reverse().toArray(),
  )

  return {
    libraries: libraries ?? [],
    loading: libraries === undefined,
  }
}
