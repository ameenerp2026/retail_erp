import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { RefreshCw, Plus, Search } from 'lucide-react'
import { toast } from 'react-hot-toast'
import SimpleStatCard from '@/components/shared/SimpleStatCard'
import { Modal } from '@/components/shared/Modal'
import CurrencyCard from '@/modules/Finance/components/Currency/CurrencyCard'
import CurrencyForm from '@/modules/Finance/components/Currency/CurrencyForm'
import { currencyService } from '@/services/currencyService'
import type { CurrencyRecord } from '@/types/currency'

function Currency() {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState<CurrencyRecord | null>(null)

  const { data } = useQuery({
    queryKey: ['currencies'],
    queryFn: currencyService.getAll,
  })

  // Guard against non-array responses (e.g. API error payloads) so the page never crashes
  const currencies = Array.isArray(data) ? data : []

  const filteredCurrencies = useMemo(() => {
    if (!search) return currencies
    const q = search.toLowerCase()
    return currencies.filter((c: CurrencyRecord) =>
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q)
    )
  }, [search, currencies])

  const baseCurrency = currencies.find((c) => c.isBase)

  const statCards = [
    { id: 1, label: "Total Currencies", count: currencies.length,                       textColor: "text-[#0B4D8C]" },
    { id: 2, label: "Base Currency",    count: baseCurrency ? 1 : 0,                     textColor: "text-[#21B6A8]" },
    { id: 3, label: "Foreign",          count: currencies.filter((c) => !c.isBase).length, textColor: "text-[#F59E0B]" },
  ]

  function openCreate() {
    setEditing(null)
    setIsModalOpen(true)
  }

  function handleEdit(currency: CurrencyRecord) {
    setEditing(currency)
    setIsModalOpen(true)
  }

  function handleDelete(currency: CurrencyRecord) {
    console.log('Delete', currency)
  }

  function handleRefresh(currency: CurrencyRecord) {
    console.log('Refresh rate', currency)
  }

  function handleRefreshAll() {
    toast.success('Exchange rates refreshed')
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[24px] text-[#043793] font-bold">Currency</h1>
          <p className="text-[13px] text-[#94A3B8]">Exchange rate management and base currency configuration</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefreshAll}
            className="h-10 px-4 rounded-full bg-[#F1F5F9] text-gray-700 flex items-center gap-1.5 text-sm font-medium hover:bg-gray-200 transition border border-slate-200"
          >
            <RefreshCw size={16} />
            Refresh Rates
          </button>
          <button
            onClick={openCreate}
            className="h-10 px-4 rounded-full bg-[linear-gradient(#093055,#043793)] text-white flex items-center gap-2 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            <Plus size={18} />
            Add Currency
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {statCards.map((card) => (
          <SimpleStatCard
            key={card.id}
            count={card.count}
            label={card.label}
            textColor={card.textColor}
          />
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 mb-6 max-w-xs">
        <Search size={14} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search currency code, name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm outline-none flex-1 bg-transparent"
        />
      </div>

      {/* Currency Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCurrencies.map((currency) => (
          <CurrencyCard
            key={currency.id}
            currency={currency}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefresh={handleRefresh}
          />
        ))}
      </div>

      {filteredCurrencies.length === 0 && (
        <div className="text-center text-sm text-slate-400 py-12">
          No currencies found.
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CurrencyForm currency={editing} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  )
}

export default Currency
