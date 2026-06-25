import { create } from 'zustand'

export type ModelStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface AppState {
  modelStatus: ModelStatus
  setModelStatus: (status: ModelStatus) => void
}

export const useAppStore = create<AppState>((set) => ({
  modelStatus: 'idle',
  setModelStatus: (status) => set({ modelStatus: status }),
}))
