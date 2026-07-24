import { RefreshCw, Pencil, Trash2, CheckCircle2 } from 'lucide-react'
import type { CurrencyRecord } from '@/types/currency'

type Props = {
  currency: CurrencyRecord
  onEdit: (currency: CurrencyRecord) => void
  onDelete: (currency: CurrencyRecord) => void
  onRefresh: (currency: CurrencyRecord) => void
}

export default function CurrencyCard({ currency, onEdit, onDelete, onRefresh }: Props) {
  const { code, name, symbol, exchangeRate, isBase, lastUpdated } = currency

  return (
    <div
      className={`relative rounded-2xl border p-5 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] transition ${
        isBase
          ? 'bg-[#21B6A808] border-[#21B6A8]'
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Base badge */}
      {isBase && (
        <span className="absolute top-3 right-3 flex items-center gap-1 bg-[#21B6A826] text-[#21B6A8] text-[10px] font-bold px-2 py-0.5 rounded-full">
          <CheckCircle2 size={9} />
          BASE
        </span>
      )}

      {/* Symbol + code + name */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            isBase ? 'bg-[#21B6A826]' : 'bg-[#0B4D8C1A]'
          }`}
        >
          <span
            className={`text-xl font-extrabold ${
              isBase ? 'text-[#21B6A8]' : 'text-[#0B4D8C]'
            }`}
          >
            {symbol}
          </span>
        </div>
        <div>
          <p className="text-[16px] font-bold text-[#043793] leading-6">{code}</p>
          <p className="text-xs text-[#94A3B8]">{name}</p>
        </div>
      </div>

      {/* Exchange rate + refresh */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] text-[#94A3B8] leading-4">Exchange Rate (vs INR)</p>
          <p className="text-[22px] font-extrabold text-[#043793] leading-8">
            {exchangeRate.toFixed(4)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onRefresh(currency)}
            title="Refresh rate"
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#21B6A8] hover:bg-slate-50 transition"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={() => onEdit(currency)}
            title="Edit currency"
            className="p-1.5 rounded-lg text-[#4FC3F7] hover:text-blue-500 hover:bg-slate-50 transition"
          >
            <Pencil size={14} />
          </button>
          {!isBase && (
            <button
              onClick={() => onDelete(currency)}
              title="Delete currency"
              className="p-1.5 rounded-lg text-[#CBD5E1] hover:text-red-500 hover:bg-slate-50 transition"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Last updated */}
      <p className="text-[11px] text-[#94A3B8] mt-3">Last updated: {lastUpdated}</p>
    </div>
  )
}
