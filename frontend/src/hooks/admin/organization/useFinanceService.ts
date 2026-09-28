import { useQuery } from '@tanstack/react-query'
import { getFinanceData, getActivity } from '@/services/admin/organization/finance.service'

export const useGetFinanceMonths = () => {
  return useQuery({
    queryKey: ['finance-months'],
    queryFn: getFinanceData,
    staleTime: 1000 * 60 * 10,
  })
}

export const useGetFinanceActivity = (periodId?: number | string) => {
  return useQuery({
    queryKey: ['finance-activity', periodId],
    queryFn: () => getActivity(periodId),
    staleTime: 1000 * 60 * 10,
  })
}