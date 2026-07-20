// services/gstStateService.ts
import type { GSTStateRecord } from '@/types/gstState'
import { MOCK_GST_STATES } from '@/mocks/gstStateMocks'
import axios from 'axios'

const API_BASE = '/api/organization/gst-states'

const fallbackToMocks = () => {
  if (import.meta.env.DEV) {
    return true
  }

  return false
}

export const gstStateService = {
  getAll: async (): Promise<GSTStateRecord[]> => {
    if (fallbackToMocks()) {
      return MOCK_GST_STATES
    }

    try {
      const res = await axios.get(API_BASE)
      return Array.isArray(res.data) ? res.data : MOCK_GST_STATES
    } catch {
      return MOCK_GST_STATES
    }
  },
}