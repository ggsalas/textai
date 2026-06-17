import Dexie, { type Table } from 'dexie'
import type { Library } from '@/types/library'
import type { DocumentMeta, Chunk } from '@/types/document'

export class TextAIDatabase extends Dexie {
  libraries!: Table<Library>
  documents!: Table<DocumentMeta>
  chunks!: Table<Chunk>

  constructor() {
    super('textai-db')
    this.version(1).stores({
      libraries: 'id, name, createdAt',
      documents: 'id, libraryId, name, status, createdAt, [libraryId+createdAt]',
    })
    this.version(2).stores({
      libraries: 'id, name, createdAt',
      documents: 'id, libraryId, name, status, createdAt, [libraryId+createdAt]',
      chunks: 'id, libraryId, documentId, chunkIndex, [libraryId+documentId]',
    })
  }
}

export const db = new TextAIDatabase()
