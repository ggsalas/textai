import { create } from 'zustand'

export type ModelStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface ProcessingItem {
  documentId: string
  libraryId: string
  progress: number // 0-100
  totalFiles: number
}

export interface AppState {
  modelStatus: ModelStatus
  processingQueue: ProcessingItem[]
  stats: {
    totalLibraries: number
    totalDocuments: number
    totalChunks: number
  }
  // Actions
  setModelStatus: (status: ModelStatus) => void
  addBatchToQueue: (items: Array<Omit<ProcessingItem, 'progress' | 'totalFiles'>>, totalFiles: number) => void
  updateProgress: (documentId: string, progress: number) => void
  removeBatchFromQueue: (documentIds: string[]) => void
  setStats: (stats: Partial<AppState['stats']>) => void
}

export const useAppStore = create<AppState>((set) => ({
  modelStatus: 'idle',
  processingQueue: [],
  stats: {
    totalLibraries: 0,
    totalDocuments: 0,
    totalChunks: 0,
  },

  setModelStatus: (status) => set({ modelStatus: status }),

  addBatchToQueue: (items, totalFiles) =>
    set((state) => ({
      processingQueue: [
        ...state.processingQueue,
        ...items.map((item) => ({ ...item, progress: 0, totalFiles })),
      ],
    })),

  updateProgress: (documentId, progress) =>
    set((state) => ({
      processingQueue: state.processingQueue.map((item) =>
        item.documentId === documentId ? { ...item, progress } : item
      ),
    })),

  removeBatchFromQueue: (documentIds) =>
    set((state) => ({
      processingQueue: state.processingQueue.filter(
        (item) => !documentIds.includes(item.documentId)
      ),
    })),

  setStats: (stats) =>
    set((state) => ({
      stats: { ...state.stats, ...stats },
    })),
}))
