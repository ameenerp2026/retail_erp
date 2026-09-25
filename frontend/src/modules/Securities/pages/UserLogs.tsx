import { useMemo, useState } from 'react'
import {
  Search,
  Download,
  Clock,
  ChevronDown,
  AlertTriangle,
  Info,
  XCircle,
  CheckCircle2,
} from 'lucide-react'
import DateRangeDropdown, { type DateRange } from '../components/UserLogs/DateRangeDropdown'

type Severity = 'Info' | 'Warning' | 'Error' | 'Success'

type AuditLog = {
  id: string
  severity: Severity
  action: string
  module: string
  actor: string
  detail: string
  timestamp: Date
  ip: string
  diff?: { before: unknown; after: unknown }
}

const LOGS: AuditLog[] = [
  {
    id: 'log-1',
    severity: 'Warning',
    action: 'ROLE_PERMISSION_UPDATE',
    module: 'Securities',
    actor: 'Admin User',
    detail: 'Role: Branch Manager',
    timestamp: new Date(2026, 4, 21, 14, 32, 18),
    ip: '10.0.1.14',
    diff: {
      before: { permissions: ['View Ledger'] },
      after: { permissions: ['View Ledger', 'Edit Ledger', 'Delete Ledger'] },
    },
  },
  {
    id: 'log-2',
    severity: 'Info',
    action: 'LEDGER_CREATE',
    module: 'Finance',
    actor: 'Priya Sharma',
    detail: 'Ledger: Sales - Export',
    timestamp: new Date(2026, 4, 21, 13, 48, 5),
    ip: '10.0.1.22',
  },
  {
    id: 'log-3',
    severity: 'Error',
    action: 'LOGIN_FAILED',
    module: 'Auth',
    actor: 'System',
    detail: 'User: unknown@hack.com',
    timestamp: new Date(2026, 4, 21, 12, 15, 44),
    ip: '192.168.99.12',
  },
  {
    id: 'log-4',
    severity: 'Info',
    action: 'ORG_UNIT_UPDATE',
    module: 'Organization',
    actor: 'Raj Kumar',
    detail: 'Org Unit: Delhi North',
    timestamp: new Date(2026, 4, 21, 11, 2, 31),
    ip: '10.0.2.08',
  },
  {
    id: 'log-5',
    severity: 'Success',
    action: 'EINVOICE_GENERATE',
    module: 'Utilities',
    actor: 'Meena Joshi',
    detail: 'Invoice: INV-2024-0890',
    timestamp: new Date(2026, 4, 21, 10, 22, 18),
    ip: '10.0.1.31',
  },
  {
    id: 'log-6',
    severity: 'Success',
    action: 'DATA_IMPORT_COMPLETE',
    module: 'Utilities',
    actor: 'System',
    detail: 'Import: ledger_master.csv',
    timestamp: new Date(2026, 4, 21, 9, 12, 0),
    ip: '10.0.0.1',
  },
]

const FILTERS: Array<'All' | Severity> = ['All', 'Info', 'Warning', 'Error', 'Success']

const SEVERITY_META: Record<Severity, { icon: typeof Info; badge: string; text: string }> = {
  Info: { icon: Info, badge: 'bg-blue-50 text-blue-600', text: 'text-blue-600' },
  Warning: { icon: AlertTriangle, badge: 'bg-amber-50 text-amber-600', text: 'text-amber-600' },
  Error: { icon: XCircle, badge: 'bg-rose-50 text-rose-600', text: 'text-rose-600' },
  Success: { icon: CheckCircle2, badge: 'bg-emerald-50 text-emerald-600', text: 'text-emerald-600' },
}

const MODULE_STYLES: Record<string, string> = {
  Securities: 'bg-blue-50 text-blue-600',
  Finance: 'bg-violet-50 text-violet-600',
  Auth: 'bg-rose-50 text-rose-600',
  Organization: 'bg-sky-50 text-sky-600',
  Utilities: 'bg-teal-50 text-teal-600',
}

function formatJson(value: unknown) {
  return JSON.stringify(value, null, 2)
}

function formatDateTime(d: Date) {
  const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  return `${date} ${time}`
}

function endOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)
}

export default function UserLogs() {
  const [activeFilter, setActiveFilter] = useState<'All' | Severity>('All')
  const [query, setQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>('log-1')

  const [isDateOpen, setIsDateOpen] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null })

  const filteredLogs = useMemo(() => {
    const q = query.trim().toLowerCase()
    return LOGS.filter((log) => {
      const matchesFilter = activeFilter === 'All' || log.severity === activeFilter
      const matchesQuery =
        !q ||
        log.actor.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.module.toLowerCase().includes(q) ||
        log.detail.toLowerCase().includes(q)
      const matchesDate =
        !dateRange.start ||
        (log.timestamp >= dateRange.start && log.timestamp <= endOfDay(dateRange.end ?? dateRange.start))
      return matchesFilter && matchesQuery && matchesDate
    })
  }, [activeFilter, query, dateRange])

  function toggleExpanded(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  function handleApplyDateRange(range: DateRange) {
    setDateRange(range)
    setIsDateOpen(false)
  }

  const dateButtonLabel = dateRange.start
    ? `${dateRange.start.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}${
        dateRange.end && !isSameCalendarDay(dateRange.start, dateRange.end)
          ? ` – ${dateRange.end.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`
          : ''
      }`
    : 'Posted Date'

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#043793]">User Audit Logs</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">Detailed system activity and user action trail</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <Download size={15} />
            Export Logs
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[260px] max-w-sm">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search user, action, module..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A]/10"
          />
        </div>

        <div className="flex items-center gap-2">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-[#1B2A4A] text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {filter}
              </button>
            )
          })}
          <div className="relative ml-auto">
            <button
              type="button"
              onClick={() => setIsDateOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <Clock size={15} />
              {dateButtonLabel}
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${isDateOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDateOpen && (
              <DateRangeDropdown value={dateRange} onApply={handleApplyDateRange} onCancel={() => setIsDateOpen(false)} />
            )}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {filteredLogs.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-slate-400">No matching log entries.</div>
        ) : (
          filteredLogs.map((log, idx) => {
            const meta = SEVERITY_META[log.severity]
            const SeverityIcon = meta.icon
            const isExpanded = expandedId === log.id
            const canExpand = Boolean(log.diff)

            return (
              <div key={log.id} className={idx !== 0 ? 'border-t border-slate-100' : ''}>
                <button
                  type="button"
                  onClick={() => canExpand && toggleExpanded(log.id)}
                  className={`flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition ${
                    canExpand ? 'cursor-pointer hover:bg-slate-50/60' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${meta.badge}`}>
                      <SeverityIcon size={14} />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[13px] font-semibold tracking-wide ${meta.text}`}>{log.severity}</span>
                        <span className="text-[13px] font-semibold text-[#043793]">{log.action}</span>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                            MODULE_STYLES[log.module] ?? 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {log.module}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        {log.actor} · {log.detail}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-slate-500">{formatDateTime(log.timestamp)}</div>
                      <div className="text-xs text-slate-300">IP {log.ip}</div>
                    </div>
                    {canExpand && (
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    )}
                  </div>
                </button>

                {canExpand && isExpanded && log.diff && (
                  <div className="px-5 pb-5">
                    <pre className="overflow-x-auto rounded-xl bg-slate-50 px-4 py-3.5 text-xs leading-relaxed text-slate-600">
                      {`{\n  "before": ${formatJson(log.diff.before).replace(/\n/g, '\n  ')},\n  "after": ${formatJson(
                        log.diff.after
                      ).replace(/\n/g, '\n  ')}\n}`}
                    </pre>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function isSameCalendarDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}