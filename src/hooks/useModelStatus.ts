import { useEffect } from 'react'
import { toast } from 'sonner'
import { useAppStore } from '@/store/app.store'
import { initModel } from '@/services/embedding/embedding.service'

const TOAST_ID = 'model-status'

/** Hook that initializes and tracks the embedding model loading status */
export function useModelStatus() {
  const modelStatus = useAppStore((s) => s.modelStatus)
  const setModelStatus = useAppStore((s) => s.setModelStatus)

  useEffect(() => {
    async function loadModel() {
      if (modelStatus !== 'idle') return
      setModelStatus('loading')
      toast.loading('Loading embedding model...', { id: TOAST_ID })

      try {
        await initModel()
        setModelStatus('ready')
        toast.success('Model ready', { id: TOAST_ID, duration: 3000 })
      } catch (error) {
        console.error('Failed to load embedding model:', error)
        setModelStatus('error')
        toast.error('Failed to load model', {
          id: TOAST_ID,
          duration: Infinity,
          closeButton: true,
        })
      }
    }
    loadModel()
  }, [modelStatus, setModelStatus])

  return { modelStatus }
}
