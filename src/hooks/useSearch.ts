import { useState, useCallback, useRef, useEffect } from 'react'
import { search as searchService } from '@/services/search/search.service'
import { DEFAULT_MAX_RESULTS, DEFAULT_MIN_SCORE } from '@/lib/constants'
import type { SearchResult, HybridWeights } from '@/types/search'

/** Hook for performing hybrid search within a library */
export function useSearch(libraryId: string, initialQuery = '') {
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [hybridWeights, setHybridWeights] = useState<HybridWeights>({ text: 0.5, vector: 0.5 })
  const [maxResults, setMaxResults] = useState(DEFAULT_MAX_RESULTS)
  const [minScore, setMinScore] = useState(DEFAULT_MIN_SCORE)
  const abortRef = useRef(0)
  const initialSearchDone = useRef(false)

  const performSearch = useCallback(
    async (searchQuery: string) => {
      const trimmed = searchQuery.trim()
      setQuery(searchQuery)

      if (!trimmed) {
        setResults([])
        setError(null)
        setHasSearched(false)
        return
      }

      const searchId = ++abortRef.current
      setIsSearching(true)
      setError(null)

      try {
        const searchResults = await searchService(trimmed, libraryId, maxResults, hybridWeights, minScore)
        if (searchId === abortRef.current) {
          setResults(searchResults)
          setHasSearched(true)
        }
      } catch (err) {
        if (searchId === abortRef.current) {
          setError(err instanceof Error ? err.message : 'Search failed')
          setResults([])
          setHasSearched(true)
        }
      } finally {
        if (searchId === abortRef.current) {
          setIsSearching(false)
        }
      }
    },
    [libraryId, hybridWeights, maxResults, minScore],
  )

  const clearResults = useCallback(() => {
    setQuery('')
    setResults([])
    setError(null)
    setHasSearched(false)
    abortRef.current++
  }, [])

  useEffect(() => {
    if (initialQuery.trim() && !initialSearchDone.current) {
      initialSearchDone.current = true
      performSearch(initialQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery])

  // Re-run search when search config changes
  useEffect(() => {
    if (query.trim() && hasSearched) {
      performSearch(query)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hybridWeights, maxResults, minScore])

  return {
    query,
    results,
    isSearching,
    error,
    hasSearched,
    search: performSearch,
    clearResults,
    hybridWeights,
    setHybridWeights,
    maxResults,
    setMaxResults,
    minScore,
    setMinScore,
  }
}
