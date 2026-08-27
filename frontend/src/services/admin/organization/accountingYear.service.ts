import apiClient from '@/services/apiClient'

export const getAccountingYears = async () => {
  const response = await apiClient.get('/api/accountingYear/accounting-Year')
  return response.data.data
}
