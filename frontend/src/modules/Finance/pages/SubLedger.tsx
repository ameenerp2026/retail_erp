import { useMemo, useState } from 'react'
import { Download, Plus, Search } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import ReusableTable from '@/components/shared/ReusableTable'
import { subLedgerService } from '@/services/subLedgerService'
import type { SubLedger, SubLedgerType } from '@/types/subLedger'
import { getSubLedgerColumns } from '../components/SubLedger/SubLedgerColumns'
import AddSubLedgerModal, {
  type CreateSubLedgerFormValues,
} from '../components/SubLedger/AddSubLedgerModal'

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
  const [createOpen, setCreateOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: stats = [], isLoading: statsLoading } = useQuery({
    queryKey: ['sub-ledger-stats'],
    queryFn: subLedgerService.getStats,
  })

  const { data: rows = [], isLoading: rowsLoading } = useQuery({
    queryKey: ['sub-ledgers'],
    queryFn: subLedgerService.getSubLedgers,
  })

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

  const handleCreate = (values: CreateSubLedgerFormValues) => {
    const nextId = rows.length + 1
    const created: SubLedger = {
      id: String(nextId),
      name: values.name.trim(),
      code: `SL-${String(nextId).padStart(3, '0')}`,
      linkedLedger: values.linkedLedger,
      type: values.type as SubLedgerType,
      openingBalance: values.openingBalance
        ? `₹${values.openingBalance}`
        : '₹0',
      creditLimit: values.creditLimit ? `₹${values.creditLimit}` : null,
      creditUsagePct: values.creditLimit ? 0 : null,
      risk: 'Low',
      status: values.status,
    }

    queryClient.setQueryData<SubLedger[]>(['sub-ledgers'], (prev = []) => [
      created,
      ...prev,
    ])
  }

  if (statsLoading || rowsLoading) {
    return <div className="page-shell text-sm text-slate-500">Loading...</div>
  }

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
            onClick={() => setCreateOpen(true)}
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

      <ReusableTable columns={getSubLedgerColumns()} data={filtered} />

      <AddSubLedgerModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  )
}
