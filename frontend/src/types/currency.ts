export type CurrencyRecord = {
  id: string
  code: string           // e.g. INR, USD
  name: string           // e.g. Indian Rupee
  symbol: string         // e.g. ₹, $
  exchangeRate: number   // rate vs base currency
  isBase: boolean        // true for the base currency
  lastUpdated: string
}

export type CreateCurrencyRequest = {
  code: string
  name: string
  symbol: string
  exchangeRate: number
  isBase: boolean
}

export type UpdateCurrencyRequest = CreateCurrencyRequest