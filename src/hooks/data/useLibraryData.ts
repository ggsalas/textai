import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/infrastructure/db'
import type { Library } from '@/types/library'

/**
 * Data hook: Reactive query for a single library by ID.
 * ⚠️ Architecture exception: This hook can import db directly (useLiveQuery requirement).
 * @returns Library | null | undefined
 *   - undefined: still loading (useLiveQuery is querying)
 *   - null: query finished, library not found
 *   - Library: query finished, library found
 */
export function useLibraryData(
  libraryId: string | undefined,
): Library | null | undefined {
  const library = useLiveQuery(
    () => (libraryId ? db.libraries.get(libraryId) : undefined),
    [libraryId],
  )

  // useLiveQuery returns undefined while loading
  if (library === undefined) {
    return undefined // loading
  }

  // Query finished: return library or null if not found
  return library ?? null
}
