import type { SearchResult } from '@/types/search'
import { ScoreBadge } from './ScoreBadge'
import { Link, useParams, useSearchParams } from 'react-router'

interface ResultCardProps {
  result: SearchResult
  rank: number
}

export function ResultCard({ result, rank }: ResultCardProps) {
  const { libraryId } = useParams<{ libraryId: string }>()
  const [searchParams] = useSearchParams()
  const currentQuery = searchParams.get('q') || ''

  return (
    <Link
      to={`/libraries/${libraryId}/documents/${result.documentId}?chunk=${result.chunkIndex}`}
      state={{ searchQuery: currentQuery }}
      className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex-shrink-0 text-sm font-medium text-gray-400">
            #{rank}
          </span>
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {result.documentName}
          </h3>
        </div>
        <ScoreBadge score={result.score} />
      </div>

      {result.page && (
        <p className="text-xs text-gray-500 mb-2">
          Page {result.page} · Chunk {result.chunkIndex + 1}
        </p>
      )}
      {!result.page && (
        <p className="text-xs text-gray-500 mb-2">
          Chunk {result.chunkIndex + 1}
        </p>
      )}

      <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
        {result.text}
      </p>
    </Link>
  )
}
