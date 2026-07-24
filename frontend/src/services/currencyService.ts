// services/currencyService.ts
import type { CurrencyRecord } from '@/types/currency'
import { MOCK_CURRENCIES } from '@/mocks/currencyMocks'
import axios from 'axios'

export const currencyService = {
  getAll: async (): Promise<CurrencyRecord[]> => {
    if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === 'true') {
      return MOCK_CURRENCIES
    }
    return axios.get('/api/finance/currencies').then(res => res.data)
  },
}
