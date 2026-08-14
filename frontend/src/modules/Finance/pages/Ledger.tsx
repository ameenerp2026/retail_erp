import { useMemo, useState } from 'react'
import { Download, Filter, Plus, Search } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import ReusableTable from '@/components/shared/ReusableTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { ledgerService } from '@/services/admin/finance/ledgerService'
import type { Ledger, LedgerAccountGroup } from '@/types/ledger'
import { getLedgerColumns } from '../components/Ledger/LedgerColumns'
import CreateLedgerModal, {
  type CreateLedgerFormValues,
} from '../components/Ledger/CreateLedgerModal'

const GROUP_DOT: Record<LedgerAccountGroup, string> = {
  Assets: 'bg-blue-500',
  Liabilities: 'bg-rose-500',
  Income: 'bg-emerald-500',
  Expenses: 'bg-amber-500',
}

type LedgerGroupStat = {
  id: string
  group: LedgerAccountGroup
  value: string
  ledgerCount: number
}

export default function LedgerPage() {
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingLedger, setEditingLedger] = useState<Ledger | null>(null)
  const [deletingLedger, setDeletingLedger] = useState<Ledger | null>(null)
  const queryClient = useQueryClient()

  const { data: ledgers = [], isLoading: ledgersLoading } = useQuery({
    queryKey: ['ledgers'],
    queryFn: ledgerService.getLedgers,
  })

  const GROUP_ORDER: LedgerAccountGroup[] = ['Assets', 'Liabilities', 'Income', 'Expenses']

  const formatLakh = (value: number) => {
    const lakhs = value / 100000
    return `₹${lakhs.toFixed(1)}L`
  }

  const stats = useMemo<LedgerGroupStat[]>(() => {
    const grouped = ledgers.reduce((acc, ledger) => {
      const group = ledger.accountGroup
      if (!group) return acc

      if (!acc[group]) {
        acc[group] = { total: 0, count: 0 }
      }

      const numericValue = Number(String(ledger.openingBalance).replace(/[^0-9.-]/g, '')) || 0

      acc[group].total += numericValue
      acc[group].count += 1

      return acc
    }, {} as Record<string, { total: number; count: number }>)

    return GROUP_ORDER.map((group) => {
      const entry = grouped[group] ?? { total: 0, count: 0 }
      return {
        id: group,
        group,
        value: formatLakh(entry.total),
        ledgerCount: entry.count,
      }
    })
  }, [ledgers])

  const filtered = useMemo(() => {
    if (!search) return ledgers
    const q = search.toLowerCase()
    return ledgers.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.ledgerId.toLowerCase().includes(q) ||
        (row.accountClass?.className.toLowerCase().includes(q) ?? false) ||
        row.accountGroup?.toLowerCase().includes(q)
    )
  }, [ledgers, search])

  const createMutation = useMutation({
    mutationFn: ledgerService.create,
    onSuccess: (created) => {
      queryClient.setQueryData<Ledger[]>(['ledgers'], (prev = []) => [created, ...prev])
      setModalOpen(false)
      toast.success(`Ledger "${created.name}" created successfully`)
    },
    onError: (error: any) => {
      const fieldErrors = (error?.response?.data?.errors ?? {}) as Record<string, string[]>
      const apiMessage =
        error?.response?.data?.error ||
        Object.values(fieldErrors)?.[0]?.[0] ||
        'Failed to create ledger'
      toast.error(apiMessage)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof ledgerService.update>[1] }) =>
      ledgerService.update(id, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData<Ledger[]>(['ledgers'], (prev = []) =>
        prev.map((l) => (l.id === updated.id ? updated : l))
      )
      setModalOpen(false)
      setEditingLedger(null)
      toast.success(`Ledger "${updated.name}" updated successfully`)
    },
    onError: (error: any) => {
      const fieldErrors = (error?.response?.data?.errors ?? {}) as Record<string, string[]>
      const apiMessage =
        error?.response?.data?.error ||
        Object.values(fieldErrors)?.[0]?.[0] ||
        'Failed to update ledger'
      toast.error(apiMessage)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ledgerService.delete(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<Ledger[]>(['ledgers'], (prev = []) => prev.filter((l) => l.id !== id))
      setDeletingLedger(null)
      toast.success('Ledger deleted')
    },
    onError: (error: any) => {
      const apiMessage = error?.response?.data?.error || 'Failed to delete ledger'
      toast.error(apiMessage)
    },
  })

  const handleCreate = (values: CreateLedgerFormValues) => {
    createMutation.mutate({
      ledgerName: values.name.trim(),
      accountGroupId: values.accountGroupId as number,
      accountClassId: values.accountClassId as number,
      balanceType: values.balanceType === 'Debit' ? 'debit' : 'credit',
      openingBalance: values.openingBalance ? Number(values.openingBalance) : 0,
      organizationUnitId: values.organizationUnitId === '' ? null : values.organizationUnitId,
      gstApplicable: values.gstEnabled,
    })
  }

  const handleUpdate = (values: CreateLedgerFormValues) => {
    if (!editingLedger) return
    updateMutation.mutate({
      id: editingLedger.id,
      payload: {
        ledgerName: values.name.trim(),
        accountGroupId: values.accountGroupId as number,
        accountClassId: values.accountClassId as number,
        balanceType: values.balanceType === 'Debit' ? 'debit' : 'credit',
        openingBalance: values.openingBalance ? Number(values.openingBalance) : 0,
        organizationUnitId: values.organizationUnitId === '' ? null : values.organizationUnitId,
        gstApplicable: values.gstEnabled,
      },
    })
  }

  const openCreate = () => {
    setEditingLedger(null)
    setModalOpen(true)
  }

  const openEdit = (ledger: Ledger) => {
    setEditingLedger(ledger)
    setModalOpen(true)
  }

  const handleDelete = (ledger: Ledger) => {
    setDeletingLedger(ledger)
  }

  const confirmDelete = () => {
    if (!deletingLedger) return
    deleteMutation.mutate(deletingLedger.id)
  }

  if (ledgersLoading) {
    return <div className="page-shell text-sm text-slate-500">Loading...</div>
  }

  const editingInitialValues: CreateLedgerFormValues | undefined = editingLedger
    ? {
        name: editingLedger.name,
        accountGroupId: editingLedger.accountGroupId,
        accountClassId: editingLedger.accountClass?.id ?? '',
        balanceType: editingLedger.balanceType,
        openingBalance: String(editingLedger.openingBalanceRaw),
        organizationUnitId: editingLedger.organizationUnitId ?? '',
        gstEnabled: editingLedger.gstEnabled,
      }
    : undefined

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Ledger</h1>
          <p className="page-subtitle">Chart of accounts and ledger management</p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-[14px] border border-slate-200 bg-[#F5F7FB] px-3 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 sm:px-4"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="flex h-9 items-center gap-2 rounded-[14px] bg-[linear-gradient(#093055,#043793)] px-3 text-xs font-semibold text-white sm:px-4"
          >
            <Plus size={13} />
            <span className="hidden sm:inline">Create Ledger</span>
          </button>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="rounded-[14px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${GROUP_DOT[stat.group] ?? 'bg-slate-300'}`} />
              <p className="text-xs text-slate-500">{stat.group}</p>
            </div>
            <p className="stat-value text-[#043793]">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-400">{stat.ledgerCount} ledgers</p>
          </div>
        ))}
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            size={14}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ledger name, group..."
            className="h-9 w-full rounded-xl border border-slate-200 bg-white pr-3 pl-9 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
          />
        </div>
        <button
          type="button"
          className="flex h-9 items-center gap-2 rounded-[14px] border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-500"
        >
          <Filter size={13} />
          Filters
        </button>
      </div>

      <ReusableTable
        columns={getLedgerColumns({ onEdit: openEdit, onDelete: handleDelete })}
        data={filtered}
      />

      <CreateLedgerModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingLedger(null)
        }}
        onSubmit={editingLedger ? handleUpdate : handleCreate}
        isSubmitting={editingLedger ? updateMutation.isPending : createMutation.isPending}
        mode={editingLedger ? 'edit' : 'create'}
        ledgerId={editingLedger?.ledgerId}
        initialValues={editingInitialValues}
      />

      <ConfirmDialog
        isOpen={deletingLedger !== null}
        title="Delete Ledger"
        message={`Delete ledger "${deletingLedger?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingLedger(null)}
        disabled={deleteMutation.isPending}
      />
    </div>
  )
}