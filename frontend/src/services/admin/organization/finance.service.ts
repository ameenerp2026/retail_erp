
import apiClient from '@/services/apiClient'

export const getFinanceData=async()=>{
  const response = await apiClient.get(
    "/api/financeMonth/finance-month")
    return response.data.data
}