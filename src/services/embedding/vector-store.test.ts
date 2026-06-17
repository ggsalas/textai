import { describe, it, expect, beforeEach } from 'vitest'
import {
  insertChunks,
  searchByVector,
  rebuildIndex,
  removeIndex,
  hasIndex,
  removeByDocumentId,
} from './vector-store'
import type { Chunk } from '@/types/document'

function makeChunk(overrides: Partial<Chunk> = {}): Chunk {
  return {
    id: 'chunk-1',
    libraryId: 'lib-1',
    documentId: 'doc-1',
    documentName: 'test.pdf',
    chunkIndex: 0,
    text: 'sample text',
    embedding: Array(384).fill(0.1),
    ...overrides,
  }
}

beforeEach(() => {
  removeIndex('lib-1')
})

describe('vector-store', () => {
  it('should insert chunks and create index', async () => {
    const chunk = makeChunk()
    await insertChunks('lib-1', [chunk])
    expect(hasIndex('lib-1')).toBe(true)
  })

  it('should search by vector and return results', async () => {
    const chunk = makeChunk()
    await insertChunks('lib-1', [chunk])

    const queryVector = Array(384).fill(0.1)
    const results = await searchByVector('lib-1', queryVector, 5)

    expect(results.length).toBeGreaterThan(0)
    expect(results[0]!.documentId).toBe('doc-1')
    expect(results[0]!.text).toBe('sample text')
    expect(results[0]!.score).toBeGreaterThan(0)
  })

  it('should return empty array for non-existent index', async () => {
    const queryVector = Array(384).fill(0.1)
    const results = await searchByVector('non-existent', queryVector)
    expect(results).toEqual([])
  })

  it('should rebuild index from scratch', async () => {
    const chunk1 = makeChunk({ id: 'chunk-1', text: 'first' })
    await insertChunks('lib-1', [chunk1])

    const chunk2 = makeChunk({ id: 'chunk-2', text: 'second' })
    await rebuildIndex('lib-1', [chunk2])

    const queryVector = Array(384).fill(0.1)
    const results = await searchByVector('lib-1', queryVector, 10)
    expect(results).toHaveLength(1)
    expect(results[0]!.text).toBe('second')
  })

  it('should remove chunks by documentId', async () => {
    const chunk1 = makeChunk({ id: 'c1', documentId: 'doc-1' })
    const chunk2 = makeChunk({ id: 'c2', documentId: 'doc-2', text: 'other' })
    await insertChunks('lib-1', [chunk1, chunk2])

    await removeByDocumentId('lib-1', 'doc-1')

    const queryVector = Array(384).fill(0.1)
    const results = await searchByVector('lib-1', queryVector, 10)
    expect(results.every((r) => r.documentId !== 'doc-1')).toBe(true)
  })
})
