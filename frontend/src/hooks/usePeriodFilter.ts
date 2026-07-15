import { useState, useMemo } from 'react'

type FilterableItem = {
  period: string
  financeStatus: string
  invStatus?: string
  cogsStatus?: string
}

export function usePeriodFilter<T extends FilterableItem>(items: T[]) {
  const [filters, setFilters] = useState<Record<string, string>>({})

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filters.fy && !item.period.toLowerCase().includes(filters.fy.toLowerCase())) return false
      if (filters.month && !item.period.toLowerCase().includes(filters.month.toLowerCase())) {
        return false
      }
      if (filters.status) {
        const status = filters.status.toLowerCase()
        const matchesFinance = item.financeStatus.toLowerCase().includes(status)
        const matchesInv = item.invStatus?.toLowerCase().includes(status)
        const matchesCogs = item.cogsStatus?.toLowerCase().includes(status)
        if (!matchesFinance && !matchesInv && !matchesCogs) return false
      }
      return true
    })
  }, [filters, items])

  return { filteredItems, setFilters }
}
