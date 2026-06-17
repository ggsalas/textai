import { getEmbeddingWorker } from '@/workers/worker-api'
import type { EmbeddingModelStatus } from '@/workers/embedding.worker'

export async function initModel(): Promise<void> {
  const worker = getEmbeddingWorker()
  await worker.loadModel()
}

export async function getModelStatus(): Promise<EmbeddingModelStatus> {
  const worker = getEmbeddingWorker()
  return worker.getStatus()
}

export async function embed(text: string): Promise<number[]> {
  const worker = getEmbeddingWorker()
  return worker.generateEmbedding(text)
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const worker = getEmbeddingWorker()
  return worker.generateEmbeddings(texts)
}
