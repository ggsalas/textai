import { create } from 'zustand'

export type ModelStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface ProcessingItem {
  documentId: string
  libraryId: string
  progress: number // 0-100
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
  addToQueue: (item: Omit<ProcessingItem, 'progress'>) => void
  updateProgress: (documentId: string, progress: number) => void
  removeFromQueue: (documentId: string) => void
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

  addToQueue: (item) =>
    set((state) => ({
      processingQueue: [...state.processingQueue, { ...item, progress: 0 }],
    })),

  updateProgress: (documentId, progress) =>
    set((state) => ({
      processingQueue: state.processingQueue.map((item) =>
        item.documentId === documentId ? { ...item, progress } : item
      ),
    })),

  removeFromQueue: (documentId) =>
    set((state) => ({
      processingQueue: state.processingQueue.filter((item) => item.documentId !== documentId),
    })),

  setStats: (stats) =>
    set((state) => ({
      stats: { ...state.stats, ...stats },
    })),
}))
