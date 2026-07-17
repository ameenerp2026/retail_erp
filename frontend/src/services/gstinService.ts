import type { GSTINRecord } from '@/types/gstin'
import { MOCK_GSTIN_RECORDS } from '@/mocks/gstinMocks'
import apiClient from '@/services/apiClient'
import { fromMockOrApi } from '@/services/dataSource'

export const gstinService = {
  getAll: () =>
    fromMockOrApi(MOCK_GSTIN_RECORDS, () =>
      apiClient.get<GSTINRecord[]>('/api/organization/gstin').then((res) => res.data)
    ),
}
