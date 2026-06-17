import { CHUNK_SIZE, CHUNK_OVERLAP } from '@/lib/constants'

export interface ChunkData {
  text: string
  chunkIndex: number
  page?: number
}

export interface ChunkOptions {
  size?: number
  overlap?: number
}

export function chunkText(text: string, options?: ChunkOptions): ChunkData[] {
  const size = options?.size ?? CHUNK_SIZE
  const overlap = options?.overlap ?? CHUNK_OVERLAP
  const chunks: ChunkData[] = []

  if (!text.trim()) return chunks

  // Dividir por párrafos primero
  const paragraphs = text.split(/\n\s*\n/)
  let currentChunk = ''
  let chunkIndex = 0

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim()
    if (!trimmed) continue

    // Si agregar este párrafo excede el tamaño, cerrar chunk actual
    if (currentChunk.length + trimmed.length + 1 > size && currentChunk.length > 0) {
      chunks.push({ text: currentChunk.trim(), chunkIndex })
      chunkIndex++

      // Overlap: mantener las últimas `overlap` chars del chunk anterior
      if (overlap > 0 && currentChunk.length > overlap) {
        currentChunk = currentChunk.slice(-overlap) + ' ' + trimmed
      } else {
        currentChunk = trimmed
      }
    } else {
      currentChunk = currentChunk ? currentChunk + '\n\n' + trimmed : trimmed
    }

    // Si un solo párrafo excede el tamaño, dividirlo por oraciones
    while (currentChunk.length > size) {
      const breakPoint = findBreakPoint(currentChunk, size)
      chunks.push({ text: currentChunk.slice(0, breakPoint).trim(), chunkIndex })
      chunkIndex++

      const remaining = currentChunk.slice(breakPoint - overlap).trim()
      currentChunk = remaining
    }
  }

  // Último chunk
  if (currentChunk.trim()) {
    chunks.push({ text: currentChunk.trim(), chunkIndex })
  }

  return chunks
}

/** Con páginas (para PDF): divide texto ya separado por páginas */
export function chunkTextWithPages(pages: string[], options?: ChunkOptions): ChunkData[] {
  const size = options?.size ?? CHUNK_SIZE
  const overlap = options?.overlap ?? CHUNK_OVERLAP
  const chunks: ChunkData[] = []
  let chunkIndex = 0
  let currentChunk = ''
  let currentPage = 1

  for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
    const pageText = pages[pageIdx]!.trim()
    if (!pageText) continue

    const sentences = splitSentences(pageText)
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length + 1 > size && currentChunk.length > 0) {
        chunks.push({ text: currentChunk.trim(), chunkIndex, page: currentPage })
        chunkIndex++
        if (overlap > 0 && currentChunk.length > overlap) {
          currentChunk = currentChunk.slice(-overlap) + ' ' + sentence
        } else {
          currentChunk = sentence
        }
      } else {
        currentChunk = currentChunk ? currentChunk + ' ' + sentence : sentence
      }
      currentPage = pageIdx + 1
    }
  }

  if (currentChunk.trim()) {
    chunks.push({ text: currentChunk.trim(), chunkIndex, page: currentPage })
  }

  return chunks
}

function findBreakPoint(text: string, maxLength: number): number {
  // Buscar fin de oración antes del límite
  const sub = text.slice(0, maxLength)
  const lastPeriod = sub.lastIndexOf('. ')
  if (lastPeriod > maxLength * 0.5) return lastPeriod + 2
  const lastSpace = sub.lastIndexOf(' ')
  if (lastSpace > maxLength * 0.3) return lastSpace + 1
  return maxLength
}

function splitSentences(text: string): string[] {
  return text.match(/[^.!?]+[.!?]+\s*|[^.!?]+$/g) || [text]
}
