import type { Currency } from '@/types/currency'

export const MOCK_CURRENCIES: Currency[] = [
  {
    id: '1',
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    exchangeRate: '1.0000',
    lastUpdated: '21 May 2026',
    isBase: true,
  },
  {
    id: '2',
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    exchangeRate: '83.4520',
    lastUpdated: '21 May 2026',
    isBase: false,
  },
  {
    id: '3',
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    exchangeRate: '90.2180',
    lastUpdated: '21 May 2026',
    isBase: false,
  },
  {
    id: '4',
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    exchangeRate: '106.3400',
    lastUpdated: '20 May 2026',
    isBase: false,
  },
]
