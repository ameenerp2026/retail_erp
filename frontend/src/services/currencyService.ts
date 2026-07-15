import type { Currency } from '@/types/currency'
import { MOCK_CURRENCIES } from '@/mocks/currency.mock'
import apiClient from '@/services/apiClient'
import { fromMockOrApi } from '@/services/dataSource'

const API_BASE = '/api/finance/currencies'

export const currencyService = {
  getCurrencies: () =>
    fromMockOrApi(MOCK_CURRENCIES, () =>
      apiClient.get<Currency[]>(API_BASE).then((res) => res.data)
    ),
}
