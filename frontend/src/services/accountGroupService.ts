import type { AccountGroupNode } from '@/types/accountGroup'
import { MOCK_ACCOUNT_GROUPS } from '@/mocks/accountGroupMocks'
import apiClient from '@/services/apiClient'
import { fromMockOrApi } from '@/services/dataSource'

export const accountGroupService = {
  getAll: () =>
    fromMockOrApi(MOCK_ACCOUNT_GROUPS, () =>
      apiClient.get<AccountGroupNode[]>('/api/finance/account-groups').then((res) => res.data)
    ),
}
