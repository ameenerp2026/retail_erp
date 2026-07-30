import { useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { currencyService } from '@/services/currencyService'
import type { CurrencyRecord } from '@/types/currency'
import { Modal } from '@/components/shared/Modal'
import CurrencyCard from '@/modules/Finance/components/Currency/CurrencyCard'
import CurrencyForm from '@/modules/Finance/components/Currency/CurrencyForm'

export default function CurrencyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState<CurrencyRecord | null>(null)

  const { data: currencies = [], isLoading } = useQuery({
    queryKey: ['currencies'],
    queryFn: currencyService.getAll,
  })

  function openAdd() {
    setEditing(null)
    setIsModalOpen(true)
  }

  function openEdit(currency: CurrencyRecord) {
    setEditing(currency)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditing(null)
  }

  function handleDelete(currency: CurrencyRecord) {
    console.log('Delete', currency)
  }

  function handleRefresh(currency: CurrencyRecord) {
    console.log('Refresh', currency)
  }

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
            onClick={openAdd}
            className="flex h-9 items-center gap-2 rounded-[14px] bg-[linear-gradient(#093055,#043793)] px-3 text-xs font-semibold text-white sm:px-4"
          >
            <Plus size={13} />
            <span className="hidden sm:inline">Add Currency</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {currencies.map((currency) => (
          <CurrencyCard
            key={currency.id}
            currency={currency}
            onEdit={openEdit}
            onDelete={handleDelete}
            onRefresh={handleRefresh}
          />
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} maxWidth="lg">
        <CurrencyForm currency={editing} onClose={closeModal} />
      </Modal>
    </div>
  )
}
