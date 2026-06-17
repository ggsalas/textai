import { useAppStore } from '@/store/app.store'

interface ProcessingStatusProps {
  libraryId: string
}

export function ProcessingStatus({ libraryId }: ProcessingStatusProps) {
  const processingQueue = useAppStore((s) => s.processingQueue)
  const items = processingQueue.filter((item) => item.libraryId === libraryId)

  if (items.length === 0) return null

  return (
    <div className="space-y-3 mb-6">
      <h3 className="text-sm font-medium text-gray-700">
        Processing ({items.length} {items.length === 1 ? 'document' : 'documents'})
      </h3>
      {items.map((item) => (
        <div key={item.documentId} className="bg-white rounded-lg border p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 truncate">{item.documentId}</span>
            <span className="text-xs text-gray-500">{item.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
