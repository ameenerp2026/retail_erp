// services/gstStateService.ts
import type { GSTStateRecord } from '@/types/gstState'
import { MOCK_GST_STATES } from '@/mocks/gstStateMocks'
import axios from 'axios'

const API_BASE = '/api/organization/gst-states'

export const gstStateService = {
  getAll: async (): Promise<GSTStateRecord[]> => {
    if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === 'true') {
      return MOCK_GST_STATES
    }
    return axios.get(API_BASE).then(res => res.data)
  },
}