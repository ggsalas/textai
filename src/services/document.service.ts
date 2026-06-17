import { db } from './db'
import { generateId } from '@/lib/utils'
import type { DocumentMeta, DocumentStatus } from '@/types/document'

export async function createDocument(
  libraryId: string,
  file: { name: string; size: number; type: string }
): Promise<DocumentMeta> {
  const document: DocumentMeta = {
    id: generateId(),
    libraryId,
    name: file.name,
    type: inferDocumentType(file.type, file.name),
    size: file.size,
    createdAt: Date.now(),
    status: 'pending',
    chunkCount: 0,
  }

  await db.transaction('rw', db.documents, db.libraries, async () => {
    await db.documents.add(document)
    const library = await db.libraries.get(libraryId)
    if (library) {
      await db.libraries.update(libraryId, {
        documentCount: library.documentCount + 1,
        updatedAt: Date.now(),
      })
    }
  })

  return document
}

export async function getDocumentsByLibrary(libraryId: string): Promise<DocumentMeta[]> {
  return db.documents
    .where('libraryId')
    .equals(libraryId)
    .reverse()
    .sortBy('createdAt')
}

export async function getDocumentById(id: string): Promise<DocumentMeta | undefined> {
  return db.documents.get(id)
}

export async function updateDocumentStatus(id: string, status: DocumentStatus): Promise<void> {
  await db.documents.update(id, { status })
}

export async function deleteDocument(id: string): Promise<void> {
  const document = await db.documents.get(id)
  if (!document) return

  await db.transaction('rw', db.documents, db.libraries, async () => {
    await db.documents.delete(id)
    const library = await db.libraries.get(document.libraryId)
    if (library) {
      await db.libraries.update(document.libraryId, {
        documentCount: Math.max(0, library.documentCount - 1),
        updatedAt: Date.now(),
      })
    }
  })
}

function inferDocumentType(mimeType: string, fileName: string): 'pdf' | 'docx' | 'txt' | 'md' {
  if (mimeType === 'application/pdf' || fileName.endsWith('.pdf')) return 'pdf'
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx')
  ) {
    return 'docx'
  }
  if (fileName.endsWith('.md')) return 'md'
  return 'txt'
}
