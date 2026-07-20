// services/gstinService.ts
import type { GSTINRecord } from '@/types/gstin'
import { MOCK_GSTIN_RECORDS } from '@/mocks/gstinMocks'
import axios from 'axios'

const API_BASE = '/api/organization/gstin'

const fallbackToMocks = () => {
  if (import.meta.env.DEV) {
    return true
  }

  return false
}

export const gstinService = {
  getAll: async (): Promise<GSTINRecord[]> => {
    if (fallbackToMocks()) {
      return MOCK_GSTIN_RECORDS
    }

    try {
      const res = await axios.get(API_BASE)
      return Array.isArray(res.data) ? res.data : MOCK_GSTIN_RECORDS
    } catch {
      return MOCK_GSTIN_RECORDS
    }
  },
}