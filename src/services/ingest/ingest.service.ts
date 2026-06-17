import { generateId } from '@/lib/utils'
import { parseFile } from './parser.service'
import { chunkText, chunkTextWithPages } from './chunking.service'
import { embedBatch } from '@/services/embedding/embedding.service'
import { insertChunks } from '@/services/embedding/vector-store'
import { db } from '@/services/db'
import { updateDocumentStatus, createDocument } from '@/services/document.service'
import type { Chunk } from '@/types/document'
import { useAppStore } from '@/store/app.store'

export async function ingestDocument(file: File, libraryId: string): Promise<void> {
  // 1. Crear registro en DB
  const docMeta = await createDocument(libraryId, {
    name: file.name,
    size: file.size,
    type: file.type,
  })

  const store = useAppStore.getState()
  store.addToQueue({ documentId: docMeta.id, libraryId })

  try {
    // 2. Parsing
    await updateDocumentStatus(docMeta.id, 'parsing')
    store.updateProgress(docMeta.id, 10)
    const parseResult = await parseFile(file)

    // 3. Chunking
    await updateDocumentStatus(docMeta.id, 'chunking')
    store.updateProgress(docMeta.id, 30)

    const chunkDataList = parseResult.pages
      ? chunkTextWithPages(parseResult.pages)
      : chunkText(parseResult.text)

    if (chunkDataList.length === 0) {
      throw new Error('No text could be extracted from document')
    }

    // 4. Embeddings
    await updateDocumentStatus(docMeta.id, 'embedding')
    store.updateProgress(docMeta.id, 50)

    const texts = chunkDataList.map((c) => c.text)
    const embeddings = await embedBatch(texts)

    // 5. Crear chunks con embeddings
    const chunks: Chunk[] = chunkDataList.map((data, i) => ({
      id: generateId(),
      libraryId,
      documentId: docMeta.id,
      documentName: docMeta.name,
      chunkIndex: data.chunkIndex,
      text: data.text,
      embedding: embeddings[i]!,
      page: data.page,
    }))

    // 6. Guardar en Dexie
    store.updateProgress(docMeta.id, 80)
    await db.chunks.bulkAdd(chunks)

    // 7. Indexar en Orama
    await insertChunks(libraryId, chunks)

    // 8. Actualizar metadata del documento
    await db.documents.update(docMeta.id, { chunkCount: chunks.length })
    await db.libraries.where('id').equals(libraryId).modify((lib) => {
      lib.chunkCount = (lib.chunkCount || 0) + chunks.length
    })

    // 9. Marcar como indexado
    await updateDocumentStatus(docMeta.id, 'indexed')
    store.updateProgress(docMeta.id, 100)
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error'
    await db.documents.update(docMeta.id, { status: 'error', error: errMsg })
  } finally {
    store.removeFromQueue(docMeta.id)
  }
}

export async function ingestMultipleDocuments(files: File[], libraryId: string): Promise<void> {
  // Procesar secuencialmente para no saturar memoria con embeddings
  for (const file of files) {
    await ingestDocument(file, libraryId)
  }
}
