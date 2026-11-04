import { useQuery } from '@tanstack/react-query'
import { getFinanceData, getActivity } from '@/services/admin/organization/finance.service'

export const useGetFinanceMonths = () => {
  return useQuery({
    queryKey: ['finance-months'],
    queryFn: getFinanceData,
    staleTime: 1000 * 60 * 10,
  })
}

export const useGetFinanceActivity = () => {
  return useQuery({
    queryKey: ['finance-activity'],
    queryFn: getActivity,
    staleTime: 1000 * 60 * 10,
  })
}