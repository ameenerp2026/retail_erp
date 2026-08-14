import { useMemo, useState } from 'react'
import { Download, Plus, Search } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import ReusableTable from '@/components/shared/ReusableTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { subLedgerService } from '@/services/admin/finance/subLedgerService'
import type { SubLedger, SubLedgerType, SubLedgerStat } from '@/types/subLedger'
import { getSubLedgerColumns } from '../components/SubLedger/SubLedgerColumns'
import AddSubLedgerModal, {
  type CreateSubLedgerFormValues,
} from '../components/SubLedger/AddSubLedgerModal'
import SubLedgerDetailDrawer from '../components/SubLedger/SubLedgerDetailDrawer'

type TypeTab = 'All' | SubLedgerType
const TYPE_TABS: TypeTab[] = ['All', 'Customer', 'Vendor', 'Employee']

const TONE_CLASS = {
  default: 'text-[#043793]',
  teal: 'text-teal-600',
  danger: 'text-rose-600',
} as const

export default function SubLedgerPage() {
  const [search, setSearch] = useState('')
  const [typeTab, setTypeTab] = useState<TypeTab>('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSubLedger, setEditingSubLedger] = useState<SubLedger | null>(null)
  const [deletingSubLedger, setDeletingSubLedger] = useState<SubLedger | null>(null)
  const [selectedSubLedger, setSelectedSubLedger] = useState<SubLedger | null>(null)
  const queryClient = useQueryClient()

  const { data: rows = [], isLoading: rowsLoading } = useQuery({
    queryKey: ['sub-ledgers'],
    queryFn: subLedgerService.getSubLedgers,
  })

  const stats = useMemo<SubLedgerStat[]>(() => {
    const total = rows.length
    const customers = rows.filter((r) => r.type === 'Customer').length
    const vendors = rows.filter((r) => r.type === 'Vendor').length
    const highRisk = rows.filter((r) => r.risk === 'High').length

    return [
      { id: 'total', label: 'Total Sub Ledgers', value: String(total), tone: 'default' },
      { id: 'customers', label: 'Customers', value: String(customers), tone: 'default' },
      { id: 'vendors', label: 'Vendors', value: String(vendors), tone: 'teal' },
      { id: 'high-risk', label: 'High Risk', value: String(highRisk), tone: 'danger' },
    ]
  }, [rows])

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (typeTab !== 'All' && row.type !== typeTab) return false
      if (!search) return true
      const q = search.toLowerCase()
      return (
        row.name.toLowerCase().includes(q) ||
        row.code.toLowerCase().includes(q) ||
        row.linkedLedger.toLowerCase().includes(q)
      )
    })
  }, [rows, search, typeTab])

  const createMutation = useMutation({
    mutationFn: subLedgerService.create,
    onSuccess: (created) => {
      queryClient.setQueryData<SubLedger[]>(['sub-ledgers'], (prev = []) => [created, ...prev])
      setModalOpen(false)
      toast.success(`Sub Ledger "${created.name}" created successfully`)
    },
    onError: (error: any) => {
      const fieldErrors = (error?.response?.data?.errors ?? {}) as Record<string, string[]>
      const apiMessage =
        error?.response?.data?.error ||
        Object.values(fieldErrors)?.[0]?.[0] ||
        'Failed to create sub ledger'
      toast.error(apiMessage)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof subLedgerService.update>[1] }) =>
      subLedgerService.update(id, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData<SubLedger[]>(['sub-ledgers'], (prev = []) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      )
      setModalOpen(false)
      setEditingSubLedger(null)
      // keep the drawer in sync if the edited row is currently open in it
      setSelectedSubLedger((prev) => (prev && prev.id === updated.id ? updated : prev))
      toast.success(`Sub Ledger "${updated.name}" updated successfully`)
    },
    onError: (error: any) => {
      const fieldErrors = (error?.response?.data?.errors ?? {}) as Record<string, string[]>
      const apiMessage =
        error?.response?.data?.error ||
        Object.values(fieldErrors)?.[0]?.[0] ||
        'Failed to update sub ledger'
      toast.error(apiMessage)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => subLedgerService.delete(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<SubLedger[]>(['sub-ledgers'], (prev = []) => prev.filter((r) => r.id !== id))
      setDeletingSubLedger(null)
      // close the drawer if the deleted row was open in it
      setSelectedSubLedger((prev) => (prev && prev.id === id ? null : prev))
      toast.success('Sub Ledger deleted')
    },
    onError: (error: any) => {
      const apiMessage = error?.response?.data?.error || 'Failed to delete sub ledger'
      toast.error(apiMessage)
    },
  })

  const handleCreate = (values: CreateSubLedgerFormValues) => {
    createMutation.mutate({
      subLedgerName: values.name.trim(),
      ledgerId: values.linkedLedgerId as number,
      type: values.type as SubLedgerType,
      balanceType: values.balanceType === 'Debit' ? 'debit' : 'credit',
      openingBalance: values.openingBalance ? Number(values.openingBalance) : 0,
      creditLimit: values.creditLimit ? Number(values.creditLimit) : null,
      status: values.status === 'Active' ? 'active' : 'inactive',
    })
  }

  const handleUpdate = (values: CreateSubLedgerFormValues) => {
    if (!editingSubLedger) return
    updateMutation.mutate({
      id: editingSubLedger.id,
      payload: {
        subLedgerName: values.name.trim(),
        ledgerId: values.linkedLedgerId as number,
        type: values.type as SubLedgerType,
        balanceType: values.balanceType === 'Debit' ? 'debit' : 'credit',
        openingBalance: values.openingBalance ? Number(values.openingBalance) : 0,
        creditLimit: values.creditLimit ? Number(values.creditLimit) : null,
        status: values.status === 'Active' ? 'active' : 'inactive',
      },
    })
  }

  const openCreate = () => {
    setEditingSubLedger(null)
    setModalOpen(true)
  }

  const openEdit = (row: SubLedger) => {
    setEditingSubLedger(row)
    setModalOpen(true)
  }

  const handleDelete = (row: SubLedger) => {
    setDeletingSubLedger(row)
  }

  const confirmDelete = () => {
    if (!deletingSubLedger) return
    deleteMutation.mutate(deletingSubLedger.id)
  }

  const openDetail = (row: SubLedger) => {
    setSelectedSubLedger(row)
  }

  const closeDetail = () => {
    setSelectedSubLedger(null)
  }

  if (rowsLoading) {
    return <div className="page-shell text-sm text-slate-500">Loading...</div>
  }

  const editingInitialValues: CreateSubLedgerFormValues | undefined = editingSubLedger
    ? {
        name: editingSubLedger.name,
        linkedLedgerId: editingSubLedger.linkedLedgerId,
        type: editingSubLedger.type,
        openingBalance: String(editingSubLedger.openingBalanceRaw),
        balanceType: editingSubLedger.balanceType,
        creditLimit: editingSubLedger.creditLimitRaw != null ? String(editingSubLedger.creditLimitRaw) : '',
        status: editingSubLedger.status,
      }
    : undefined

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sub Ledger Management</h1>
          <p className="page-subtitle">Configure detailed party-wise financial tracking</p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-[14px] border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-500 sm:px-4"
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
            <span className="hidden sm:inline">Add Sub Ledger</span>
          </button>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="rounded-[14px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <p className={`stat-value ${TONE_CLASS[stat.tone]}`}>{stat.value}</p>
            <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            size={14}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, code..."
            className="h-9 w-full rounded-xl border border-slate-200 bg-white pr-3 pl-9 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {TYPE_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setTypeTab(tab)}
              className={`h-8 rounded-lg px-3 text-xs font-semibold transition ${
                typeTab === tab
                  ? 'bg-[#043793] text-white'
                  : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <ReusableTable
        columns={getSubLedgerColumns({ onEdit: openEdit, onDelete: handleDelete })}
        data={filtered}
        onRowClick={openDetail}
      />

      <AddSubLedgerModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingSubLedger(null)
        }}
        onSubmit={editingSubLedger ? handleUpdate : handleCreate}
        isSubmitting={editingSubLedger ? updateMutation.isPending : createMutation.isPending}
        mode={editingSubLedger ? 'edit' : 'create'}
        subLedgerCode={editingSubLedger?.code}
        initialValues={editingInitialValues}
      />

      <SubLedgerDetailDrawer
        isOpen={selectedSubLedger !== null}
        onClose={closeDetail}
        subLedger={selectedSubLedger}
        onEdit={(row) => {
          closeDetail()
          openEdit(row)
        }}
        onDelete={(row) => {
          closeDetail()
          handleDelete(row)
        }}
      />

      <ConfirmDialog
        isOpen={deletingSubLedger !== null}
        title="Delete Sub Ledger?"
        message={`Are you sure you want to remove "${deletingSubLedger?.name}" from active sub ledgers?`}
        warningMessage="Sub Ledger linked with financial transactions. Only deactivation allowed."
        confirmLabel="Deactivate Instead"
        variant="warning"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingSubLedger(null)}
        disabled={deleteMutation.isPending}
      />
    </div>
  )
}