// services/accountClassService.ts
import type { AccountClassApiResponse, AccountClassRecord, CreateAccountClassRequest, UpdateAccountClassRequest } from '@/types/accountClass'
import { toAccountClassRecords } from '@/utils/accountClassTransform'
import apiClient from '@/services/apiClient'

export const accountClassService = {
  getAll: async (): Promise<AccountClassRecord[]> => {
    const res = await apiClient.get<{ success: boolean; data: AccountClassApiResponse[] }>(
      '/api/finance/account-class'
    )
    return toAccountClassRecords(res.data.data)
  },

  create: async (payload: CreateAccountClassRequest): Promise<AccountClassApiResponse> => {
    const res = await apiClient.post<{ success: boolean; data: AccountClassApiResponse }>(
      '/api/finance/account-class',
      payload
    )
    return res.data.data
  },
  update: async (id: number, payload: UpdateAccountClassRequest): Promise<AccountClassApiResponse> => {
    const res = await apiClient.put<{ success: boolean; data: AccountClassApiResponse }>(
      `/api/finance/account-class/${id}`,
      payload
    )
    return res.data.data
  },

  remove: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/finance/account-class/${id}`)
  },
}