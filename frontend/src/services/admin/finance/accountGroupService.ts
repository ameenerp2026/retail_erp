import type { SubGroup,CreateAccountGroupRequest, AccountGroupRow} from '@/types/accountGroup'
import { MOCK_ACCOUNT_GROUPS } from '@/mocks/accountGroupMocks'
import apiClient from '@/services/apiClient'
import { fromMockOrApi } from '@/services/dataSource'
import { groups } from '@/mocks/accountGroupSubgroupMocks'

export const accountGroupService = {
  getAll: () =>
  fromMockOrApi(MOCK_ACCOUNT_GROUPS, () =>
    apiClient.get<{ success: boolean; data: AccountGroupRow[] }>('/api/finance/account-groups')
      .then((res) => res.data.data)  // ← unwrap: res.data is the envelope, res.data.data is the array
  ),
  getActiveGroups: () =>
    apiClient
    .get<{ success: boolean; data: AccountGroupRow[] }>('/api/finance/account-groups?status=active')
    .then((res) => res.data.data),  // ← unwrap: res.data is the envelope, res.data.data is the array
  
  getGroups: () =>
  fromMockOrApi(groups, () =>
    apiClient
      .get('/api/finance/account-groups/groups')
      .then((res) => res.data.data)
  ),
 getSubGroups: (groupId: number) =>
  fromMockOrApi<SubGroup[]>([], () =>
    apiClient
      .get('/api/finance/account-groups/sub-groups/' + groupId)
      .then((res) => res.data.data)
  ),
  create: (payload: CreateAccountGroupRequest) =>
  apiClient
    .post("/api/finance/account-groups", payload)
    .then((res) => res.data),
}
