import { Pencil, Plus, RefreshCw, Star } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { currencyService } from '@/services/currencyService'

export default function CurrencyPage() {
  const { data: currencies = [], isLoading } = useQuery({
    queryKey: ['currencies'],
    queryFn: currencyService.getCurrencies,
  })

  if (isLoading) {
    return <div className="page-shell text-sm text-slate-500">Loading...</div>
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Currency</h1>
          <p className="page-subtitle">
            Exchange rate management and base currency configuration
          </p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-[14px] border border-slate-200 bg-[#F5F7FB] px-3 text-xs font-semibold text-slate-500 sm:px-4"
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline">Refresh Rates</span>
          </button>
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-[14px] bg-[linear-gradient(#093055,#043793)] px-3 text-xs font-semibold text-white sm:px-4"
          >
            <Plus size={13} />
            <span className="hidden sm:inline">Add Currency</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {currencies.map((currency) => (
          <div
            key={currency.id}
            className={`relative rounded-2xl border p-5 shadow-sm ${
              currency.isBase
                ? 'border-[#21B6A8]/40 bg-[rgba(33,182,168,0.03)]'
                : 'border-slate-200 bg-white'
            }`}
          >
            {currency.isBase && (
              <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-[rgba(33,182,168,0.15)] px-2 py-0.5 text-[10px] font-bold text-[#21B6A8]">
                <Star size={10} fill="currentColor" />
                BASE
              </span>
            )}

            <div className="mb-6 flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-[14px] text-xl font-extrabold ${
                  currency.isBase
                    ? 'bg-[rgba(33,182,168,0.15)] text-[#21B6A8]'
                    : 'bg-slate-100 text-[#043793]'
                }`}
              >
                {currency.symbol}
              </div>
              <div>
                <p className="text-sm font-bold text-[#043793]">{currency.code}</p>
                <p className="text-xs text-slate-400">{currency.name}</p>
              </div>
            </div>

            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="text-[11px] text-slate-400">Exchange Rate (vs INR)</p>
                <p className="mt-0.5 text-xl font-extrabold text-[#043793]">
                  {currency.exchangeRate}
                </p>
              </div>
              <button
                type="button"
                className="rounded-lg p-2 text-[#21B6A8] hover:bg-[rgba(33,182,168,0.1)]"
              >
                <Pencil size={14} />
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              Last updated: {currency.lastUpdated}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
