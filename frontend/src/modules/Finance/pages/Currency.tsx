import { useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { currencyService } from '@/services/admin/finance/currencyService'
import type { CurrencyRecord } from '@/types/currency'
import { Modal } from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import CurrencyCard from '@/modules/Finance/components/Currency/CurrencyCard'
import CurrencyForm from '@/modules/Finance/components/Currency/CurrencyForm'
import type { CurrencyFormData } from '@/components/forms/validate.schema'

export default function CurrencyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState<CurrencyRecord | null>(null)
  const [deleting, setDeleting] = useState<CurrencyRecord | null>(null)
  const queryClient = useQueryClient()

  const { data: currencies = [], isLoading } = useQuery({
    queryKey: ['currencies'],
    queryFn: currencyService.getAll,
  })

  const createMutation = useMutation({
    mutationFn: currencyService.create,
    onSuccess: (created) => {
      queryClient.setQueryData<CurrencyRecord[]>(['currencies'], (prev = []) =>
        // if the new one is base, un-base the others in the cache too
        created.isBase
          ? [created, ...prev.map((c) => ({ ...c, isBase: false }))]
          : [created, ...prev]
      )
      closeModal()
      toast.success('Currency added successfully!')
    },
    onError: (error: any) => {
      const fieldErrors = (error?.response?.data?.errors ?? {}) as Record<string, string[]>
      const apiMessage =
        error?.response?.data?.error ||
        Object.values(fieldErrors)?.[0]?.[0] ||
        'Failed to add currency'
      toast.error(apiMessage)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof currencyService.update>[1] }) =>
      currencyService.update(id, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData<CurrencyRecord[]>(['currencies'], (prev = []) =>
        prev.map((c) => {
          if (c.id === updated.id) return updated
          // un-base every other currency in the cache if this one became base
          return updated.isBase ? { ...c, isBase: false } : c
        })
      )
      closeModal()
      toast.success('Currency updated successfully!')
    },
    onError: (error: any) => {
      const fieldErrors = (error?.response?.data?.errors ?? {}) as Record<string, string[]>
      const apiMessage =
        error?.response?.data?.error ||
        Object.values(fieldErrors)?.[0]?.[0] ||
        'Failed to update currency'
      toast.error(apiMessage)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => currencyService.delete(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<CurrencyRecord[]>(['currencies'], (prev = []) => prev.filter((c) => c.id !== id))
      setDeleting(null)
      toast.success('Currency deleted')
    },
    onError: (error: any) => {
      const apiMessage = error?.response?.data?.error || 'Failed to delete currency'
      toast.error(apiMessage)
      setDeleting(null)
    },
  })

  const refreshMutation = useMutation({
    mutationFn: (id: string) => currencyService.refreshRate(id),
    onSuccess: (updated) => {
      queryClient.setQueryData<CurrencyRecord[]>(['currencies'], (prev = []) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      )
      toast.success(`${updated.code} rate refreshed`)
    },
    onError: () => {
      toast.error('Failed to refresh rate')
    },
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

  function handleFormSubmit(data: CurrencyFormData) {
    const payload = {
      code: data.code.trim(),
      name: data.name.trim(),
      symbol: data.symbol.trim(),
      exchangeRate: Number(data.exchangeRate),
      isBase: data.isBase,
    }
    if (editing) {
      updateMutation.mutate({ id: editing.id, payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  function handleDelete(currency: CurrencyRecord) {
    setDeleting(currency)
  }

  function confirmDelete() {
    if (!deleting) return
    deleteMutation.mutate(deleting.id)
  }

  function handleRefresh(currency: CurrencyRecord) {
    refreshMutation.mutate(currency.id)
  }

  function handleRefreshAll() {
    currencies.forEach((currency) => refreshMutation.mutate(currency.id))
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
            onClick={handleRefreshAll}
            disabled={refreshMutation.isPending}
            className="flex h-9 items-center gap-2 rounded-[14px] border border-slate-200 bg-[#F5F7FB] px-3 text-xs font-semibold text-slate-500 disabled:opacity-50 sm:px-4"
          >
            <RefreshCw size={13} className={refreshMutation.isPending ? 'animate-spin' : ''} />
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
        <CurrencyForm
          currency={editing}
          onClose={closeModal}
          onSubmit={handleFormSubmit}
          isSubmitting={editing ? updateMutation.isPending : createMutation.isPending}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleting !== null}
        title="Delete Currency?"
        message={`Are you sure you want to remove "${deleting?.name}" from your currencies?`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
        disabled={deleteMutation.isPending}
      />
    </div>
  )
}