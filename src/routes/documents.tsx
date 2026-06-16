import { useParams } from 'react-router'

export function DocumentsPage() {
  const { libraryId } = useParams<{ libraryId: string }>()

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Documents</h2>
      <div className="rounded-lg border border-dashed border-surface-light bg-surface p-12 text-center">
        <p className="text-slate-400">
          Drag & drop files here to add documents to this library.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Library ID: {libraryId}
        </p>
      </div>
    </div>
  )
}
