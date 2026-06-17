import { wrap, type Remote } from 'comlink'
import type { ParserWorkerAPI } from './parser.worker'
import type { EmbeddingWorkerAPI } from './embedding.worker'

let parserWorker: Remote<ParserWorkerAPI> | null = null
let embeddingWorker: Remote<EmbeddingWorkerAPI> | null = null

export function getParserWorker(): Remote<ParserWorkerAPI> {
  if (!parserWorker) {
    const worker = new Worker(
      new URL('./parser.worker.ts', import.meta.url),
      { type: 'module' }
    )
    parserWorker = wrap<ParserWorkerAPI>(worker)
  }
  return parserWorker
}

export function getEmbeddingWorker(): Remote<EmbeddingWorkerAPI> {
  if (!embeddingWorker) {
    const worker = new Worker(
      new URL('./embedding.worker.ts', import.meta.url),
      { type: 'module' }
    )
    embeddingWorker = wrap<EmbeddingWorkerAPI>(worker)
  }
  return embeddingWorker
}
