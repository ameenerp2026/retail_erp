// services/gstinService.ts
import type { GSTINRecord } from '@/types/gstin'
import { MOCK_GSTIN_RECORDS } from '@/mocks/gstinMocks'
import axios from 'axios'

const API_BASE = '/api/organization/gstin'

export const gstinService = {
  getAll: async (): Promise<GSTINRecord[]> => {
    if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === 'true') {
      return MOCK_GSTIN_RECORDS
    }
    return axios.get(API_BASE).then(res => res.data)
  },
}