
import apiClient from '@/services/apiClient'

export const getFinanceData=async()=>{
  const response = await apiClient.get(
    "/api/financeMonth/finance-month")
    return response.data.data
}
// TODO: wire this up to a real backend endpoint (activity log for a finance period)
export const getActivity = async (_periodId: number) => {
  return []
}

export const financeService = {
  getFinanceData,
  getActivity,
}