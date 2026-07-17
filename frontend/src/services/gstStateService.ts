import type { GSTStateRecord } from '@/types/gstState'
import { MOCK_GST_STATES } from '@/mocks/gstStateMocks'
import apiClient from '@/services/apiClient'
import { fromMockOrApi } from '@/services/dataSource'

export const gstStateService = {
  getAll: () =>
    fromMockOrApi(MOCK_GST_STATES, () =>
      apiClient.get<GSTStateRecord[]>('/api/organization/gst-states').then((res) => res.data)
    ),
}
