import { useState, useMemo } from 'react'

type FilterableItem = {
  period: string
  financeStatus?: string
  invStatus?: string
  cogsStatus?: string
}

export function usePeriodFilter<T extends FilterableItem>(items: T[] = []) {
  const [filters, setFilters] = useState<Record<string, string>>({})
  const safeItems = Array.isArray(items) ? items : []

  const filteredItems = useMemo(() => {
    return safeItems.filter((item) => {
      const financeStatus = item.financeStatus?.toLowerCase() ?? ''
      const invStatus = item.invStatus?.toLowerCase() ?? ''
      const cogsStatus = item.cogsStatus?.toLowerCase() ?? ''
      const period = item.period?.toLowerCase() ?? ''

      if (filters.fy && !period.includes(filters.fy.toLowerCase())) return false
      if (filters.month && !period.includes(filters.month.toLowerCase())) return false
      if (
        filters.status &&
        !financeStatus.includes(filters.status.toLowerCase()) &&
        !invStatus.includes(filters.status.toLowerCase()) &&
        !cogsStatus.includes(filters.status.toLowerCase())
      ) return false
      return true
    })
  }, [filters, safeItems])

  return { filteredItems, setFilters }
}