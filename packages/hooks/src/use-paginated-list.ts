import { useCallback, useEffect, useRef, useState } from 'react'

export interface PaginatedListParams {
  start: number
  length: number
  signal?: AbortSignal
  [key: string]: unknown
}

export interface PaginatedListResult<T> {
  items: T[]
  total: number
}

export interface UsePaginatedListOptions<T> {
  fetcher: (params: PaginatedListParams) => Promise<PaginatedListResult<T>>
  initialPageSize?: number
  extraDeps?: unknown[]
  extraParams?: Record<string, unknown>
  onRefresh?: () => void
}

export interface UsePaginatedListReturn<T> {
  data: T[]
  total: number
  loading: boolean
  error: string | null
  currentPage: number
  pageSize: number
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
  refetch: () => void
}

export function usePaginatedList<T>({
  fetcher,
  initialPageSize = 12,
  extraDeps = [],
  extraParams,
  onRefresh,
}: UsePaginatedListOptions<T>): UsePaginatedListReturn<T> {
  const [data, setData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSizeState] = useState(initialPageSize)
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchIdRef = useRef(0)
  const latest = useRef({ fetcher, extraParams })
  latest.current = { fetcher, extraParams }

  useEffect(() => {
    const fetchId = ++fetchIdRef.current
    const controller = new AbortController()
    setLoading(true)

    latest.current
      .fetcher({
        start: (currentPage - 1) * pageSize,
        length: pageSize,
        signal: controller.signal,
        ...latest.current.extraParams,
      })
      .then((result) => {
        if (fetchIdRef.current !== fetchId) return
        setData(result.items)
        setTotal(result.total)
        setError(null)
        setLoading(false)
        setCurrentPage((prev) => {
          const maxPage = Math.max(1, Math.ceil(result.total / pageSize))
          return prev > maxPage ? maxPage : prev
        })
      })
      .catch((err) => {
        if (err instanceof Error && err.name === 'AbortError') return
        if (fetchIdRef.current !== fetchId) return
        setError(err instanceof Error ? err.message : 'Failed to load data')
        setLoading(false)
      })

    return () => controller.abort()
  }, [currentPage, pageSize, refreshKey, ...extraDeps])

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size)
    setCurrentPage(1)
  }, [])

  const refetch = useCallback(() => {
    onRefresh?.()
    setRefreshKey((k) => k + 1)
  }, [onRefresh])

  return { data, total, loading, error, currentPage, pageSize, setCurrentPage, setPageSize, refetch }
}