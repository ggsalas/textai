import Dexie, { type Table } from 'dexie'
import type { Library } from '@/types/library'
import type { DocumentMeta } from '@/types/document'

export class TextAIDatabase extends Dexie {
  libraries!: Table<Library>
  documents!: Table<DocumentMeta>

  constructor() {
    super('textai-db')
    this.version(1).stores({
      libraries: 'id, name, createdAt',
      documents: 'id, libraryId, name, status, createdAt, [libraryId+createdAt]',
    })
  }
}

export const db = new TextAIDatabase()
