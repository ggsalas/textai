import { useState, useCallback, useRef, useEffect } from 'react'
import { search as searchService } from '@/services/search/search.service'
import type { SearchResult, HybridWeights } from '@/types/search'

/** Hook for performing hybrid search within a library */
export function useSearch(libraryId: string, initialQuery = '') {
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [hybridWeights, setHybridWeights] = useState<HybridWeights>({
    text: 0.5,
    vector: 0.5,
  })
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
        const searchResults = await searchService(
          trimmed,
          libraryId,
          undefined,
          hybridWeights,
        )

        // Only update if this is still the latest search
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
    [libraryId, hybridWeights],
  )

  const clearResults = useCallback(() => {
    setQuery('')
    setResults([])
    setError(null)
    setHasSearched(false)
    abortRef.current++
  }, [])

  // Perform initial search if initialQuery is provided
  useEffect(() => {
    if (initialQuery.trim() && !initialSearchDone.current) {
      initialSearchDone.current = true
      performSearch(initialQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery])

  // Re-run search when hybrid weights change (if there's an active query)
  useEffect(() => {
    if (query.trim() && hasSearched) {
      performSearch(query)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hybridWeights])

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
  }
}
