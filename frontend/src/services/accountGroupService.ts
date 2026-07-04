// services/accountGroupService.ts
import type { AccountGroupNode } from '@/types/accountGroup'
import { MOCK_ACCOUNT_GROUPS } from '@/mocks/accountGroupMocks'
import axios from 'axios'

export const accountGroupService = {
  getAll: async (): Promise<AccountGroupNode[]> => {
    if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === 'true') {
      return MOCK_ACCOUNT_GROUPS
    }
    return axios.get('/api/finance/account-groups').then(res => res.data)
  },
}