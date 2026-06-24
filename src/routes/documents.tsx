import { useParams } from 'react-router'
import { useDocuments } from '@/hooks/useDocuments'
import { DropZone } from '@/components/documents/DropZone'
import { useAppStore } from '@/store/app.store'
import { MainPanel } from '@/components/sidebar/MainPanel'

export function DocumentsPage() {
  const { libraryId } = useParams<{ libraryId: string }>()
  const { uploadFiles } = useDocuments(libraryId!)
  const modelStatus = useAppStore((s) => s.modelStatus)

  return (
    <MainPanel noAddDocment>
      <div className="flex-1 flex items-center justify-center p-6">
        <DropZone
          onFiles={(files) => uploadFiles(files)}
          disabled={modelStatus === 'loading'}
        />
      </div>
    </MainPanel>
  )
}
