import type { CurrencyRecord } from '@/types/currency'

export const MOCK_CURRENCIES: CurrencyRecord[] = [
  { id: "1", code: "INR", name: "Indian Rupee",       symbol: "₹",  exchangeRate: 1.0,     isBase: true,  lastUpdated: "21 May 2026" },
  { id: "2", code: "USD", name: "US Dollar",          symbol: "$",  exchangeRate: 83.42,   isBase: false, lastUpdated: "21 May 2026" },
  { id: "3", code: "EUR", name: "Euro",               symbol: "€",  exchangeRate: 90.15,   isBase: false, lastUpdated: "21 May 2026" },
  { id: "4", code: "GBP", name: "British Pound",      symbol: "£",  exchangeRate: 105.78,  isBase: false, lastUpdated: "21 May 2026" },
  { id: "5", code: "AED", name: "UAE Dirham",         symbol: "د.إ", exchangeRate: 22.71,   isBase: false, lastUpdated: "20 May 2026" },
  { id: "6", code: "JPY", name: "Japanese Yen",       symbol: "¥",  exchangeRate: 0.54,    isBase: false, lastUpdated: "20 May 2026" },
  { id: "7", code: "SGD", name: "Singapore Dollar",   symbol: "S$", exchangeRate: 61.89,   isBase: false, lastUpdated: "19 May 2026" },
  { id: "8", code: "AUD", name: "Australian Dollar",  symbol: "A$", exchangeRate: 54.32,   isBase: false, lastUpdated: "19 May 2026" },
]
