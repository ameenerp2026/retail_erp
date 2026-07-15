import { useMemo, useState } from 'react'
import { Download, Filter, Plus, Search } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import ReusableTable from '@/components/shared/ReusableTable'
import { ledgerService } from '@/services/ledgerService'
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

export default function LedgerPage() {
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: stats = [], isLoading: statsLoading } = useQuery({
    queryKey: ['ledger-stats'],
    queryFn: ledgerService.getStats,
  })

  const { data: ledgers = [], isLoading: ledgersLoading } = useQuery({
    queryKey: ['ledgers'],
    queryFn: ledgerService.getLedgers,
  })

  const filtered = useMemo(() => {
    if (!search) return ledgers
    const q = search.toLowerCase()
    return ledgers.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.ledgerId.toLowerCase().includes(q) ||
        row.accountClass.toLowerCase().includes(q) ||
        row.accountGroup.toLowerCase().includes(q)
    )
  }, [ledgers, search])

  const handleCreate = (values: CreateLedgerFormValues) => {
    const nextId = ledgers.length + 1
    const created: Ledger = {
      id: String(nextId),
      ledgerId: `LED-${String(nextId).padStart(3, '0')}`,
      name: values.name.trim(),
      accountClass: values.accountClass,
      accountGroup: values.accountGroup as LedgerAccountGroup,
      openingBalance: values.openingBalance
        ? `₹${values.openingBalance}`
        : '₹0',
      balanceType: values.balanceType as Ledger['balanceType'],
      gstEnabled: values.gstEnabled,
      status: 'Active',
    }

    queryClient.setQueryData<Ledger[]>(['ledgers'], (prev = []) => [created, ...prev])
  }

  if (statsLoading || ledgersLoading) {
    return <div className="page-shell text-sm text-slate-500">Loading...</div>
  }

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
            onClick={() => setCreateOpen(true)}
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
              <span className={`h-2 w-2 rounded-full ${GROUP_DOT[stat.group]}`} />
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

      <ReusableTable columns={getLedgerColumns()} data={filtered} />

      <CreateLedgerModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  )
}
