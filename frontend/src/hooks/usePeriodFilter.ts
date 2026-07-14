import { useState, useMemo } from 'react'

type FilterableItem = {
  period: string
  financeStatus: string
  invStatus: string
  cogsStatus: string
}

export function usePeriodFilter<T extends FilterableItem>(items: T[]=[]) {
  const [filters, setFilters] = useState<Record<string, string>>({})

  const filteredItems = useMemo(() => {
     return (Array.isArray(items) ? items : []).filter((item) => {
      if (filters.fy && !item.period.toLowerCase().includes(filters.fy.toLowerCase())) return false
      if (filters.month && !item.period.toLowerCase().includes(filters.month.toLowerCase())) return false
      if (
        filters.status &&
        !item.financeStatus.toLowerCase().includes(filters.status.toLowerCase()) &&
        !item.invStatus.toLowerCase().includes(filters.status.toLowerCase()) &&
        !item.cogsStatus.toLowerCase().includes(filters.status.toLowerCase())
      ) return false
      return true
    })
  }, [filters, items])

  return { filteredItems, setFilters }
}


