import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Info,
  Search,
  XCircle,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { securitiesService } from '@/services/securitiesService'
import type { AuditSeverity } from '@/types/securities'

type SeverityTab = 'All' | AuditSeverity
const SEVERITY_TABS: SeverityTab[] = ['All', 'Info', 'Warning', 'Error', 'Success']

const SEVERITY_STYLE: Record<
  AuditSeverity,
  { className: string; icon: typeof Info }
> = {
  Success: { className: 'bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
  Info: { className: 'bg-sky-50 text-sky-700', icon: Info },
  Warning: { className: 'bg-amber-50 text-amber-700', icon: AlertTriangle },
  Error: { className: 'bg-rose-50 text-rose-700', icon: XCircle },
}

export default function UserLogsPage() {
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState<SeverityTab>('All')
  const [expandedId, setExpandedId] = useState<string | null>('1')

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['user-logs'],
    queryFn: securitiesService.getUserLogs,
  })

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      if (severity !== 'All' && log.severity !== severity) return false
      if (!search) return true
      const q = search.toLowerCase()
      return (
        log.action.toLowerCase().includes(q) ||
        log.module.toLowerCase().includes(q) ||
        log.summary.toLowerCase().includes(q)
      )
    })
  }, [logs, search, severity])

  if (isLoading) {
    return <div className="page-shell text-sm text-slate-500">Loading...</div>
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Audit Logs</h1>
          <p className="page-subtitle">Detailed system activity and user action trail</p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-[14px] border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-500 sm:px-4"
          >
            <Download size={13} />
            Export Logs
          </button>
        </div>
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
            placeholder="Search user, action, module..."
            className="h-9 w-full rounded-xl border border-slate-200 bg-white pr-3 pl-9 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {SEVERITY_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSeverity(tab)}
              className={`h-8 rounded-lg px-3 text-xs font-semibold transition ${
                severity === tab
                  ? 'bg-[#043793] text-white'
                  : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="flex h-9 items-center gap-2 rounded-[14px] border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-500"
        >
          <Clock size={13} />
          Posted Date
        </button>
      </div>

      <div className="section-card divide-y divide-slate-100 p-0 sm:p-0">
        {filtered.map((log) => {
          const style = SEVERITY_STYLE[log.severity]
          const Icon = style.icon
          const expanded = expandedId === log.id

          return (
            <div key={log.id} className="px-4 py-4 sm:px-5">
              <button
                type="button"
                onClick={() => setExpandedId(expanded ? null : log.id)}
                className="flex w-full items-start gap-3 text-left"
              >
                <span
                  className={`mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${style.className}`}
                >
                  <Icon size={11} />
                  {log.severity}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-bold tracking-wide text-[#043793] uppercase">
                      {log.action}
                    </p>
                    <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600">
                      {log.module}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{log.summary}</p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-[11px] text-slate-500">{log.timestamp}</p>
                  <p className="mt-1 text-[11px] text-slate-400">IP: {log.ip}</p>
                </div>

                <span className="mt-1 shrink-0 text-slate-400">
                  {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
              </button>

              {expanded && (
                <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
