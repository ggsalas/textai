import { db } from './db'
import { generateId } from '@/lib/utils'
import type { Library } from '@/types/library'

export async function createLibrary(name: string, description?: string): Promise<Library> {
  const now = Date.now()
  const library: Library = {
    id: generateId(),
    name,
    description,
    createdAt: now,
    updatedAt: now,
    documentCount: 0,
    chunkCount: 0,
  }
  await db.libraries.add(library)
  return library
}

export async function getAllLibraries(): Promise<Library[]> {
  return db.libraries.orderBy('createdAt').reverse().toArray()
}

export async function getLibraryById(id: string): Promise<Library | undefined> {
  return db.libraries.get(id)
}

export async function updateLibrary(
  id: string,
  updates: Partial<Pick<Library, 'name' | 'description'>>
): Promise<void> {
  await db.libraries.update(id, {
    ...updates,
    updatedAt: Date.now(),
  })
}

export async function deleteLibrary(id: string): Promise<void> {
  await db.transaction('rw', db.libraries, db.documents, async () => {
    await db.documents.where('libraryId').equals(id).delete()
    await db.libraries.delete(id)
  })
}
