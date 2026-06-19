import { generateId } from '@/lib/utils'
import { parseFile } from './parser.service'
import { chunkText, chunkTextWithPages } from './chunking.service'
import { embedBatch } from '@/services/embedding/embedding.service'
import { insertChunks } from '@/services/embedding/vector-store'
import { db } from '@/services/db'
import { updateDocumentStatus, createDocument } from '@/services/document.service'
import type { Chunk, DocumentMeta } from '@/types/document'
import { useAppStore } from '@/store/app.store'

async function processDocument(
  docMeta: DocumentMeta,
  file: File,
  libraryId: string
): Promise<void> {
  const store = useAppStore.getState()

  try {
    await updateDocumentStatus(docMeta.id, 'parsing')
    store.updateProgress(docMeta.id, 10)
    const parseResult = await parseFile(file)

    await updateDocumentStatus(docMeta.id, 'chunking')
    store.updateProgress(docMeta.id, 30)

    const chunkDataList = parseResult.pages
      ? chunkTextWithPages(parseResult.pages)
      : chunkText(parseResult.text)

    if (chunkDataList.length === 0) {
      throw new Error('No text could be extracted from document')
    }

    await updateDocumentStatus(docMeta.id, 'embedding')
    store.updateProgress(docMeta.id, 50)

    const texts = chunkDataList.map((c) => c.text)
    const embeddings = await embedBatch(texts)

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

    store.updateProgress(docMeta.id, 80)
    await db.chunks.bulkAdd(chunks)

    await insertChunks(libraryId, chunks)

    await db.documents.update(docMeta.id, { chunkCount: chunks.length })
    await db.libraries.where('id').equals(libraryId).modify((lib) => {
      lib.chunkCount = (lib.chunkCount || 0) + chunks.length
    })

    await updateDocumentStatus(docMeta.id, 'indexed')
    store.updateProgress(docMeta.id, 100)
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error'
    await db.documents.update(docMeta.id, { status: 'error', error: errMsg })
  }
}

export async function ingestDocuments(files: File[], libraryId: string): Promise<void> {
  const store = useAppStore.getState()

  const docMetas = await Promise.all(
    files.map((file) =>
      createDocument(libraryId, {
        name: file.name,
        size: file.size,
        type: file.type,
      })
    )
  )

  store.addBatchToQueue(
    docMetas.map((doc) => ({ documentId: doc.id, libraryId })),
    files.length
  )

  for (let i = 0; i < files.length; i++) {
    await processDocument(docMetas[i]!, files[i]!, libraryId)
  }

  store.removeBatchFromQueue(docMetas.map((doc) => doc.id))
}
