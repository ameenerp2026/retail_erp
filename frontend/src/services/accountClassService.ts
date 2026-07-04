// services/accountClassService.ts
import type { AccountClassRecord } from '@/types/accountClass'
import { MOCK_ACCOUNT_CLASSES } from '@/mocks/accountClassMocks'
import axios from 'axios'

export const accountClassService = {
  getAll: async (): Promise<AccountClassRecord[]> => {
    if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === 'true') {
      return MOCK_ACCOUNT_CLASSES
    }
    return axios.get('/api/finance/account-classes').then(res => res.data)
  },
}